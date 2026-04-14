import { Disposable } from "../types/Disposable";
import { DiscoveryQueryHandler } from "./discovery/DiscoveryQueryHandler";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { RegistrationRequestHandler } from "./registration/RegistrationRequestHandler";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;

    constructor(
        private readonly initListener: KairoInitListener,
        private readonly discoveryHandler: DiscoveryQueryHandler,
        private readonly registrationHandler: RegistrationRequestHandler,
    ) {}

    setup(): void {
        this.initListener.setHandlers({
            [KairoInitEventId.DiscoveryQuery]: this.discoveryHandler.handle,
            [KairoInitEventId.RegistrationRequest]: this.registrationHandler.handle,
        });

        this.subscription = this.initListener.setup();
    }

    dispose(): void {
        this.subscription?.dispose();
        this.subscription = undefined;
    }
}
