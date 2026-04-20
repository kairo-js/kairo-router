import { KairoListenerError, KairoListenerErrorReason } from "../errors/KairoListenerError";
import { ReadyState } from "../ReadyState";
import { Disposable } from "./Disposable";
import { KairoRuntime } from "./KairoRuntime";

export abstract class ReadyBufferedListener<TId extends string> {
    private readonly MAX_PENDING = 1000;

    private pendingMessages: { id: TId; message: string }[] = [];
    private isSetup = false;

    constructor(protected readonly readyState: ReadyState) {}

    setup(runtime: KairoRuntime): Disposable {
        if (this.isSetup) {
            throw new KairoListenerError(KairoListenerErrorReason.AlreadySetUp);
        }
        this.isSetup = true;

        const receiveSub = runtime.receive(this.onEvent);
        const readySub = this.readyState.onReady(this.flush);

        return {
            dispose: () => {
                receiveSub.dispose();
                readySub.dispose();
            },
        };
    }

    private onEvent = (id: string, message: string) => {
        if (!this.filter(id)) return;

        const typedId = id as TId;

        if (this.readyState.isReady() && this.pendingMessages.length === 0) {
            this.handle(typedId, message);
            return;
        }

        if (!this.readyState.isReady()) {
            if (this.pendingMessages.length >= this.MAX_PENDING) {
                this.pendingMessages.shift();
            }
            this.pendingMessages.push({ id: typedId, message });
            return;
        }

        this.handle(typedId, message);
    };

    private flush = () => {
        const messages = this.pendingMessages;
        this.pendingMessages = [];

        for (const { id, message } of messages) {
            this.handle(id, message);
        }
    };

    protected abstract filter(id: string): id is TId;
    protected abstract handle(id: TId, message: string): void;
}
