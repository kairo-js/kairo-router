import { KairoRouterError, KairoRouterErrorReason } from "../errors/KairoRouterError";
import { KairoContext } from "../KairoContext";
import { Disposable } from "./Disposable";
import { Subscribable } from "./Subscribable";

export class InternalEvent<T> implements Subscribable<T> {
    private listeners = new Set<(arg: T) => void>();

    constructor(
        private readonly context: KairoContext,
        private readonly options: {
            requireActiveOnSubscribe?: boolean;
            clearOnDeactivate?: boolean;
        } = {},
    ) {}

    subscribe(fn: (arg: T) => void): Disposable {
        if (this.options.requireActiveOnSubscribe ?? true) {
            this.assertActive();
        }

        this.listeners.add(fn);

        return {
            dispose: () => this.listeners.delete(fn),
        };
    }

    unsubscribe(fn: (arg: T) => void): void {
        this.listeners.delete(fn);
    }

    emit(arg: T): void {
        for (const fn of this.listeners) fn(arg);
    }

    clear(): void {
        this.listeners.clear();
    }

    shouldClearOnDeactivate(): boolean {
        return this.options.clearOnDeactivate ?? true;
    }

    private assertActive() {
        if (!this.context.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }
    }
}
