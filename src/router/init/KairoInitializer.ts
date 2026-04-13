import { Disposable } from "../../types/Disposable";
import { KairoContext } from "../KairoContext";
import { KairoRuntime } from "../KairoRuntime";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { KairoInitListener } from "./KairoInitListener";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { KairoInitEventId } from "./types";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;
    private readonly discoveryManager: AddonDiscoveryManager;
    private readonly registrationManager: AddonRegistrationManager;

    constructor(
        private readonly context: KairoContext,
        private readonly runtime: KairoRuntime,
        private readonly initListener = new KairoInitListener(),
    ) {
        this.discoveryManager = new AddonDiscoveryManager(this.context, this.runtime);
        this.registrationManager = new AddonRegistrationManager(this.context, this.runtime);

        this.initListener.setHandlers({
            [KairoInitEventId.DiscoveryQuery]: (msg) =>
                this.discoveryManager.handleRegistrationQuery(msg),
            [KairoInitEventId.RegistrationRequest]: (msg) =>
                this.registrationManager.handleRegistrationRequest(msg),
        });
    }

    setup(): void {
        this.subscription = this.initListener.setup();
    }

    dispose(): void {
        if (this.subscription) {
            this.subscription.dispose();
            this.subscription = undefined;
        }

        this.discoveryManager.dispose();
        this.registrationManager.dispose();
    }
}
