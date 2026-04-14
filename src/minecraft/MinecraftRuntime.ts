import { system } from "@minecraft/server";
import { IdRegistry, KairoRuntime } from "../router/KairoRuntime";
import { ScoreboardIdRegistry } from "./ScoreboardIdRegistry";

export class MinecraftRuntime implements KairoRuntime {
    get currentTick(): number {
        return system.currentTick;
    }
    send(id: string, message: string): void {
        system.sendScriptEvent(id, message);
    }
    getIdRegistry(objectiveId: string): IdRegistry {
        return new ScoreboardIdRegistry(objectiveId);
    }
}
