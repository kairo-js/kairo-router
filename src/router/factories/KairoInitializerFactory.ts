import { DiscoveryResponder } from "../init/discovery/DiscoveryResponder";
import { KairoInitializer } from "../init/KairoInitializer";
import { KairoInitListener } from "../init/KairoInitListener";
import { RegistrationResponder } from "../init/registration/RegistrationResponder";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { IdRegistryFactory } from "../types/IdRegistryFactory";
import { KairoRuntime } from "../types/KairoRuntime";
import { AddonDiscoveryManagerFactory } from "./AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./AddonRegistrationManagerFactory";

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
        const discoveryResponder = new DiscoveryResponder(this.runtime);

        const registration = new AddonRegistrationManagerFactory(this.runtime).create();
        const registrationResponder = new RegistrationResponder(this.runtime);

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
