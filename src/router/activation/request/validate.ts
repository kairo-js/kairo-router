import { compile } from "@kairo-js/utils";
import { ActivationRequestSchema } from "./schema";

export const validateActivationRequest = compile(ActivationRequestSchema);
