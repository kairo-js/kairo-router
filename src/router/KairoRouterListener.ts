import { KairoEventId } from "./KairoEventId";
import { ReadyState } from "./ReadyState";
import { ReadyBufferedListener } from "./types/ReadyBufferedListener";

type Handler = (message: string) => void;
const KAIRO_EVENT_ID_SET = new Set<KairoEventId>(Object.values(KairoEventId));

export class KairoRouterListener extends ReadyBufferedListener<KairoEventId> {
    constructor(
        readyState: ReadyState,
        private readonly handlers: Partial<Record<KairoEventId, Handler>>,
    ) {
        super(readyState);
    }

    protected filter(id: string): id is KairoEventId {
        return KAIRO_EVENT_ID_SET.has(id as KairoEventId);
    }

    protected handle(id: KairoEventId, message: string): void {
        this.handlers?.[id]?.(message);
    }
}
