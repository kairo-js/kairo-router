import type { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { EventEmitMessage } from "./schema";

export class AddonEventEmitter {
    constructor(
        private readonly runtime: KairoRuntime,
        private readonly getEmitterAddonId: () => string,
    ) {}

    emit(eventName: string, payload?: unknown): void {
        const msg: EventEmitMessage = {
            emitterAddonId: this.getEmitterAddonId(),
            eventName,
            payload: JSON.stringify(payload ?? null),
            timestamp: this.runtime.currentTick(),
        };
        try {
            this.runtime.send("kairo:event-emit", JSON.stringify(msg));
        } catch {}
    }
}
