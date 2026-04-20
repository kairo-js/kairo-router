import { SeedRandom } from "../../utils/SeedRandom";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { ReadyState } from "../ReadyState";
import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { Random } from "../types/Random";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { DiscoveryResponder } from "./discovery/DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { RegistrationResponder } from "./registration/RegistrationResponder";

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;

    private readonly idProvider: KairoIdProvider;
    private readonly registryBuilder: KairoRegistryBuilder;

    private readonly initListener: KairoInitListener;
    private readonly discoveryManager: AddonDiscoveryManager;
    private readonly discoveryResponder = new DiscoveryResponder();
    private readonly registrationManager: AddonRegistrationManager;
    private readonly registrationResponder = new RegistrationResponder();

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly random: Random = new SeedRandom(),
        private readonly readyState: ReadyState,
    ) {
        this.initListener = new KairoInitListener(this.readyState, {
            [KairoInitEventId.DiscoveryQuery]: this.handleDiscoveryQuery,
            [KairoInitEventId.RegistrationRequest]: this.handleRegistrationRequest,
        });

        this.idProvider = new KairoIdProvider(this.random);
        this.registryBuilder = new KairoRegistryBuilder();

        this.discoveryManager = new AddonDiscoveryManager(this.idProvider);
        this.registrationManager = new AddonRegistrationManager(this.registryBuilder);
    }

    setup(): void {
        this.subscription = this.initListener.setup(this.runtime);
    }

    dispose(): void {
        this.subscription?.dispose();
        this.subscription = undefined;
    }

    private handleDiscoveryQuery = (message: string): void => {
        const kairoId = this.discoveryManager.resolveKairoId(
            message,
            this.runtime,
            this.context.addonProperties.id,
        );

        this.discoveryResponder.respond(this.runtime, kairoId);
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

        this.registrationResponder.respond(this.runtime, registry);
        this.contextMutator.setKairoRegistry(registry);
    };
}
