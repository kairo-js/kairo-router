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
    COMMAND_ROUTED_EVENT,
    type CommandInvokePayload,
    type CommandRoutedPayload,
    type SerializedOrigin,
    validateCommandRoutedPayload,
} from "./schema";

export interface KairoCommandOrigin {
    readonly sourceType: CustomCommandSource;
    readonly sourceBlock: Block | undefined;
    readonly sourceEntity: Entity | undefined;
    readonly initiator: Entity | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KairoCommandHandler = (origin: KairoCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;

export interface KairoCommandRegistrationOptions {
    readonly runWhenInactive?: boolean;
}

export interface CommandDeclarationEntry {
    readonly name: string;
    readonly mandatoryParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
    readonly optionalParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
}

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
            return { sourceType: CustomCommandSource.Block, sourceBlock: block, sourceEntity: undefined, initiator: undefined };
        }
        case "Entity": {
            const entity = "playerId" in serialized
                ? world.getAllPlayers().find(p => p.id === serialized.playerId)
                : getEntityById(serialized.entityId);
            return { sourceType: CustomCommandSource.Entity, sourceBlock: undefined, sourceEntity: entity, initiator: undefined };
        }
        case "NPCDialogue": {
            const npc = getEntityById(serialized.npcEntityId);
            const initiator = world.getAllPlayers().find(p => p.id === serialized.initiatorId);
            return { sourceType: CustomCommandSource.NPCDialogue, sourceBlock: undefined, sourceEntity: npc, initiator: initiator };
        }
        case "Server":
        default:
            return { sourceType: CustomCommandSource.Server, sourceBlock: undefined, sourceEntity: undefined, initiator: undefined };
    }
}

function serializeArg(arg: unknown): unknown {
    if (arg === null || arg === undefined) return arg;
    if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") return arg;
    if (Array.isArray(arg)) return arg.map(serializeArg);
    if (typeof arg === "object") {
        const obj = arg as Record<string, unknown>;
        if (typeof obj["id"] === "string" && typeof obj["typeId"] === "string") {
            return obj["typeId"] === "minecraft:player"
                ? { type: "player", id: obj["id"] }
                : { type: "entity", id: obj["id"] };
        }
        if (typeof obj["x"] === "number" && typeof obj["y"] === "number" && typeof obj["z"] === "number") {
            return { type: "vec3", x: obj["x"], y: obj["y"], z: obj["z"] };
        }
    }
    return String(arg);
}

function reconstructArg(arg: unknown): unknown {
    if (arg === null || arg === undefined || typeof arg !== "object") return arg;
    if (Array.isArray(arg)) return arg.map(reconstructArg);
    const obj = arg as Record<string, unknown>;
    if (obj["type"] === "player" && typeof obj["id"] === "string") {
        return world.getAllPlayers().find(p => p.id === (obj["id"] as string));
    }
    if (obj["type"] === "entity" && typeof obj["id"] === "string") {
        try { return world.getEntity(obj["id"] as string); } catch { return undefined; }
    }
    if (obj["type"] === "vec3") {
        return { x: obj["x"], y: obj["y"], z: obj["z"] };
    }
    return arg;
}

function isPlayer(entity: Entity): entity is Player {
    return entity.typeId === "minecraft:player";
}

function getEntityById(entityId: string): Entity | undefined {
    try { return world.getEntity(entityId); } catch { return undefined; }
}

