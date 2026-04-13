import { Static, Type } from "@sinclair/typebox";

export const DiscoveryResponseSchema = Type.Object(
    {
        kairoId: Type.String(),
        timestamp: Type.Number(),
    },
    { additionalProperties: false },
);

export type DiscoveryResponse = Static<typeof DiscoveryResponseSchema>;
