import { MinecraftRuntime } from "./minecraft/MinecraftRuntime";
import { ScoreboardIdRegistryFactory } from "./minecraft/ScoreboardIdRegistryFactory";
import { KairoInitializerFactory } from "./router/factories/KairoInitializerFactory";
import { KairoInitListenerFactory } from "./router/factories/KairoInitListenerFactory";
import { AddonDiscoveryManagerFactory } from "./router/init/discovery/factories/AddonDiscoveryManagerFactory";
import { DiscoveryQueryHandlerFactory } from "./router/init/discovery/factories/DiscoveryQueryHandlerFactory";
import { DiscoveryResponderFactory } from "./router/init/discovery/factories/DiscoveryResponderFactory";
import { AddonRegistrationManagerFactory } from "./router/init/registration/factories/AddonRegistrationManagerFactory";
import { RegistrationRequestHandlerFactory } from "./router/init/registration/factories/RegistrationRequestHandlerFactory";
import { RegistrationResponderFactory } from "./router/init/registration/factories/RegistrationResponderFactory";
import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
const runtime = new MinecraftRuntime();
const idRegistryFactory = new ScoreboardIdRegistryFactory();

const listenerFactory = new KairoInitListenerFactory();
const discoveryFactory = new AddonDiscoveryManagerFactory();
const discoveryResponderFactory = new DiscoveryResponderFactory();
const discoveryHandlerFactory = new DiscoveryQueryHandlerFactory();
const registrationFactory = new AddonRegistrationManagerFactory();
const registrationResponderFactory = new RegistrationResponderFactory();
const registrationHandlerFactory = new RegistrationRequestHandlerFactory();

const initializerFactory = new KairoInitializerFactory(
    runtime,
    idRegistryFactory,
    listenerFactory,
    discoveryFactory,
    discoveryResponderFactory,
    discoveryHandlerFactory,
    registrationFactory,
    registrationResponderFactory,
    registrationHandlerFactory,
);

export const router = new KairoRouter((context, mutator) =>
    initializerFactory.create(context, mutator),
);

export { KairoRouter } from "./router/KairoRouter";

export type {
    AddonHeader,
    AddonMetadata,
    AddonProperties,
    EngineVersion,
    ManifestDependency,
    RequiredAddons,
    SemVer,
} from "./types/AddonProperties";

export { MinecraftModule } from "./types/AddonProperties";
export { SupportedTag } from "./types/tags";
