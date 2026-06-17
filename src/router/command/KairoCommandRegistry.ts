import type {
    Block,
    CustomCommand,
    CustomCommandOrigin,
    CustomCommandResult,
    CustomCommandRegistry,
    Entity,
    Player,
} from "@minecraft/server";
import { CustomCommandSource, CustomCommandStatus } from "@minecraft/server";

export interface KairoCommandOrigin {
    readonly sourceType: CustomCommandSource;
    readonly sourceBlock: Block | undefined;
    readonly sourceEntity: Entity | undefined;
    readonly initiator: Entity | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KairoCommandHandler = (origin: KairoCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;

export interface CommandDeclarationEntry {
    readonly name: string;
    readonly mandatoryParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
    readonly optionalParameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
}

interface CommandEntry {
    readonly def: CustomCommand;
    readonly handler: KairoCommandHandler;
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
    ) {}

    registerCommand(def: CustomCommand, handler: KairoCommandHandler): void {
        this.assertNotSealed();
        this.declarations.set(def.name, { def, handler });

        this.nativeRegistry.registerCommand(
            def,
            (origin: CustomCommandOrigin, ...args: unknown[]) => {
                if (this.isActive()) {
                    return handler(wrapOrigin(origin), ...args);
                }
                return { status: CustomCommandStatus.Failure, message: `${def.name} is not available.` };
            },
        );
    }

    registerEnum(name: string, values: string[]): void {
        this.assertNotSealed();
        this.nativeRegistry.registerEnum(name, values);
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
