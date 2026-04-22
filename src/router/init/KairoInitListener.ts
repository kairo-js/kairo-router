import { ReadyState } from "../ReadyState";
import { ReadyBufferedListener } from "../types/ReadyBufferedListener";
import { KairoInitEventId } from "./KairoInitEventId";

type Handler = (message: string) => void;
const KAIRO_INIT_EVENT_ID_SET = new Set<KairoInitEventId>(Object.values(KairoInitEventId));

export class KairoInitListener extends ReadyBufferedListener<KairoInitEventId> {
    constructor(
        readyState: ReadyState,
        private readonly handlers: Partial<Record<KairoInitEventId, Handler>>,
    ) {
        super(readyState);
    }

    protected filter(id: string): id is KairoInitEventId {
        return KAIRO_INIT_EVENT_ID_SET.has(id as KairoInitEventId);
    }

    protected handle(id: KairoInitEventId, message: string): void {
        this.handlers?.[id]?.(message);
    }
}
