import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
/** @public */
export const router = new KairoRouter();

export { KairoContext } from "./router/KairoContext";
export { KairoRouter } from "./router/KairoRouter";
export { KairoRegistry } from "./router/types/KairoRegistry";

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
