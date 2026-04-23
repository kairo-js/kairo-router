import {
    ScriptEventCommandMessageAfterEvent,
    ScriptEventSource,
    system,
    world,
    WorldLoadAfterEvent,
} from "@minecraft/server";
import { Disposable } from "../router/types/Disposable";
import { KairoRuntime, RuntimeEvent } from "../router/types/KairoRuntime";
import { KairoSchedulerRuntime } from "../router/types/KairoSchedulerRuntime";
import { Random } from "../router/types/Random";
import { SeedRandom } from "../utils/SeedRandom";
import { ScoreboardIdRegistry } from "./ScoreboardIdRegistry";
import { minecraftEventBinding } from "./minecraftEventBinding";

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

    bindEvents(handler: (ev: RuntimeEvent) => void): Disposable {
        const disposables: Disposable[] = [];

        for (const [name, fn] of Object.entries(minecraftEventBinding.after)) {
            disposables.push(
                fn(world, (payload: any) => {
                    handler({ phase: "after", name, payload });
                }),
            );
        }

        for (const [name, fn] of Object.entries(minecraftEventBinding.before)) {
            disposables.push(
                fn(world, (payload: any) => {
                    handler({ phase: "before", name, payload });
                }),
            );
        }

        return {
            dispose: () => disposables.forEach((d) => d.dispose()),
        };
    }

    scheduler: KairoSchedulerRuntime = {
        runInterval: (cb, tick) => system.runInterval(cb, tick),
        runTimeout: (cb, tick) => system.runTimeout(cb, tick),
        clearRun: (id) => system.clearRun(id),
    };
}
