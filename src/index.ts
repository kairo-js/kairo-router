import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter();
export type { KairoRouter } from "./router/KairoRouter";

export type {
    AddonProperties,
    AddonMetadata,
    AddonHeader,
    SemVer,
    EngineVersion,
    ManifestDependency,
    RequiredAddons,
} from "./types/properties";

export { MinecraftModule, SupportedTag } from "./types/properties";
