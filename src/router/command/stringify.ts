import type { CommandInvokePayload } from "./schema";

export const stringifyCommandInvokePayload = (payload: CommandInvokePayload): string =>
    JSON.stringify(payload);
