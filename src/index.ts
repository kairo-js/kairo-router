import { world } from "@minecraft/server";
import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter();
router.afterEvents.addonActivate.subscribe(() => {});
world.afterEvents.worldLoad.subscribe(() => {});

export { KairoContext } from "./router/KairoContext";
export { KairoRouter } from "./router/KairoRouter";
export { KairoRegistry } from "./router/types/KairoRegistry";
export { KairoRuntime } from "./router/types/KairoRuntime";

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

export { AddonActivateAfterEvent } from "./router/events/classes/AddonActivateAfterEvent";
export { AddonDeactivateBeforeEvent } from "./router/events/classes/AddonDeactivateBeforeEvent";
