import { compile } from "@kairo-js/utils";
import { type RegistrationRequest, RegistrationRequestSchema } from "./schema";

export const validateRegistrationRequest = compile<RegistrationRequest>(RegistrationRequestSchema);
