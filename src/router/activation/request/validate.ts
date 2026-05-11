import { compile } from "@kairo-js/utils";
import { type ActivationRequest, ActivationRequestSchema } from "./schema";

export const validateActivationRequest = compile<ActivationRequest>(ActivationRequestSchema);
