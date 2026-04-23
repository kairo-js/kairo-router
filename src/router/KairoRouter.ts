import { MinecraftRuntime } from "../minecraft/MinecraftRuntime";
import { AddonProperties } from "../types/AddonProperties";
import { SeedRandom } from "../utils/SeedRandom";
import { ActivationController } from "./activation/ActivationController";
import { KairoRouterError, KairoRouterErrorReason } from "./errors/KairoRouterError";
import { EventRegistry } from "./events/EventRegistry";
import { KairoAfterEvents } from "./events/KairoAfterEvents";
import { KairoBeforeEvents } from "./events/KairoBeforeEvents";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { createKairoContext, KairoContext, KairoContextMutator } from "./KairoContext";
import { KairoEventId } from "./KairoEventId";
import { KairoRouterListener } from "./KairoRouterListener";
import { KairoScheduler } from "./KairoScheduler";
import { ReadyState } from "./ReadyState";
import { Disposable } from "./types/Disposable";
import { KairoEventMap } from "./types/KairoEventMap";
import { KairoRuntime } from "./types/KairoRuntime";
import { Random } from "./types/Random";

export type RuntimeOption = KairoRuntime | "minecraft";

// kjs-router-ch 0001
export class KairoRouter {
    private kairoContext?: KairoContext;
    private kairoContextMutator?: KairoContextMutator;
    private runtime?: KairoRuntime;
    private scheduler?: KairoScheduler;
    private activationStartedTick?: number;
    private readyState = new ReadyState();
    private routerListener?: Disposable;
    private runtimeInjectedEventListener?: Disposable;

    private eventRegistry = new EventRegistry<KairoEventMap>();

    public afterEvents = new KairoAfterEvents(this.eventRegistry);
    public beforeEvents = new KairoBeforeEvents(this.eventRegistry);

    async init(properties: AddonProperties, options?: { runtime?: RuntimeOption }): Promise<void> {
        if (this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        const runtimeOption = options?.runtime ?? "minecraft";
        this.runtime = resolveRuntime(runtimeOption);

        this.scheduler = new KairoScheduler(this.runtime.scheduler);

        const { context, mutator } = createKairoContext(properties);
        this.kairoContext = context;
        this.kairoContextMutator = mutator;

        if (!this.readyState.isReady()) {
            this.runtime.onReady(() => {
                this.readyState.markReady();
            });
        }

        const initializer = new KairoInitializer(
            this.runtime,
            context,
            mutator,
            resolveRandom(this.runtime),
            this.readyState,
            () => this.startRouterListener(),
        );

        initializer.setup();
    }

    getKairoContext(): KairoContext {
        this.assertRunnable();
        return this.kairoContext!;
    }

    runInterval(callback: () => void, tickInterval?: number): number {
        this.assertRunnable();
        return this.scheduler!.runInterval(callback, tickInterval);
    }

    runTimeout(callback: () => void, tickDelay?: number): number {
        this.assertRunnable();
        return this.scheduler!.runTimeout(callback, tickDelay);
    }

    get currentTick(): number {
        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        if (this.activationStartedTick === undefined) {
            return 0;
        }
        return this.runtime.currentTick() - this.activationStartedTick;
    }

    private startRouterListener(): void {
        if (!this.runtime || !this.kairoContext || !this.kairoContextMutator) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        if (this.routerListener) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        const activationController = new ActivationController(
            this.kairoContext,
            this.kairoContextMutator,
            this.eventRegistry,
            {
                onActivate: () => {
                    this.attachRuntimeEvents();
                    this.scheduler?.setActive(true);
                },
                onDeactivate: () => {
                    this.detachRuntimeEvents();
                    this.scheduler?.setActive(false);
                },
            },
        );

        const handlers = this.buildHandlers(activationController);
        const listener = new KairoRouterListener(this.readyState, handlers);

        this.routerListener = listener.setup(this.runtime);
    }

    private buildHandlers(controller: ActivationController) {
        return {
            [KairoEventId.ActivationRequest]: (message: string) =>
                this.handleActivationRequest(controller, message),
        };
    }

    private handleActivationRequest(controller: ActivationController, message: string): void {
        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        controller.handleActivationRequest(message, {
            runtime: this.runtime,
        });
    }

    private attachRuntimeEvents() {
        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        if (this.runtimeInjectedEventListener) return;

        this.runtimeInjectedEventListener = this.runtime.bindEvents((ev) => {
            if (ev.phase === "after") {
                this.eventRegistry.emitAfter(ev.name as any, ev.payload);
            } else {
                this.eventRegistry.emitBefore(ev.name as any, ev.payload);
            }
        });
    }

    private detachRuntimeEvents() {
        this.runtimeInjectedEventListener?.dispose();
        this.runtimeInjectedEventListener = undefined;
    }

    private assertRunnable(): void {
        if (!this.kairoContext || !this.runtime || !this.scheduler) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        if (!this.kairoContext.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }
    }
}

function resolveRuntime(option: RuntimeOption): KairoRuntime {
    if (option === "minecraft") {
        return new MinecraftRuntime();
    }
    return option;
}

function resolveRandom(runtime: KairoRuntime): Random {
    if ("createRandom" in runtime && typeof runtime.createRandom === "function") {
        return runtime.createRandom();
    }
    return new SeedRandom();
}
