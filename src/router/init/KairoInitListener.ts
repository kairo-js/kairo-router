import { ReadyState } from "../ReadyState";
import { KairoRuntime } from "../types/KairoRuntime";
import { ReadyBufferedListener } from "../types/ReadyBufferedListener";
import { KairoInitEventId } from "./KairoInitEventId";

type Handler = (message: string) => void;

const KAIRO_INIT_EVENT_ID_SET = new Set<KairoInitEventId>(Object.values(KairoInitEventId));

export class KairoInitListener extends ReadyBufferedListener<KairoInitEventId> {
    constructor(
        protected readonly readyState: ReadyState,
        private readonly handlers: Partial<Record<KairoInitEventId, Handler>>,
    ) {
        super(readyState);
    }

    setup(runtime: KairoRuntime) {
        if (this.handlers !== undefined) {
            throw new Error("KairoInitListener is already set up");
        }

        return super.setup(runtime);
    }

    protected filter(id: string): id is KairoInitEventId {
        return KAIRO_INIT_EVENT_ID_SET.has(id as KairoInitEventId);
    }

    protected handle(id: KairoInitEventId, message: string): void {
        this.handlers?.[id]?.(message);
    }
}
