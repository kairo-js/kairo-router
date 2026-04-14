import { AddonDiscoveryManagerFactory } from "../init/discovery/factories/AddonDiscoveryManagerFactory";
import { DiscoveryResponderFactory } from "../init/discovery/factories/DiscoveryResponderFactory";
import { KairoInitializer } from "../init/KairoInitializer";
import { AddonRegistrationManagerFactory } from "../init/registration/factories/AddonRegistrationManagerFactory";
import { RegistrationResponderFactory } from "../init/registration/factories/RegistrationResponderFactory";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { IdRegistryFactory } from "../types/IdRegistryFactory";
import { KairoRuntime } from "../types/KairoRuntime";
import { KairoInitListenerFactory } from "./KairoInitListenerFactory";

/** @internal */
export class KairoInitializerFactory {
    constructor(
        private readonly runtime: KairoRuntime,
        private readonly idRegistryFactory: IdRegistryFactory,
        private readonly listenerFactory: KairoInitListenerFactory,
        private readonly discoveryFactory: AddonDiscoveryManagerFactory,
        private readonly discoveryResponderFactory: DiscoveryResponderFactory,
        private readonly registrationFactory: AddonRegistrationManagerFactory,
        private readonly registrationResponderFactory: RegistrationResponderFactory,
    ) {}

    create(context: KairoContext, mutator: KairoContextMutator): KairoInitializer {
        const listener = this.listenerFactory.create(this.runtime);

        const discovery = this.discoveryFactory.create(context, this.idRegistryFactory);
        const discoveryResponder = this.discoveryResponderFactory.create(this.runtime);

        const registration = this.registrationFactory.create();
        const registrationResponder = this.registrationResponderFactory.create(this.runtime);

        return new KairoInitializer(
            listener,
            discovery,
            discoveryResponder,
            registration,
            registrationResponder,
            context,
            this.runtime,
            mutator,
        );
    }
}
