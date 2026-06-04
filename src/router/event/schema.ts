import { type Static, Type } from "@sinclair/typebox";

export const EventEmitMessageSchema = Type.Object(
    {
        emitterAddonId: Type.String(),
        eventName: Type.String(),
        payload: Type.String(),
        timestamp: Type.Integer({ minimum: 0 }),
    },
    { additionalProperties: false },
);

export const EventDeliverMessageSchema = Type.Object(
    {
        emitterAddonId: Type.String(),
        eventName: Type.String(),
        payload: Type.String(),
        timestamp: Type.Integer({ minimum: 0 }),
    },
    { additionalProperties: false },
);

export type EventEmitMessage = Static<typeof EventEmitMessageSchema>;
export type EventDeliverMessage = Static<typeof EventDeliverMessageSchema>;
