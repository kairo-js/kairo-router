import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { Disposable } from "../../types/disposable";
import { KairoInitEventId } from "./types";

type Handler = (message: string) => void;

export class KairoInitListener {
    constructor(private handlers: Partial<Record<KairoInitEventId, Handler>> = {}) {}

    setHandlers(handlers: Partial<Record<KairoInitEventId, Handler>>): void {
        this.handlers = handlers;
    }

    setup(): Disposable {
        system.afterEvents.scriptEventReceive.subscribe(this.onEvent);

        return {
            dispose: () => {
                system.afterEvents.scriptEventReceive.unsubscribe(this.onEvent);
            },
        };
    }

    private onEvent = (ev: ScriptEventCommandMessageAfterEvent): void => {
        if (ev.sourceType !== ScriptEventSource.Server) return;

        if (!this.isKairoInitEventId(ev.id)) return;

        this.handlers[ev.id]?.(ev.message);
    };

    private isKairoInitEventId(id: string): id is KairoInitEventId {
        return Object.values(KairoInitEventId).includes(id as any);
    }
}
