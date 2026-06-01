import { KairoRuntime } from "../minecraft/KairoRuntime";

import type { AddonProperties } from "@kairo-js/properties";
import { SeedRandom } from "@kairo-js/utils";
import type { KairoEventMap } from "../minecraft/KairoEventMap";
import { KairoApiRegistry } from "./api/KairoApiRegistry";
import { ActivationController } from "./activation/ActivationController";
import { KairoRouterError, KairoRouterErrorReason } from "./errors/KairoRouterError";
import { EventRegistry } from "./events/EventRegistry";
import { KairoAfterEvents } from "./events/KairoAfterEvents";
import { KairoBeforeEvents } from "./events/KairoBeforeEvents";
import { KairoStartupBeforeEvent } from "./events/classes/KairoStartupBeforeEvent";
import { InternalEvent } from "./events/types/InternalEvent";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { createKairoContext, KairoContext, type KairoContextMutator } from "./KairoContext";
import { KairoScheduler } from "./KairoScheduler";
import { ReadyState } from "./ReadyState";
import type { Disposable } from "./types/Disposable";

// kjs-router-ch 0001
export class KairoRouter {
    private kairoContext?: KairoContext;
    private kairoContextMutator?: KairoContextMutator;
    private runtime?: KairoRuntime<KairoEventMap>;
    private scheduler?: KairoScheduler;
    private activationCurrentTick = 0;
    private activationTickIntervalId?: number;
    private readyState = new ReadyState();
    private routerListener?: Disposable;
    private runtimeInjectedEventListener?: Disposable;
    private worldLoadListener?: Disposable;
    private initializer?: Disposable;
    private disposed = false;
    private startupSubscription?: Disposable;

    readonly apiRegistry = new KairoApiRegistry();

    private readonly startupEvent = new InternalEvent<KairoStartupBeforeEvent>(
        () => this.kairoContext?.isActive() ?? false,
        { requireActiveOnSubscribe: false, clearOnDeactivate: false },
    );

    private eventRegistry = new EventRegistry(() => {
        if (!this.kairoContext) return false;
        return this.kairoContext.isActive();
    });
    public readonly afterEvents = new KairoAfterEvents<KairoEventMap>(this.eventRegistry);
    public readonly beforeEvents = new KairoBeforeEvents<KairoEventMap>(this.eventRegistry, this.startupEvent);

    constructor() {
        this.startupSubscription = KairoRuntime.onStartup((ev) => {
            const isActive = () => this.kairoContext?.isActive() ?? false;
            const getAddonName = () => this.kairoContext?.isRegistered()
                ? this.kairoContext.kairoRegistry.name
                : undefined;
            this.startupEvent.emit(new KairoStartupBeforeEvent(ev, isActive, this.apiRegistry, getAddonName));
            this.apiRegistry.seal();
        });
    }

    get currentTick(): number {
        this.assertNotDisposed();

        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        if (this.activationTickIntervalId === undefined) {
            return 0;
        }
        return this.activationCurrentTick;
    }

    get systemInfo(): KairoContext {
        this.assertRunnable();
        return this.kairoContext!;
    }

    clearRun(runId: number): void {
        this.assertRunnable();
        this.scheduler!.clearRun(runId);
    }

