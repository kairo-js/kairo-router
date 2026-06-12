import { KairoRuntime } from "../minecraft/KairoRuntime";

import type { AddonProperties } from "@kairo-js/properties";
import { KairoCommandRegistry } from "./command/KairoCommandRegistry";
import { KairoRegistryBuilder } from "./init/KairoRegistryBuilder";
import { SeedRandom } from "@kairo-js/utils";
import type { KairoEventMap } from "../minecraft/KairoEventMap";
import { ApiCallSender } from "./api/ApiCallSender";
import { KairoApiRegistry } from "./api/KairoApiRegistry";
import { InvokeHandler } from "./api/InvokeHandler";
import type { CanceledResult } from "./api/errors";
import { AddonEventRegistry } from "./event/AddonEventRegistry";
import { AddonEventEmitter } from "./event/AddonEventEmitter";
import { AddonEventDeliveryHandler } from "./event/AddonEventDeliveryHandler";
import { CrossAddonHookHandler } from "./hook/CrossAddonHookHandler";
import { ActivationController } from "./activation/ActivationController";
import { KairoRouterError, KairoRouterErrorReason } from "./errors/KairoRouterError";
import { EventRegistry } from "./events/EventRegistry";
import { KairoAfterEvents } from "./events/KairoAfterEvents";
import { KairoBeforeEvents } from "./events/KairoBeforeEvents";
import { KairoStartupBeforeEvent } from "./events/classes/KairoStartupBeforeEvent";
import { InternalEvent } from "./events/types/InternalEvent";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { KairoInitEventId } from "./init/constants/KairoInitEventId";
import { createKairoContext, KairoContext, type KairoContextMutator } from "./KairoContext";
import { KairoScheduler } from "./KairoScheduler";
import { ReadyState } from "./ReadyState";
import type { Disposable } from "./types/Disposable";

const STANDALONE_DETECTION_TICKS = 20;
const INFRA_DEPS = new Set(["kairo", "kairo-database"]);

export interface RouterInitOptions {
    /**
     * `true`  — always attempt standalone (even with cross-addon dependencies)
     * `false` — never attempt standalone
     * `undefined` (default) — standalone only when required dependencies are limited to kairo / kairo-database
     */
    standalone?: boolean;
}

