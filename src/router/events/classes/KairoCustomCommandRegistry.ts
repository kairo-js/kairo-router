import type {
    CustomCommand,
    CustomCommandOrigin,
    CustomCommandRegistry,
    CustomCommandResult,
} from "@minecraft/server";
import { CustomCommandStatus } from "@minecraft/server";

export class KairoCustomCommandRegistry {
    constructor(
        private readonly registry: CustomCommandRegistry,
        private readonly isActive: () => boolean,
        private readonly getAddonName?: () => string | undefined,
    ) {}

    registerCommand(
        customCommand: CustomCommand,
        callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined,
    ): void {
        this.registry.registerCommand(customCommand, (origin, ...args) => {
            if (!this.isActive()) {
                const name = this.getAddonName?.() ?? "Addon";
                return { status: CustomCommandStatus.Failure, message: `${name} is inactive.` };
            }
            return callback(origin, ...args);
        });
    }

    registerEnum(name: string, values: string[]): void {
        this.registry.registerEnum(name, values);
    }
}
