import { KairoInitializer } from "../init/KairoInitializer";
import { KairoInitListener } from "../init/KairoInitListener";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { IdRegistryFactory } from "../types/IdRegistryFactory";
import { KairoRuntime } from "../types/KairoRuntime";
import { AddonDiscoveryManagerFactory } from "./AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./AddonRegistrationManagerFactory";
import { DiscoveryResponderFactory } from "./DiscoveryResponderFactory";
import { RegistrationResponderFactory } from "./RegistrationResponderFactory";

export class KairoInitializerFactory {
    constructor(
        private readonly runtime: KairoRuntime,
        private readonly idRegistryFactory: IdRegistryFactory,
    ) {}

    create(context: KairoContext, mutator: KairoContextMutator): KairoInitializer {
        const listener = new KairoInitListener(this.runtime);

        const discovery = new AddonDiscoveryManagerFactory(
            this.runtime,
            this.idRegistryFactory,
        ).create(context);
        const discoveryResponder = new DiscoveryResponderFactory(this.runtime).create();

        const registration = new AddonRegistrationManagerFactory(this.runtime).create();
        const registrationResponder = new RegistrationResponderFactory(this.runtime).create();

        return new KairoInitializer(
            context,
            mutator,
            listener,
            discovery,
            discoveryResponder,
            registration,
            registrationResponder,
        );
    }
}
