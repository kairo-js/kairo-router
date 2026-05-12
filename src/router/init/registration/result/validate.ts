import { compile } from "@kairo-js/utils";
import { RegistrationResultSchema } from "./schema";

export const validateRegistrationResult = compile(RegistrationResultSchema);
