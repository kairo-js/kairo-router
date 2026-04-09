export const discoveryResponseSchema = {
    type: "object" as const,
    properties: {
        addonId: { type: "string" as const },
        timestamp: { type: "number" as const },
    },
    required: ["addonId", "timestamp"],
    additionalProperties: false,
};
