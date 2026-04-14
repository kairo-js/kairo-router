import { Static, Type } from "@sinclair/typebox";

export const DiscoveryQuerySchema = Type.Object(
    {
        timestamp: Type.Number(),
        idNamespace: Type.String(),
    },
    {
        additionalProperties: false,
    },
);

export type DiscoveryQuery = Static<typeof DiscoveryQuerySchema>;
