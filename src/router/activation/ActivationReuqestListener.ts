import { KairoRuntime } from "../types/KairoRuntime";

export class ActivationRequestListener {
    setup(runtime: KairoRuntime): void {
        const receiveSubscription = runtime.receive(this.onReceive);
        const onReadySubscription = runtime.onReady(this.onReady);
    }

    private onReceive = (id: string, message: string) => {};

    private onReady = () => {};
}
