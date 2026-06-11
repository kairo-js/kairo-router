import { compile } from "@kairo-js/utils";
import { CommandInvokePayloadSchema } from "./schema";

export const validateCommandInvokePayload = compile(CommandInvokePayloadSchema);
