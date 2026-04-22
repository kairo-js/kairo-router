import { Static, Type } from "@sinclair/typebox";

export const ActivationRequestSchema = Type.Object({
    timestamp: Type.Integer({ minimum: 0 }),
});

export type ActivationRequest = Static<typeof ActivationRequestSchema>;
