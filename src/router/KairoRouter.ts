import { AddonProperties } from "../types/AddonProperties";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { createKairoContext, KairoContext, KairoContextMutator } from "./KairoContext";

type InitializerFactory = (context: KairoContext, mutator: KairoContextMutator) => KairoInitializer;

// kjs-router-ch 0001
export class KairoRouter {
    private _context?: KairoContext;
    private initializer: KairoInitializer | null = null;

    public constructor(private readonly createInitializer: InitializerFactory) {}

    // kjs-router-init-Fc (002): init hooks for addons to register with kairo
    public init(properties: AddonProperties): void {
        if (this._context) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        const { context, mutator } = createKairoContext(properties);
        this._context = context;

        // kjs-router-init-Fc (003): subscribe ScriptEvent to listen for kairo registration
        this.initializer = this.createInitializer(context, mutator);
        this.initializer.setup();
    }

    get context(): KairoContext {
        if (!this._context) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.NotInitialized);
        }
        return this._context;
    }
}
