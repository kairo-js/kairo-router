import {
    ScriptEventCommandMessageAfterEvent,
    ScriptEventSource,
    system,
    world,
    WorldLoadAfterEvent,
} from "@minecraft/server";
import { Disposable } from "../router/types/Disposable";
import { KairoRuntime } from "../router/types/KairoRuntime";
import { Random } from "../router/types/Random";
import { ScoreboardIdRegistry } from "./ScoreboardIdRegistry";
import { SeedRandom } from "../utils/SeedRandom";

export class MinecraftRuntime implements KairoRuntime {
    constructor(private readonly options: { randomSeed?: string } = {}) {}

    currentTick(): number {
        return system.currentTick;
    }
    send(id: string, message: string): void {
        system.sendScriptEvent(id, message);
    }
    receive(handler: (id: string, message: string) => void): Disposable {
        const listener = (ev: ScriptEventCommandMessageAfterEvent) => {
            if (ev.sourceType !== ScriptEventSource.Server) return;

            handler(ev.id, ev.message);
        };

        system.afterEvents.scriptEventReceive.subscribe(listener);

        return {
            dispose: () => {
                system.afterEvents.scriptEventReceive.unsubscribe(listener);
            },
        };
    }

    onReady(handler: () => void): Disposable {
        const listener = (_ev: WorldLoadAfterEvent) => {
            handler();
        };

        world.afterEvents.worldLoad.subscribe(listener);

        return {
            dispose: () => {
                world.afterEvents.worldLoad.unsubscribe(listener);
            },
        };
    }

    createIdRegistry(objectiveId: string): ScoreboardIdRegistry {
        return new ScoreboardIdRegistry(objectiveId);
    }

    createRandom(): Random {
        return new SeedRandom(this.options.randomSeed);
    }
}
