import { AddonProperties } from "../types/AddonProperties";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { KairoContext } from "./KairoContext";

// kjs-router-ch 0001
export class KairoRouter {
    private _context?: KairoContext;
    private initializer?: KairoInitializer | null = null;

    public constructor() {}

    // kjs-router-init-Fc (002): init hooks for addons to register with kairo
    public init(properties: AddonProperties): void {
        if (this._context) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        this._context = new KairoContext(properties);
        // kjs-router-init-Fc (003): subscribe ScriptEvent to listen for kairo registration
        this.initializer = new KairoInitializer(this._context);
        this.initializer.setup();
    }

    get context(): KairoContext {
        if (!this._context) {
            throw new Error("kairo: Router is not initialized. Call init() first.");
        }
        return this._context;
    }

    private completeInitialization(): void {
        if (this.initializer) {
            this.initializer.dispose();
            this.initializer = null;
        }
    }
}
