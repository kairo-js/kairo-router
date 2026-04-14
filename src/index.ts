import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter();
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
