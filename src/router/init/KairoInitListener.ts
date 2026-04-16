import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { KairoInitEventId } from "./KairoInitEventId";

type Handler = (message: string) => void;

const KAIRO_INIT_EVENT_ID_SET = new Set<string>(Object.values(KairoInitEventId));

export class KairoInitListener {
    private handlers: Partial<Record<KairoInitEventId, Handler>> = {};
    private hasWorldLoaded = false;
    private pendingMessages: { id: KairoInitEventId; message: string }[] = [];
    constructor() {}

    setHandlers(handlers: Partial<Record<KairoInitEventId, Handler>>): void {
        this.handlers = handlers;
    }

    setup(runtime: KairoRuntime): Disposable {
        const eventSubscription = runtime.subscribe(this.onEvent);
        const worldLoadSubscription = runtime.subscribeWorldLoad(this.onWorldLoad);

        return {
            dispose: () => {
                eventSubscription.dispose();
                worldLoadSubscription.dispose();
            },
        };
    }

    private onEvent = (id: string, message: string) => {
        if (!this.isKairoInitEventId(id)) return;

        if (!this.hasWorldLoaded) {
            this.pendingMessages.push({ id, message });
            return;
        }

        this.handlers[id]?.(message);
    };

    private onWorldLoad = () => {
        if (this.hasWorldLoaded) return;

        this.hasWorldLoaded = true;

        const messages = this.pendingMessages;
        this.pendingMessages = [];

        for (const { id, message } of messages) {
            this.handlers[id]?.(message);
        }
    };

    private isKairoInitEventId(id: string): id is KairoInitEventId {
        return KAIRO_INIT_EVENT_ID_SET.has(id);
    }
}