    init(properties: AddonProperties): void {
        this.assertNotDisposed();

        if (this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        this.runtime = new KairoRuntime();
        this.scheduler = new KairoScheduler(this.runtime.scheduler);

        const { context, mutator } = createKairoContext(properties);
        this.kairoContext = context;
        this.kairoContextMutator = mutator;

        this.startWorldLoadListener(this.runtime);

        const initializer = new KairoInitializer(
            this.runtime,
            context,
            mutator,
            new SeedRandom(),
            this.readyState,
            () => {
                this.initializer = undefined;
                this.startRouterListener();
            },
            () => {
                this.initializer = undefined;
                this.dispose();
            },
        );

        this.initializer = initializer;
        initializer.setup();
    }

    waitForWorldLoad(): Promise<void> {
        this.assertNotDisposed();
        this.startWorldLoadListener(this.runtime ?? new KairoRuntime());
        return this.readyState.wait();
    }

    runInterval(callback: () => void, tickInterval?: number): number {
        this.assertRunnable();
        return this.scheduler!.runInterval(callback, tickInterval);
    }

    runTimeout(callback: () => void, tickDelay?: number): number {
        this.assertRunnable();
        return this.scheduler!.runTimeout(callback, tickDelay);
    }

    private dispose(): void {
        if (this.disposed) return;

        this.disposed = true;

        this.startupSubscription?.dispose();
        this.startupSubscription = undefined;

        this.apiRegistry.dispose();

        this.initializer?.dispose();
        this.initializer = undefined;

        this.stopActivationTickCounter();
        this.detachRuntimeEvents();

        this.routerListener?.dispose();
        this.routerListener = undefined;

        this.worldLoadListener?.dispose();
        this.worldLoadListener = undefined;

        this.eventRegistry.clearActiveScopedListeners();
        this.kairoContextMutator?.setActivationState("inactive");
        this.scheduler?.setActive(false);

        this.kairoContext = undefined;
        this.kairoContextMutator = undefined;
        this.scheduler = undefined;
        this.runtime = undefined;
    }

    private startWorldLoadListener(runtime: KairoRuntime<KairoEventMap>): void {
        if (this.readyState.isReady() || this.worldLoadListener) return;

        this.worldLoadListener = runtime.onReady(() => {
            this.worldLoadListener?.dispose();
            this.worldLoadListener = undefined;

            runtime.scheduler.runTimeout(() => {
                this.readyState.markReady();
            }, 1);
        });
    }

    private startRouterListener(): void {
        if (!this.runtime || !this.kairoContext || !this.kairoContextMutator) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        if (this.routerListener) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        const activationController = new ActivationController(
            this.runtime,
            this.kairoContext,
            this.kairoContextMutator,
            this.readyState,
            this.eventRegistry,
            {
                onActivate: () => {
                    this.startActivationTickCounter();
                    this.attachRuntimeEvents();
                    this.scheduler?.setActive(true);
                },
                onDeactivate: () => {
                    this.stopActivationTickCounter();
                    this.eventRegistry.clearActiveScopedListeners();
                    this.detachRuntimeEvents();
                    this.scheduler?.setActive(false);
                },
            },
        );
        activationController.setup();
    }

    private attachRuntimeEvents() {
        if (!this.runtime)
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        if (this.runtimeInjectedEventListener) return;

        this.runtimeInjectedEventListener = this.runtime.bindEvents((ev) => {
            try {
                if (ev.phase === "after") {
                    this.eventRegistry.emit("after", ev.name, ev.payload);
                } else if (ev.phase === "before") {
                    this.eventRegistry.emit("before", ev.name, ev.payload);
                }
            } catch {}
        });
    }

    private detachRuntimeEvents() {
        this.runtimeInjectedEventListener?.dispose();
        this.runtimeInjectedEventListener = undefined;
    }

    private startActivationTickCounter(): void {
        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        this.stopActivationTickCounter();
        this.activationCurrentTick = 0;
        this.activationTickIntervalId = this.runtime.scheduler.runInterval(() => {
            this.activationCurrentTick++;
        }, 1);
    }

    private stopActivationTickCounter(): void {
        if (!this.runtime) return;

        if (this.activationTickIntervalId !== undefined) {
            this.runtime.scheduler.clearRun(this.activationTickIntervalId);
            this.activationTickIntervalId = undefined;
        }

        this.activationCurrentTick = 0;
    }

    private assertRunnable(): void {
        this.assertNotDisposed();

        if (!this.kairoContext || !this.runtime || !this.scheduler) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        if (!this.kairoContext.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }
    }

    private assertNotDisposed(): void {
        if (this.disposed) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyDisposed);
        }
    }
}
