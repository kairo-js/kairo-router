import {
    ScriptEventCommandMessageAfterEvent,
    ScriptEventSource,
    system,
    world,
    WorldLoadAfterEvent,
} from "@minecraft/server";
import { KairoEventMap } from "../events/types/KairoEventMap";
import { EventBindingSpec } from "../events/types/EventBindingSpec";
import { Disposable } from "./Disposable";
import { IdRegistry } from "./IdRegistry";
import { KairoSchedulerRuntime } from "./KairoSchedulerRuntime";
import { Random } from "./Random";
import { SeedRandom } from "../../utils/SeedRandom";

type AfterRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["after"]]: {
        phase: "after";
        name: K;
        payload: E["after"][K];
    };
}[keyof E["after"]];

type BeforeRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["before"]]: {
        phase: "before";
        name: K;
        payload: E["before"][K];
    };
}[keyof E["before"]];

export type RuntimeEvent<E extends KairoEventMap = KairoEventMap> =
    | AfterRuntimeEvent<E>
    | BeforeRuntimeEvent<E>;

class ScoreboardIdRegistry implements IdRegistry {
    constructor(private readonly objectiveId: string) {}

    private get objective() {
        const obj = world.scoreboard.getObjective(this.objectiveId);
        if (!obj) {
            throw new Error(`Objective not found: ${this.objectiveId}`);
        }
        return obj;
    }

    has(id: string): boolean {
        return this.objective.hasParticipant(id);
    }

    register(id: string): void {
        this.objective.setScore(id, 0);
    }
}

const minecraftEventBinding: EventBindingSpec<KairoEventMap> = {
    after: {
        addonActivate: (_world, _handler) => ({ dispose: () => {} }),
        playerJoin: (world, handler) => world.afterEvents.playerJoin.subscribe(handler),
    },
    before: {
        addonDeactivate: (_world, _handler) => ({ dispose: () => {} }),
    },
};

export class KairoRuntime<E extends KairoEventMap = KairoEventMap> {
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
            dispose: () => system.afterEvents.scriptEventReceive.unsubscribe(listener),
        };
    }

    onReady(handler: () => void): Disposable {
        const listener = (_ev: WorldLoadAfterEvent) => handler();
        world.afterEvents.worldLoad.subscribe(listener);

        return {
            dispose: () => world.afterEvents.worldLoad.unsubscribe(listener),
        };
    }

    createIdRegistry(objectiveId: string): IdRegistry {
        return new ScoreboardIdRegistry(objectiveId);
    }

    createRandom(): Random {
        return new SeedRandom(this.options.randomSeed);
    }

    bindEvents(handler: (ev: RuntimeEvent<E>) => void): Disposable {
        const disposables: Disposable[] = [];

        for (const [name, fn] of Object.entries(minecraftEventBinding.after)) {
            disposables.push(
                fn(world, (payload: any) => {
                    handler({ phase: "after", name: name as keyof E["after"], payload });
                }),
            );
        }

        for (const [name, fn] of Object.entries(minecraftEventBinding.before)) {
            disposables.push(
                fn(world, (payload: any) => {
                    handler({ phase: "before", name: name as keyof E["before"], payload });
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
