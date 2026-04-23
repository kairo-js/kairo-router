import { MinecraftRuntime } from "../minecraft/MinecraftRuntime";
import { AddonProperties } from "../types/AddonProperties";
import { SeedRandom } from "../utils/SeedRandom";
import { ActivationController } from "./activation/ActivationController";
import { EventRegistry } from "./events/EventRegistry";
import { KairoAfterEvents } from "./events/KairoAfterEvents";
import { KairoBeforeEvents } from "./events/KairoBeforeEvents";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { createKairoContext, KairoContext, KairoContextMutator } from "./KairoContext";
import { KairoEventId } from "./KairoEventId";
import { KairoRouterListener } from "./KairoRouterListener";
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
    private readyState = new ReadyState();
    private routerListener?: Disposable;

    private eventRegistry = new EventRegistry<KairoEventMap>();

    public afterEvents = new KairoAfterEvents(this.eventRegistry);
    public beforeEvents = new KairoBeforeEvents(this.eventRegistry);

    constructor() {}
    async init(properties: AddonProperties, options?: { runtime?: RuntimeOption }): Promise<void> {
        if (this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }
        const runtimeOption = options?.runtime ?? "minecraft";
        this.runtime = resolveRuntime(runtimeOption);

        this.runtime.bindEvents?.((ev) => {
            if (ev.phase === "after") {
                this.eventRegistry.emitAfter(ev.name as any, ev.payload);
            } else {
                this.eventRegistry.emitBefore(ev.name as any, ev.payload);
            }
        });

        if (!this.readyState.isReady()) {
            this.runtime.onReady(() => {
                this.readyState.markReady();
            });
        }

        const { context, mutator } = createKairoContext(properties);
        this.kairoContext = context;
        this.kairoContextMutator = mutator;

        const initializer = new KairoInitializer(
            this.runtime,
            context,
            mutator,
            resolveRandom(this.runtime),
            this.readyState,
            () => {
                this.startRouterListener();
            },
        );
        initializer.setup();
    }

    getKairoContext(): KairoContext {
        if (!this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        return this.kairoContext;
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

    private handleActivationRequest = (controller: ActivationController, message: string): void => {
        if (!this.runtime) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }

        controller.handleActivationRequest(message, {
            runtime: this.runtime,
        });
    };
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
