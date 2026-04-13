import { Disposable } from "../../types/disposable";
import { KairoContext } from "../KairoContext";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { KairoInitListener } from "./KairoInitListener";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { KairoInitEventId } from "./types";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;
    constructor(
        private readonly context: KairoContext,
        private readonly discoveryManager = new AddonDiscoveryManager(),
        private readonly registrationManager = new AddonRegistrationManager(),
        private readonly initListener = new KairoInitListener(),
    ) {
        this.discoveryManager.setContext(this.context);
        this.registrationManager.setContext(this.context);

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
