import { Disposable } from "../../types/Disposable";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoInitEventId } from "./KairoInitEventId";

type Handler = (message: string) => void;

export class KairoInitListener {
    private handlers: Partial<Record<KairoInitEventId, Handler>> = {};
    constructor(private readonly runtime: KairoRuntime) {}

    setHandlers(handlers: Partial<Record<KairoInitEventId, Handler>>): void {
        this.handlers = handlers;
    }

    setup(): Disposable {
        return this.runtime.subscribe(this.onEvent);
    }

    private onEvent = (id: string, message: string) => {
        if (!this.isKairoInitEventId(id)) return;

        this.handlers[id]?.(message);
    };

    private isKairoInitEventId(id: string): id is KairoInitEventId {
        return Object.values(KairoInitEventId).includes(id as any);
    }
}
