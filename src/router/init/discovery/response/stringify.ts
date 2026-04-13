import fastJson from "fast-json-stringify";
import { DiscoveryResponse, DiscoveryResponseSchema } from "./schema";

export const stringifyDiscoveryResponse: (data: DiscoveryResponse) => string =
    fastJson(DiscoveryResponseSchema);
