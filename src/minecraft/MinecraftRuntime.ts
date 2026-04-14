import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";

export class MinecraftRuntime implements KairoRuntime {
    currentTick(): number {
        return system.currentTick;
    }
    send(id: string, message: string): void {
        system.sendScriptEvent(id, message);
    }
    subscribe(handler: (id: string, message: string) => void): Disposable {
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
}
