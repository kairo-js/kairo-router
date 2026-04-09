import { compile } from "../../../../utils/ajv-compile";
import { registrationRequestSchema } from "./schema";
import { RegistrationRequest } from "./types";

export const validateRegistrationRequest = compile<RegistrationRequest>(registrationRequestSchema);
