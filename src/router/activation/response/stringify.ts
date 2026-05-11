import fastJson from "fast-json-stringify";
import { type ActivationResponse, ActivationResponseSchema } from "./schema";

export const stringifyActivationResponse: (response: ActivationResponse) => string =
    fastJson(ActivationResponseSchema);
