import fastJson from "fast-json-stringify";
import { DiscoveryResponse } from "../types/DiscoveryResponse";
import { discoveryResponseSchema } from "./discoveryResponse.schema";

export const stringifyDiscoveryResponse: (response: DiscoveryResponse) => string =
    fastJson(discoveryResponseSchema);
