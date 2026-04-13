import { compile } from "../../../../utils/ajv-compile";
import { RegistrationRequest, RegistrationRequestSchema } from "./schema";

export const validateRegistrationRequest = compile<RegistrationRequest>(RegistrationRequestSchema);
