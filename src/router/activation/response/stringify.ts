import fastJson from "fast-json-stringify";
import { type ActivationResponse, ActivationResponseSchema } from "./schema";

let stringify: ((response: ActivationResponse) => string) | undefined;

export const stringifyActivationResponse = (response: ActivationResponse): string => {
    stringify ??= fastJson(ActivationResponseSchema);
    return stringify(response);
};
