import { JSONSchemaType } from "ajv";
import { DiscoveryQuery } from "./types";

export const discoveryQuerySchema: JSONSchemaType<DiscoveryQuery> = {
    type: "object",
    required: ["timestamp", "scoreboard"],
    properties: {
        timestamp: { type: "number" },
        scoreboard: {
            type: "object",
            required: ["objective"],
            properties: {
                objective: {
                    type: "object",
                    required: ["id", "displayName"],
                    properties: {
                        id: { type: "string" },
                        displayName: {
                            type: "string",
                            const: "kairo:id_checker",
                        },
                    },
                },
            },
        },
    },
    additionalProperties: false,
};
