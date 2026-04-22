import { Static, Type } from "@sinclair/typebox";

export const ActivationResultSchema = Type.Object({
    success: Type.Boolean(),
    action: Type.Union([Type.Literal("activate"), Type.Literal("deactivate")]),
});

export type ActivationResult = Static<typeof ActivationResultSchema>;
