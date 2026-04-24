import { KairoRouterError, KairoRouterErrorReason } from "../../errors/KairoRouterError";
import { Disposable } from "../../types/Disposable";
import { Subscribable } from "../../types/Subscribable";

export class InternalEvent<T> implements Subscribable<T> {
    private listeners = new Set<(arg: T) => void>();

    constructor(
        private readonly isActive: () => boolean,
        private readonly options: {
            requireActiveOnSubscribe: boolean;
            clearOnDeactivate: boolean;
        } = {
            requireActiveOnSubscribe: true,
            clearOnDeactivate: true,
        },
    ) {}

    subscribe(fn: (arg: T) => void): Disposable {
        if (this.options.requireActiveOnSubscribe && !this.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }

        this.listeners.add(fn);
        return {
            dispose: () => this.unsubscribe(fn),
        };
    }

    unsubscribe(fn: (arg: T) => void): void {
        this.listeners.delete(fn);
    }

    emit(arg: T): void {
        for (const fn of this.listeners) {
            try {
                fn(arg);
            } catch (e) {
                // Listener で起こったエラーを吐くけど、実装は考え中
            }
        }
    }

    clear(): void {
        this.listeners.clear();
    }

    shouldClearOnDeactivate(): boolean {
        return this.options.clearOnDeactivate;
    }
}
