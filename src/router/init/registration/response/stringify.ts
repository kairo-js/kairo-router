import fastJson from "fast-json-stringify";
import { RegistrationResponse, RegistrationResponseSchema } from "./schema";

export const stringifyRegistrationResponse: (response: RegistrationResponse) => string = fastJson(
    RegistrationResponseSchema,
);
