import { Disposable } from "../types/Disposable";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { KairoRuntime } from "../types/KairoRuntime";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { DiscoveryResponder } from "./discovery/DiscoveryResponder";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { RegistrationResponder } from "./registration/RegistrationResponder";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;

    constructor(
        private readonly initListener: KairoInitListener,
        private readonly discoveryManager: AddonDiscoveryManager,
        private readonly discoveryResponder: DiscoveryResponder,
        private readonly registrationManager: AddonRegistrationManager,
        private readonly registrationResponder: RegistrationResponder,
        private readonly context: KairoContext,
        private readonly runtime: KairoRuntime,
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
        const kairoId = this.discoveryManager.resolveKairoId(message, this.runtime.currentTick());

        this.discoveryResponder.respond(kairoId);
        this.contextMutator.setKairoId(kairoId);
    };

    private handleRegistrationRequest = (message: string): void => {
        const registry = this.registrationManager.resolveRegistry(
            message,
            this.runtime.currentTick(),
            this.context.kairoId,
            this.context.addonProperties,
        );

        if (!registry) return;

        this.registrationResponder.respond(registry);
        this.contextMutator.setKairoRegistry(registry);
    };
}
