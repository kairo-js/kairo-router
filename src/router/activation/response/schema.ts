import { Static, Type } from "@sinclair/typebox";

export const ActivationResponseSchema = Type.Object(
    {
        timestamp: Type.Integer({ minimum: 0 }),
        success: Type.Boolean(),
        action: Type.Union([Type.Literal("activate"), Type.Literal("deactivate")]),
    },
    { additionalProperties: false },
);

export type ActivationResponse = Static<typeof ActivationResponseSchema>;
