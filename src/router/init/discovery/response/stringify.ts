import fastJson from "fast-json-stringify";
import { type DiscoveryResponse, DiscoveryResponseSchema } from "./schema";

let stringify: ((response: DiscoveryResponse) => string) | undefined;

export const stringifyDiscoveryResponse = (response: DiscoveryResponse): string => {
    stringify ??= fastJson(DiscoveryResponseSchema);
    return stringify(response);
};
