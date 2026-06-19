import { type Static, Type } from "@sinclair/typebox";
import { compile } from "@kairo-js/utils";

export const COMMAND_INVOKE_EVENT = "kairo:cmd-invoke";
export const COMMAND_ROUTED_EVENT = "kairo:cmd-routed";

const SerializedOriginSchema = Type.Union([
    Type.Object({ sourceType: Type.Literal("Block"), dimensionId: Type.String(), x: Type.Number(), y: Type.Number(), z: Type.Number() }),
    Type.Object({ sourceType: Type.Literal("Entity"), playerId: Type.String() }),
    Type.Object({ sourceType: Type.Literal("Entity"), entityId: Type.String() }),
    Type.Object({ sourceType: Type.Literal("NPCDialogue"), npcEntityId: Type.String(), initiatorId: Type.String() }),
    Type.Object({ sourceType: Type.Literal("Server") }),
]);

export const CommandInvokePayloadSchema = Type.Object(
    {
        addonId: Type.String(),
        commandName: Type.String(),
        origin: SerializedOriginSchema,
        args: Type.Array(Type.Unknown()),
    },
    { additionalProperties: false },
);

export const CommandRoutedPayloadSchema = Type.Object(
    {
        targetKairoId: Type.String(),
        commandName: Type.String(),
        origin: SerializedOriginSchema,
        args: Type.Array(Type.Unknown()),
    },
    { additionalProperties: false },
);

export type SerializedOrigin = Static<typeof SerializedOriginSchema>;
export type CommandInvokePayload = Static<typeof CommandInvokePayloadSchema>;
export type CommandRoutedPayload = Static<typeof CommandRoutedPayloadSchema>;

export const validateCommandInvokePayload = compile(CommandInvokePayloadSchema);
export const validateCommandRoutedPayload = compile(CommandRoutedPayloadSchema);
