import { AddonProperties } from "../types/AddonProperties";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./errors/KairoRouterInitError";
import { KairoInitializer } from "./init/KairoInitializer";

// kjs-router-ch 001
export class KairoRouter {
    private isInitialized: boolean = false;
    private readonly initializer: KairoInitializer | null = new KairoInitializer(this);

    public constructor() {}

    // kjs-router-init-Fc (002): init hooks for addons to register with kairo
    public init(properties: AddonProperties): void {
        if (this.isInitialized) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyInitialized);
        }

        // kjs-router-init-Fc (003): subscribe ScriptEvent to listen for kairo registration
        this.initializer?.setupInitializationEndpoint(properties);
        this.isInitialized = true;
    }
}
