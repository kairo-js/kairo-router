import { Static, Type } from "@sinclair/typebox";

const ActivationResponseSchema = Type.Object({});

export type ActivationResponse = Static<typeof ActivationResponseSchema>;
