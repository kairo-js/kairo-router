import type {
    Block,
    CustomCommand,
    CustomCommandOrigin,
    CustomCommandResult,
    CustomCommandRegistry,
    Entity,
    Player,
} from "@minecraft/server";
import { CustomCommandSource, CustomCommandStatus, world } from "@minecraft/server";
import { safeJsonParse } from "@kairo-js/utils";
import type { Disposable } from "../types/Disposable";
import {
    COMMAND_INVOKE_EVENT,
    type CommandDeclarationEntry,
    type CommandInvokePayload,
    type SerializedOrigin,
} from "./schema";
import { stringifyCommandInvokePayload } from "./stringify";
import { validateCommandInvokePayload } from "./validate";

export interface KairoCommandOrigin {
    readonly sourceType: CustomCommandSource;
    readonly sourceBlock: Block | undefined;
    readonly sourceEntity: Entity | undefined;
    readonly initiator: Entity | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KairoCommandHandler = (origin: KairoCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;

interface CommandEntry {
    readonly def: CustomCommand;
    readonly handler: KairoCommandHandler;
}

function serializeOrigin(origin: CustomCommandOrigin): SerializedOrigin {
    switch (origin.sourceType) {
        case CustomCommandSource.Block: {
            const block = origin.sourceBlock!;
            return {
                sourceType: "Block",
                dimensionId: block.dimension.id,
                x: block.location.x,
                y: block.location.y,
                z: block.location.z,
            };
        }
        case CustomCommandSource.Entity: {
            const entity = origin.sourceEntity!;
            if (isPlayer(entity)) {
                return { sourceType: "Entity", playerId: entity.id };
            }
            return { sourceType: "Entity", entityId: entity.id };
        }
        case CustomCommandSource.NPCDialogue: {
            const npc = origin.sourceEntity!;
            const initiator = origin.initiator!;
            return {
                sourceType: "NPCDialogue",
                npcEntityId: npc.id,
                initiatorId: initiator.id,
            };
        }
        case CustomCommandSource.Server:
        default:
            return { sourceType: "Server" };
    }
}

function reconstructOrigin(serialized: SerializedOrigin): KairoCommandOrigin {
    switch (serialized.sourceType) {
        case "Block": {
            const block = world.getDimension(serialized.dimensionId).getBlock({
                x: serialized.x,
                y: serialized.y,
                z: serialized.z,
            });
            return {
                sourceType: CustomCommandSource.Block,
                sourceBlock: block,
                sourceEntity: undefined,
                initiator: undefined,
            };
        }
        case "Entity": {
            const entity = "playerId" in serialized
                ? world.getAllPlayers().find(p => p.id === serialized.playerId)
                : getEntityById(serialized.entityId);
            return {
                sourceType: CustomCommandSource.Entity,
                sourceBlock: undefined,
                sourceEntity: entity,
                initiator: undefined,
            };
        }
        case "NPCDialogue": {
            const npc = getEntityById(serialized.npcEntityId);
            const initiator = world.getAllPlayers().find(p => p.id === serialized.initiatorId);
            return {
                sourceType: CustomCommandSource.NPCDialogue,
                sourceBlock: undefined,
                sourceEntity: npc,
                initiator: initiator,
            };
        }
        case "Server":
        default:
            return {
                sourceType: CustomCommandSource.Server,
                sourceBlock: undefined,
                sourceEntity: undefined,
                initiator: undefined,
            };
    }
}

function isPlayer(entity: Entity): entity is Player {
    return entity.typeId === "minecraft:player";
}

function getEntityById(entityId: string): Entity | undefined {
    try {
        return world.getEntity(entityId);
    } catch {
        return undefined;
    }
}

function wrapOrigin(origin: CustomCommandOrigin): KairoCommandOrigin {
    return {
        sourceType: origin.sourceType,
        sourceBlock: origin.sourceBlock,
        sourceEntity: origin.sourceEntity,
        initiator: origin.initiator,
    };
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
                if (this.isActive()) {
                    return handler(wrapOrigin(origin), ...args);
                }

                const addonId = this.getAddonId();
                if (!addonId) {
                    return { status: CustomCommandStatus.Failure, message: "Addon not initialized." };
                }

                const payload: CommandInvokePayload = {
                    addonId,
                    commandName: def.name,
                    origin: serializeOrigin(origin),
                    args: [...args],
                };
                this.send(COMMAND_INVOKE_EVENT, stringifyCommandInvokePayload(payload));
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

            const parsed = safeJsonParse(message, () => new Error("cmd-invoke: parse failed"));
            if (!validateCommandInvokePayload(parsed)) return;
            const payload = parsed as CommandInvokePayload;

            if (payload.addonId !== this.getAddonId()) return;

            const entry = this.declarations.get(payload.commandName);
            if (!entry) return;

            const origin = reconstructOrigin(payload.origin);

            try {
                entry.handler(origin, ...payload.args);
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
