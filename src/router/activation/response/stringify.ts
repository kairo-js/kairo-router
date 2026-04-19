import fastJson from "fast-json-stringify";
import { ActivationResponse, ActivationResponseSchema } from "./schema";

export const stringifyActivationResponse: (response: ActivationResponse) => string =
    fastJson(ActivationResponseSchema);
