import { Static, Type } from "@sinclair/typebox";

export const ActivationRequestSchema = Type.Object({
    timestamp: Type.Integer({ minimum: 0 }),
    type: Type.Union([Type.Literal("activate"), Type.Literal("deactivate")]),
});

export type ActivationRequest = Static<typeof ActivationRequestSchema>;
