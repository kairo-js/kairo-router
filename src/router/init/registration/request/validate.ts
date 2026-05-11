import { compile } from "../../../../utils/ajv-compile";
import { type RegistrationRequest, RegistrationRequestSchema } from "./schema";

export const validateRegistrationRequest = compile<RegistrationRequest>(RegistrationRequestSchema);
