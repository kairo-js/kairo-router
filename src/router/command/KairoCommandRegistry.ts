import type {
    CustomCommand,
    CustomCommandOrigin,
    CustomCommandResult,
    CustomCommandRegistry,
    Player,
} from "@minecraft/server";
import { CustomCommandStatus, world } from "@minecraft/server";
import type { Disposable } from "../types/Disposable";
import {
    COMMAND_INVOKE_EVENT,
    type CommandDeclarationEntry,
    type CommandInvokePayload,
} from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KairoCommandHandler = (player: Player | undefined, ...args: any[]) => CustomCommandResult | undefined;

interface CommandEntry {
    readonly def: CustomCommand;
    readonly handler: KairoCommandHandler;
}

export class KairoCommandRegistry {
    private sealed = false;
    private readonly declarations = new Map<string, CommandEntry>();

    constructor(
        private readonly nativeRegistry: CustomCommandRegistry,
        private readonly isActive: () => boolean,
        private readonly getAddonId: () => string | undefined,
        private readonly send: (id: string, message: string) => void,
    ) {}

    register(def: CustomCommand, handler: KairoCommandHandler): void {
        this.assertNotSealed();
        this.declarations.set(def.name, { def, handler });

        this.nativeRegistry.registerCommand(
            def,
            (origin: CustomCommandOrigin, ...args: unknown[]) => {
                const player = origin.sourceEntity as Player | undefined;

                if (this.isActive()) {
                    return handler(player, ...args);
                }

                const addonId = this.getAddonId();
                if (!addonId) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Addon not initialized.",
                    };
                }

                const payload: CommandInvokePayload = {
                    addonId,
                    commandName: def.name,
                    playerId: player?.id,
                    args: [...args],
                };
                this.send(COMMAND_INVOKE_EVENT, JSON.stringify(payload));

                // fire and forget — active version will execute and respond directly
                return { status: CustomCommandStatus.Success };
            },
        );
    }

    registerEnum(name: string, values: string[]): void {
        this.assertNotSealed();
        this.nativeRegistry.registerEnum(name, values);
    }

    setupInvokeListener(
        receive: (handler: (id: string, message: string) => void) => Disposable,
    ): Disposable {
        return receive((id, message) => {
            if (id !== COMMAND_INVOKE_EVENT) return;
            if (!this.isActive()) return;

            let payload: CommandInvokePayload;
            try {
                payload = JSON.parse(message) as CommandInvokePayload;
            } catch {
                return;
            }

            if (payload.addonId !== this.getAddonId()) return;

            const entry = this.declarations.get(payload.commandName);
            if (!entry) return;

            const player = payload.playerId
                ? world.getAllPlayers().find(p => p.id === payload.playerId)
                : undefined;

            try {
                entry.handler(player, ...payload.args);
            } catch (e) {
                console.error(`[kairo-router] command delegation failed: ${e}`);
            }
        });
    }

    seal(): void {
        this.sealed = true;
    }

    getDeclarations(): CommandDeclarationEntry[] {
        return [...this.declarations.values()].map(({ def }) => ({
            name: def.name,
            mandatoryParameters: (def.mandatoryParameters ?? []).map(p => ({
                name: p.name,
                type: String(p.type),
            })),
            optionalParameters: (def.optionalParameters ?? []).map(p => ({
                name: p.name,
                type: String(p.type),
            })),
        }));
    }

    private assertNotSealed(): void {
        if (this.sealed) {
            throw new Error(
                "[kairo-router] Command registration is only allowed during the startup event",
            );
        }
    }
}
