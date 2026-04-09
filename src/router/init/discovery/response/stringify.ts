import fastJson, { Schema } from "fast-json-stringify";
import { discoveryResponseSchema } from "./schema";
import { DiscoveryResponse } from "./types";

export const stringifyDiscoveryResponse: (response: DiscoveryResponse) => string = fastJson(
    discoveryResponseSchema as unknown as Schema,
);
