import fastJson from "fast-json-stringify";
import { type DiscoveryResponse, DiscoveryResponseSchema } from "./schema";

export const stringifyDiscoveryResponse: (response: DiscoveryResponse) => string =
    fastJson(DiscoveryResponseSchema);
