import { Disposable } from "./types/Disposable";

export class ReadyState {
    private ready = false;
    private listeners: (() => void)[] = [];

    isReady(): boolean {
        return this.ready;
    }

    markReady(): void {
        if (this.ready) return;
        this.ready = true;

        for (const l of this.listeners) l();
        this.listeners = [];
    }

    onReady(listener: () => void): Disposable {
        if (this.ready) {
            listener();
            return { dispose() {} };
        }

        this.listeners.push(listener);

        return {
            dispose: () => {
                this.listeners = this.listeners.filter((l) => l !== listener);
            },
        };
    }
}
