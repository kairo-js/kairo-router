import { Static, Type } from "@sinclair/typebox";

export const ActivationResponseSchema = Type.Object(
    {
        timestamp: Type.Integer({ minimum: 0 }),
    },
    { additionalProperties: false },
);

export type ActivationResponse = Static<typeof ActivationResponseSchema>;
