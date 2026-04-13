import { Static, Type } from "@sinclair/typebox";

export const DiscoveryQuerySchema = Type.Object(
    {
        timestamp: Type.Number(),
        scoreboard: Type.Object({
            objective: Type.Object({
                id: Type.String(),
                displayName: Type.Literal("kairo:id_checker"),
            }),
        }),
    },
    {
        additionalProperties: false,
    },
);

export type DiscoveryQuery = Static<typeof DiscoveryQuerySchema>;
