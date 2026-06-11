import type { HookResponseMessage } from "./schema";

export const stringifyHookResponseMessage = (msg: HookResponseMessage): string =>
    JSON.stringify(msg);
