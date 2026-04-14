import { AddonDiscoveryManagerFactory } from "../factories/AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "../factories/AddonRegistrationManagerFactory";
import { KairoInitializer } from "../init/KairoInitializer";
import { KairoInitListener } from "../init/KairoInitListener";
import { KairoContext } from "../KairoContext";
import { IdRegistryFactory } from "./IdRegistryFactory";
import { KairoRuntimeFactory } from "./KairoRuntimeFactory";

export interface KairoRouterDependencies {
    runtimeFactory: KairoRuntimeFactory;
    idRegistryFactory: IdRegistryFactory;
    initListenerFactory: (runtime: ReturnType<KairoRuntimeFactory["create"]>) => KairoInitListener;
    initializerFactory: (listener: KairoInitListener, context: KairoContext) => KairoInitializer;
    discoveryManagerFactory: AddonDiscoveryManagerFactory;
    registrationManagerFactory: AddonRegistrationManagerFactory;
}
