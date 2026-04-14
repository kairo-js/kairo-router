import { Disposable } from "../types/Disposable";
import { KairoContextMutator } from "../KairoContext";
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
        private readonly contextMutator: KairoContextMutator,
    ) {}

    setup(): void {
        this.initListener.setHandlers({
            [KairoInitEventId.DiscoveryQuery]: this.handleDiscoveryQuery,
            [KairoInitEventId.RegistrationRequest]: this.handleRegistrationRequest,
        });

        this.subscription = this.initListener.setup();
    }

    dispose(): void {
        this.subscription?.dispose();
        this.subscription = undefined;
    }

    private handleDiscoveryQuery = (message: string): void => {
        const kairoId = this.discoveryHandler.handle(message);
        this.contextMutator.setKairoId(kairoId);
    };

    private handleRegistrationRequest = (message: string): void => {
        const registry = this.registrationHandler.handle(message);
        if (!registry) return;

        this.contextMutator.setKairoRegistry(registry);
    };
}
