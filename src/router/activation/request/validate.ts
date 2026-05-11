import { compile } from "../../../utils/ajv-compile";
import { type ActivationRequest, ActivationRequestSchema } from "./schema";

export const validateActivationRequest = compile<ActivationRequest>(ActivationRequestSchema);
