import { AddonProperties } from "../types/properties";
import { KairoInitializer } from "./init/KairoInitializer";

// kjs-router-CH 001
export class KairoRouter {
    private readonly initializer = new KairoInitializer(this);

    public constructor() {}

    // kjs-router-init-Fc (002): init hooks for addons to register with kairo
    public init(properties: AddonProperties): void {
        // kjs-router-init-Fc (003): subscribe ScriptEvent to listen for kairo registration
        this.initializer.setupInitializationEndpoint(properties);
    }
}
