import { MinecraftRuntime } from "./minecraft/MinecraftRuntime";
import { ScoreboardIdRegistryFactory } from "./minecraft/ScoreboardIdRegistryFactory";
import { KairoInitializerFactory } from "./router/factories/KairoInitializerFactory";
import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
const runtime = new MinecraftRuntime();
const idRegistryFactory = new ScoreboardIdRegistryFactory();

const initializerFactory = new KairoInitializerFactory(runtime, idRegistryFactory);

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
