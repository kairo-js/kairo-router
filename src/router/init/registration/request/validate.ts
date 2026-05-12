import { compile } from "@kairo-js/utils";
import { RegistrationRequestSchema } from "./schema";

export const validateRegistrationRequest = compile(RegistrationRequestSchema);
