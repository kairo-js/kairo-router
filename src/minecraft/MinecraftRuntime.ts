import { system } from "@minecraft/server";
import { KairoRuntime } from "../router/KairoRuntime";

export class MinecraftRuntime implements KairoRuntime {
    get currentTick(): number {
        return system.currentTick;
    }
    send(id: string, message: string): void {
        system.sendScriptEvent(id, message);
    }
}
