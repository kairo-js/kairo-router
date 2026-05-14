import { ReadyBufferedListener } from "../ReadyBufferedListener";
import type { ReadyState } from "../ReadyState";

type Handler = (message: string) => void;
type HandlerMap = Partial<Record<string, Handler>>;

export class ActivationRequestListener extends ReadyBufferedListener<string> {
    constructor(
        readyState: ReadyState,
        private readonly handlers: HandlerMap,
    ) {
        super(readyState);
    }

    protected filter(id: string): id is string {
        return Object.hasOwn(this.handlers, id);
    }

    protected handle(id: string, message: string): void {
        this.handlers?.[id]?.(message);
    }
}
