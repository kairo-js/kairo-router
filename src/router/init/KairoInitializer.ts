import { KairoContext, KairoContextMutator } from "../KairoContext";
import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { DiscoveryResponder } from "./discovery/DiscoveryResponder";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { RegistrationResponder } from "./registration/RegistrationResponder";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;

    constructor(
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly runtime: KairoRuntime,
        private readonly initListener: KairoInitListener,
        private readonly discoveryManager: AddonDiscoveryManager,
        private readonly discoveryResponder: DiscoveryResponder,
        private readonly registrationManager: AddonRegistrationManager,
        private readonly registrationResponder: RegistrationResponder,
    ) {}

    setup(): void {
        this.initListener.setHandlers({
            [KairoInitEventId.DiscoveryQuery]: (msg) => {
                const kairoId = this.discoveryManager.resolveKairoId(
                    msg,
                    this.runtime.currentTick(),
                );

                this.contextMutator.setKairoId(kairoId);
                this.discoveryResponder.respond(kairoId);
            },
            [KairoInitEventId.RegistrationRequest]: (msg) => {
                const registry = this.registrationManager.resolveRegistry(
                    msg,
                    this.runtime.currentTick(),
                    this.context.kairoId,
                    this.context.addonProperties,
                );
                if (!registry) return;
                this.contextMutator.setKairoRegistry(registry);
                this.registrationResponder.respond(registry);
            },
        });
        this.subscription = this.initListener.setup();
    }

    dispose(): void {
        this.subscription?.dispose();
        this.subscription = undefined;
    }
}
