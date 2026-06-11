import type { EventEmitMessage } from "./schema";

export const stringifyEventEmitMessage = (msg: EventEmitMessage): string =>
    JSON.stringify(msg);
