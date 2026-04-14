import { Disposable } from "../../types/Disposable";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;

    constructor(
        private readonly initListener: KairoInitListener,
        private readonly discoveryManager: AddonDiscoveryManager,
        private readonly registrationManager: AddonRegistrationManager,
    ) {
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
        this.subscription?.dispose();
        this.subscription = undefined;

        this.discoveryManager.dispose();
        this.registrationManager.dispose();
    }
}
