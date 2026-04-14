import { MinecraftRuntime } from "./minecraft/MinecraftRuntime";
import { ScoreboardIdRegistryFactory } from "./minecraft/ScoreboardIdRegistryFactory";
import { AddonDiscoveryManagerFactory } from "./router/factories/AddonDiscoveryManagerFactory";
import { AddonRegistrationManagerFactory } from "./router/factories/AddonRegistrationManagerFactory";
import { KairoInitializer } from "./router/init/KairoInitializer";
import { KairoInitListener } from "./router/init/KairoInitListener";
import { KairoContext } from "./router/KairoContext";
import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter((context: KairoContext) => {
    const runtime = new MinecraftRuntime();
    const idRegistryFactory = new ScoreboardIdRegistryFactory();

    const listener = new KairoInitListener(runtime);
    const discovery = new AddonDiscoveryManagerFactory(runtime, idRegistryFactory).create(context);
    const registration = new AddonRegistrationManagerFactory(runtime).create(context);

    return new KairoInitializer(listener, discovery, registration);
});

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
