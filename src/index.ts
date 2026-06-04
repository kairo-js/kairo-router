import { KairoRouter } from "./router/KairoRouter";

// kjs-router-init-Fc (001): create kairo router instance
export const router = new KairoRouter();

export { KairoContext } from "./router/KairoContext";
export { KairoRouter } from "./router/KairoRouter";
export type { RouterInitOptions } from "./router/KairoRouter";
export type { KairoRegistry } from "./router/types/KairoRegistry";

export { AddonActivateAfterEvent } from "./router/events/classes/AddonActivateAfterEvent";
export { AddonDeactivateBeforeEvent } from "./router/events/classes/AddonDeactivateBeforeEvent";
export { KairoCustomCommandRegistry } from "./router/events/classes/KairoCustomCommandRegistry";
export { KairoStartupBeforeEvent } from "./router/events/classes/KairoStartupBeforeEvent";

export type {
    ApiRegistration,
    ApiHandlerContext,
    BeforeHookContext,
    AfterHookContext,
    HookRollbackContext,
    HookOptions,
    DeepReadonly,
} from "./router/api/KairoApiRegistry";

export type { AddonEventRegistration } from "./router/event/AddonEventRegistry";

export {
    ApiNotFoundError,
    RequestTimeoutError,
    BeforeHookExecutionError,
    AfterHookExecutionError,
    HandlerExecutionError,
    ProtocolError,
} from "./router/api/errors";
export type { CanceledResult, ProtocolStage } from "./router/api/errors";

export type { Disposable } from "./router/types/Disposable";