function wrapOrigin(origin: CustomCommandOrigin): KairoCommandOrigin {
    return {
        sourceType: origin.sourceType,
        sourceBlock: origin.sourceBlock,
        sourceEntity: origin.sourceEntity,
        initiator: origin.initiator,
    };
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export class KairoCommandRegistry {
    private sealed = false;
    private readonly declarations = new Map<string, CommandEntry>();
    private delegatable = new Map<string, boolean>();
    private unavailableMessages = new Map<string, string>();

    constructor(
        private readonly nativeRegistry: CustomCommandRegistry,
        private readonly isActive: () => boolean,
        private readonly send?: (id: string, message: string) => void,
        private readonly getAddonId?: () => string | undefined,
        private readonly getKairoId?: () => string | undefined,
    ) {}

    registerCommand(
        def: CustomCommand,
        handler: KairoCommandHandler,
        options?: KairoCommandRegistrationOptions,
    ): void {
        this.assertNotSealed();
        this.declarations.set(def.name, { def, handler });

        try {
            this.nativeRegistry.registerCommand(
                def,
                (origin: CustomCommandOrigin, ...args: unknown[]) => {
                    const active = this.isActive();
                    const runWhenInactive = options?.runWhenInactive ?? false;
                    const delegatable = this.delegatable.get(def.name) ?? false;
                    const addonId = this.getAddonId?.();
                    const kairoId = this.getKairoId?.();
                    console.log(
                        `[kairo-router:cmd] native callback name=${def.name} ` +
                        `active=${active} runWhenInactive=${runWhenInactive} ` +
                        `delegatable=${delegatable} addonId=${addonId ?? "<none>"} ` +
                        `kairoId=${kairoId ?? "<none>"} args=${args.length}`,
                    );
                    if (active || runWhenInactive) {
                        console.log(`[kairo-router:cmd] executing local handler name=${def.name}`);
                        return handler(wrapOrigin(origin), ...args);
                    }

                    if (!delegatable) {
                        console.warn(`[kairo-router:cmd] command unavailable name=${def.name}`);
                        return {
                            status: CustomCommandStatus.Failure,
                            message: this.unavailableMessages.get(def.name) ?? `${def.name} is not available.`,
                        };
                    }

                    if (!addonId || !this.send) {
                        console.warn(
                            `[kairo-router:cmd] cannot relay name=${def.name} ` +
                            `addonId=${addonId ?? "<none>"} send=${!!this.send}`,
                        );
                        return { status: CustomCommandStatus.Failure, message: `${def.name} is not available.` };
                    }

                    const payload: CommandInvokePayload = {
                        addonId,
                        commandName: def.name,
                        origin: serializeOrigin(origin),
                        args: [...args].map(serializeArg),
                    };
                    console.log(`[kairo-router:cmd] relaying via ${COMMAND_INVOKE_EVENT} name=${def.name} addonId=${addonId}`);
                    this.send(COMMAND_INVOKE_EVENT, JSON.stringify(payload));
                    return { status: CustomCommandStatus.Success };
                },
            );
        } catch (error) {
            console.warn(`[kairo-router:cmd] native register skipped name=${def.name}: ${errorMessage(error)}`);
        }
    }

    registerEnum(name: string, values: string[]): void {
        this.assertNotSealed();
        try {
            this.nativeRegistry.registerEnum(name, values);
        } catch (error) {
            console.warn(`[kairo-router:cmd] native enum skipped name=${name}: ${errorMessage(error)}`);
        }
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

    setDelegatable(map: Map<string, boolean>, unavailableMessages?: Map<string, string>): void {
        this.delegatable = new Map(map);
        this.unavailableMessages = unavailableMessages ? new Map(unavailableMessages) : new Map();
        console.log(
            `[kairo-router:cmd] setDelegatable entries=` +
            `${[...this.delegatable.entries()].map(([name, value]) => `${name}:${value}`).join(",")}`,
        );
    }

    setupRoutedListener(
        receive: (handler: (id: string, message: string) => void) => Disposable,
    ): Disposable {
        return receive((id, message) => {
            if (id !== COMMAND_ROUTED_EVENT) return;
            const active = this.isActive();
            const myKairoId = this.getKairoId?.();
            console.log(
                `[kairo-router:cmd] routed event received active=${active} ` +
                `kairoId=${myKairoId ?? "<none>"} bytes=${message.length}`,
            );
            if (!active) return;

            const parsed = safeJsonParse(message, () => new Error("cmd-routed: parse failed"));
            if (!validateCommandRoutedPayload(parsed)) return;
            const payload = parsed as CommandRoutedPayload;

            if (!myKairoId || payload.targetKairoId !== myKairoId) {
                console.log(
                    `[kairo-router:cmd] routed event ignored target=${payload.targetKairoId} ` +
                    `self=${myKairoId ?? "<none>"}`,
                );
                return;
            }

            const entry = this.declarations.get(payload.commandName);
            if (!entry) {
                console.warn(`[kairo-router] routed command not found: ${payload.commandName}`);
                return;
            }

            const origin = reconstructOrigin(payload.origin);
            const args = payload.args.map(reconstructArg);

            try {
                console.log(`[kairo-router:cmd] executing routed handler name=${payload.commandName}`);
                entry.handler(origin, ...args);
            } catch (e) {
                console.error(`[kairo-router] routed command execution failed: ${e}`);
            }
        });
    }

    private assertNotSealed(): void {
        if (this.sealed) {
            throw new Error(
                "[kairo-router] Command registration is only allowed during the startup event",
            );
        }
    }
}
