export const COMMAND_INVOKE_EVENT = "kairo:cmd-invoke";

export interface CommandDeclarationEntry {
    readonly name: string;
    readonly mandatoryParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
    readonly optionalParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
}

export interface CommandInvokePayload {
    readonly addonId: string;
    readonly commandName: string;
    readonly playerId: string | undefined;
    readonly args: unknown[];
}
