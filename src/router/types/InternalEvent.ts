import { Disposable } from "./Disposable";
import { Subscribable } from "./Subscribable";

export class InternalEvent<T> implements Subscribable<T> {
    private listeners = new Set<(arg: T) => void>();

    subscribe(fn: (arg: T) => void): Disposable {
        this.listeners.add(fn);
        return { dispose: () => this.listeners.delete(fn) };
    }

    unsubscribe(fn: (arg: T) => void): void {
        this.listeners.delete(fn);
    }

    emit(arg: T): void {
        for (const fn of this.listeners) fn(arg);
    }
}
