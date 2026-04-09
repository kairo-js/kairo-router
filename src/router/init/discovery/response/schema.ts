import { JSONSchemaType } from "ajv";
import { DiscoveryResponse } from "./types";

export const discoveryResponseSchema: JSONSchemaType<DiscoveryResponse> = {
    type: "object",
    properties: {
        addonId: { type: "string" },
        timestamp: { type: "number" },
    },
    required: ["addonId", "timestamp"],
    additionalProperties: false,
};
