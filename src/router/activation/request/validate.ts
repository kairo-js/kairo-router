import { compile } from "../../../utils/ajv-compile";
import { ActivationRequest, ActivationRequestSchema } from "./schema";

export const validateActivationRequest = compile<ActivationRequest>(ActivationRequestSchema);
