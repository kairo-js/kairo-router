import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter();

export { KairoContext } from "./router/KairoContext";
export { KairoRouter } from "./router/KairoRouter";
export type { KairoRegistry } from "./router/types/KairoRegistry";

export { AddonActivateAfterEvent } from "./router/events/classes/AddonActivateAfterEvent";
export { AddonDeactivateBeforeEvent } from "./router/events/classes/AddonDeactivateBeforeEvent";
export { KairoCustomCommandRegistry } from "./router/events/classes/KairoCustomCommandRegistry";
export { KairoStartupBeforeEvent } from "./router/events/classes/KairoStartupBeforeEvent";

export type { BeforeHookContext, AfterHookContext, HookRollbackContext, HookOptions } from "./router/api/KairoApiRegistry";

export type { Disposable } from "./router/types/Disposable";