function shouldAttemptStandalone(properties: AddonProperties, option: boolean | undefined): boolean {
    if (option !== true) return false;
    const requiredDeps = Object.keys(properties.dependencies ?? {});
    return requiredDeps.every(dep => INFRA_DEPS.has(dep));
}

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
    private standaloneMode = false;
    private startupSubscription?: Disposable;

    private apiCallSender?: ApiCallSender;
    private invokeHandler?: InvokeHandler;
    private _registeredCallback?: (kairoId: string) => void;
    private addonEventEmitter?: AddonEventEmitter;
    private addonEventDeliveryHandler?: AddonEventDeliveryHandler;
    private crossAddonHookHandler?: CrossAddonHookHandler;
    private commandInvokeListener?: Disposable;
    private commandRegistry?: KairoCommandRegistry;

    private readonly apiRegistry = new KairoApiRegistry();
    private readonly addonEventRegistry = new AddonEventRegistry();

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

            const commandRegistry = new KairoCommandRegistry(
                ev.customCommandRegistry,
                isActive,
                () => this.kairoContext?.addonProperties.id,
                (id, msg) => this.runtime?.send(id, msg),
            );
            this.commandRegistry = commandRegistry;

            this.startupEvent.emit(new KairoStartupBeforeEvent(ev, isActive, this.apiRegistry, this.addonEventRegistry, getAddonName, commandRegistry));
            this.apiRegistry.seal();
            commandRegistry.seal();
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

    getAddonId(): string | undefined {
        return this.kairoContext?.addonProperties.id;
    }

    getKairoId(): string | undefined {
        if (!this.kairoContext?.isRegistered()) return undefined;
        return this.kairoContext.kairoId;
    }

    onceRegistered(callback: (kairoId: string) => void): void {
        const kairoId = this.getKairoId();
        if (kairoId !== undefined) {
            callback(kairoId);
            return;
        }
        this._registeredCallback = callback;
    }

    send(targetAddonId: string, apiName: string, args?: unknown): void {
        this.assertRunnable();
        this.apiCallSender!.send(targetAddonId, apiName, args);
    }

    request<TReturn>(
        targetAddonId: string,
        apiName: string,
        args?: unknown,
        options?: { timeout?: number },
    ): Promise<TReturn | CanceledResult> {
        this.assertRunnable();
        return this.apiCallSender!.request<TReturn>(targetAddonId, apiName, args, options);
    }

    emit(eventName: string, payload?: unknown): void {
        this.assertRunnable();
        this.addonEventEmitter!.emit(eventName, payload);
    }

    async save(key: string, value: unknown): Promise<void> {
        this.assertDatabaseDependency();
        this.assertRunnable();
        if (this.standaloneMode) return;
        const result = await this.apiCallSender!.request<void>("kairo-database", "save", { key, value });
        this.assertDatabaseAvailable(result);
    }

    async load<T = unknown>(key: string, options?: { addonId?: string }): Promise<T | undefined> {
        this.assertDatabaseDependency();
        this.assertRunnable();
        if (this.standaloneMode) return undefined;
        const result = await this.apiCallSender!.request<T | undefined>("kairo-database", "load", { key, addonId: options?.addonId });
        this.assertDatabaseAvailable(result);
        return result as T | undefined;
    }

    async delete(key: string): Promise<void> {
        this.assertDatabaseDependency();
        this.assertRunnable();
        if (this.standaloneMode) return;
        const result = await this.apiCallSender!.request<void>("kairo-database", "delete", { key });
        this.assertDatabaseAvailable(result);
    }

    async has(key: string, options?: { addonId?: string }): Promise<boolean> {
        this.assertDatabaseDependency();
        this.assertRunnable();
        if (this.standaloneMode) return false;
        const result = await this.apiCallSender!.request<boolean>("kairo-database", "has", { key, addonId: options?.addonId });
        this.assertDatabaseAvailable(result);
        return result as boolean;
    }

    init(properties: AddonProperties, options?: RouterInitOptions): void {
        this.assertNotDisposed();

        if (this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        if (properties.id !== "kairo" && !("kairo" in (properties.dependencies ?? {}))) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.KairoDependencyMissing);
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
            this.apiRegistry,
            this.addonEventRegistry,
            () => {
                this.initializer = undefined;
                this.startRouterListener();
            },
            () => {
                this.initializer = undefined;
                this.dispose();
            },
            () => this.commandRegistry,
        );

        this.initializer = initializer;
        initializer.setup();

        if (shouldAttemptStandalone(properties, options?.standalone)) {
            this.readyState.wait().then(() => {
                this.runtime!.scheduler.runTimeout(() => {
                    if (this.initializer) {
                        this.initializer.dispose();
                        this.initializer = undefined;
                        this.standaloneMode = true;
                        this.activateStandalone();
                    }
                }, STANDALONE_DETECTION_TICKS);
            });
        }
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

        this.apiCallSender?.dispose();
        this.apiCallSender = undefined;

        this.invokeHandler?.dispose();
        this.invokeHandler = undefined;

        this.addonEventDeliveryHandler?.dispose();
        this.addonEventDeliveryHandler = undefined;
        this.addonEventEmitter = undefined;
        this.crossAddonHookHandler?.dispose();
        this.crossAddonHookHandler = undefined;

        this.commandInvokeListener?.dispose();
        this.commandInvokeListener = undefined;

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

    private activateStandalone(): void {
        if (!this.runtime || !this.kairoContext || !this.kairoContextMutator) return;

        const addonId = this.kairoContext.addonProperties.id;
        const registry = new KairoRegistryBuilder().build(addonId, this.kairoContext.addonProperties);

        this.kairoContextMutator.setKairoId(addonId);
        this.kairoContextMutator.setKairoRegistry(registry);

        this.startRouterListener(true);
    }

    private startRouterListener(standalone = false): void {
        if (!this.runtime || !this.kairoContext || !this.kairoContextMutator) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        if (this.routerListener) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        const runtime = this.runtime;
        const context = this.kairoContext;

        if (this._registeredCallback) {
            const cb = this._registeredCallback;
            this._registeredCallback = undefined;
            cb(context.kairoId);
        }

        this.apiCallSender = new ApiCallSender(runtime, () => context.kairoId, () => context.addonProperties.id);
        this.apiCallSender.setup();

        // 一時リスナー: PackOrderProbe の ping に 1 回だけ応答する
        const orderPingListener = runtime.receive((id, _message) => {
            if (id !== KairoInitEventId.OrderPing) return;
            orderPingListener.dispose();
            const pong = JSON.stringify({ kairoId: context.kairoId });
            runtime.send(KairoInitEventId.OrderPong, pong);
        });

        if (this.commandRegistry) {
            this.commandInvokeListener = this.commandRegistry.setupInvokeListener(
                (handler) => runtime.receive(handler),
            );
        }

        this.addonEventEmitter = new AddonEventEmitter(
            runtime,
            () => context.addonProperties.id,
        );

        this.invokeHandler = new InvokeHandler(
            runtime,
            this.apiRegistry,
            () => "kairo",
            () => context.kairoId,
        );

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
                    this.invokeHandler!.setup();
                    this.addonEventDeliveryHandler = new AddonEventDeliveryHandler(
                        runtime,
                        this.addonEventRegistry,
                        () => context.kairoId,
                    );
                    this.addonEventDeliveryHandler.setup();
                    this.crossAddonHookHandler = new CrossAddonHookHandler(
                        runtime,
                        this.apiRegistry,
                        () => context.kairoId,
                    );
                    this.crossAddonHookHandler.setup();
                },
                onDeactivate: () => {
                    this.stopActivationTickCounter();
                    this.eventRegistry.clearActiveScopedListeners();
                    this.detachRuntimeEvents();
                    this.scheduler?.setActive(false);
                    this.invokeHandler?.dispose();
                    this.invokeHandler = new InvokeHandler(
                        runtime,
                        this.apiRegistry,
                        () => "kairo",
                        () => context.kairoId,
                    );
                    this.addonEventDeliveryHandler?.dispose();
                    this.addonEventDeliveryHandler = undefined;
                    this.crossAddonHookHandler?.dispose();
                    this.crossAddonHookHandler = undefined;
                },
            },
        );
        if (standalone) {
            activationController.standaloneActivate();
        } else {
            activationController.setup();
        }
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

    private assertDatabaseDependency(): void {
        const deps = this.kairoContext?.addonProperties.dependencies ?? {};
        const optDeps = this.kairoContext?.addonProperties.optionalDependencies ?? {};
        if (!("kairo-database" in deps) && !("kairo-database" in optDeps)) {
            throw new Error('[kairo-router] router.save/load/delete/has requires "kairo-database" in dependencies');
        }
    }

    private assertDatabaseAvailable(result: unknown): void {
        if (result !== null && typeof result === "object" && "canceled" in result) {
            const reason = (result as CanceledResult).reason;
            throw new Error(`[kairo-router] kairo-database is unavailable (${reason}). Ensure it is installed and active.`);
        }
    }
}
