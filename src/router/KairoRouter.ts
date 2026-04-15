import { MinecraftRuntime } from "../minecraft/MinecraftRuntime";
import { AddonProperties } from "../types/AddonProperties";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { createKairoContext, KairoContext } from "./KairoContext";
import { KairoRuntime } from "./types/KairoRuntime";

type RuntimeOption = KairoRuntime | "minecraft";

// kjs-router-ch 0001
export class KairoRouter {
    /** @internal */
    private kairoContext?: KairoContext;

    /** @internal */
    private runtime?: KairoRuntime;

    constructor() {}
    async init(properties: AddonProperties, options?: { runtime?: RuntimeOption }): Promise<void> {
        if (this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }
        const runtimeOption = options?.runtime ?? "minecraft";
        this.runtime = resolveRuntime(runtimeOption);

        const { context, mutator } = createKairoContext(properties);
        this.kairoContext = context;

        const initializer = new KairoInitializer(this.runtime, context, mutator);
        initializer.setup();
    }

    getKairoContext(): KairoContext {
        if (!this.kairoContext) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        return this.kairoContext;
    }
}

function resolveRuntime(option: RuntimeOption): KairoRuntime {
    if (option === "minecraft") {
        return new MinecraftRuntime();
    }
    return option;
}
