import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { KairoInitEventId } from "./KairoInitEventId";

type Handler = (message: string) => void;

const KAIRO_INIT_EVENT_ID_SET = new Set<string>(Object.values(KairoInitEventId));

export class KairoInitListener {
    private handlers: Partial<Record<KairoInitEventId, Handler>> = {};
    constructor() {}

    setHandlers(handlers: Partial<Record<KairoInitEventId, Handler>>): void {
        this.handlers = handlers;
    }

    setup(runtime: KairoRuntime): Disposable {
        return runtime.subscribe(this.onEvent);
    }

    private onEvent = (id: string, message: string) => {
        if (!this.isKairoInitEventId(id)) return;

        this.handlers[id]?.(message);
    };

    private isKairoInitEventId(id: string): id is KairoInitEventId {
        return KAIRO_INIT_EVENT_ID_SET.has(id);
    }
}
