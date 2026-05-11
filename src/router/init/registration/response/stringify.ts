import fastJson from "fast-json-stringify";
import { type RegistrationResponse, RegistrationResponseSchema } from "./schema";

let stringify: ((response: RegistrationResponse) => string) | undefined;

export const stringifyRegistrationResponse = (response: RegistrationResponse): string => {
    stringify ??= fastJson(RegistrationResponseSchema);
    return stringify(response);
};
