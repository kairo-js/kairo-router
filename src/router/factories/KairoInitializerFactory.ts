import { KairoInitializer } from "../init/KairoInitializer";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { KairoRuntime } from "../types/KairoRuntime";
import { AddonDiscoveryManagerFactory } from "./AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./AddonRegistrationManagerFactory";
import { DiscoveryResponderFactory } from "./DiscoveryResponderFactory";
import { KairoInitListenerFactory } from "./KairoInitListenerFactory";
import { RegistrationResponderFactory } from "./RegistrationResponderFactory";

export class KairoInitializerFactory {
    constructor(
        private readonly runtime: KairoRuntime,
        private readonly listenerFactory: KairoInitListenerFactory,
        private readonly discoveryFactory: AddonDiscoveryManagerFactory,
        private readonly registrationFactory: AddonRegistrationManagerFactory,
        private readonly discoveryResponderFactory: DiscoveryResponderFactory,
        private readonly registrationResponderFactory: RegistrationResponderFactory,
    ) {}

    create(context: KairoContext, mutator: KairoContextMutator): KairoInitializer {
        const listener = this.listenerFactory.create();

        const discovery = this.discoveryFactory.create(context);
        const discoveryResponder = this.discoveryResponderFactory.create();

        const registration = this.registrationFactory.create();
        const registrationResponder = this.registrationResponderFactory.create();

        return new KairoInitializer(
            context,
            mutator,
            this.runtime,
            listener,
            discovery,
            discoveryResponder,
            registration,
            registrationResponder,
        );
    }
}
