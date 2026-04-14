import { MinecraftRuntime } from "./minecraft/MinecraftRuntime";
import { ScoreboardIdRegistryFactory } from "./minecraft/ScoreboardIdRegistryFactory";
import { AddonDiscoveryManagerFactory } from "./router/factories/AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./router/factories/AddonRegistrationManagerFactory";
import { DiscoveryResponderFactory } from "./router/factories/DiscoveryResponderFactory";
import { KairoInitializerFactory } from "./router/factories/KairoInitializerFactory";
import { KairoInitListenerFactory } from "./router/factories/KairoInitListenerFactory";
import { RegistrationResponderFactory } from "./router/factories/RegistrationResponderFactory";
import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
const runtime = new MinecraftRuntime();
const idRegistryFactory = new ScoreboardIdRegistryFactory();

// 下位 Factory を構築
const listenerFactory = new KairoInitListenerFactory(runtime);
const discoveryFactory = new AddonDiscoveryManagerFactory(idRegistryFactory);
const registrationFactory = new AddonRegistrationManagerFactory();
const discoveryResponderFactory = new DiscoveryResponderFactory(runtime);
const registrationResponderFactory = new RegistrationResponderFactory(runtime);

const initializerFactory = new KairoInitializerFactory(
    runtime,
    listenerFactory,
    discoveryFactory,
    registrationFactory,
    discoveryResponderFactory,
    registrationResponderFactory,
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
