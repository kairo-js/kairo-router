import { MinecraftRuntimeFactory } from "../minecraft/MinecraftRuntimeFactory";
import { ScoreboardIdRegistryFactory } from "../minecraft/ScoreboardIdRegistryFactory";
import { AddonProperties } from "../types/AddonProperties";
import { AddonDiscoveryManagerFactory } from "./factories/AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./factories/AddonRegistrationManagerFactory";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./init/errors";
import { KairoInitializer } from "./init/KairoInitializer";
import { KairoInitListener } from "./init/KairoInitListener";
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
        const runtime = new MinecraftRuntimeFactory().create();
        const idRegistryFactory = new ScoreboardIdRegistryFactory();

        const initListener = new KairoInitListener(runtime);

        const discoveryManager = new AddonDiscoveryManagerFactory(
            runtime,
            idRegistryFactory,
        ).create(this._context);
        const registrationManager = new AddonRegistrationManagerFactory(runtime).create(
            this._context,
        );

        // kjs-router-init-Fc (003): subscribe ScriptEvent to listen for kairo registration
        this.initializer = new KairoInitializer(
            initListener,
            discoveryManager,
            registrationManager,
        );
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
