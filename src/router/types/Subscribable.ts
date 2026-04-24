import { InternalEvent } from "../events/types/InternalEvent";
import { Disposable } from "./Disposable";

export interface Subscribable<T> {
    subscribe(fn: (arg: T) => void): Disposable;
    unsubscribe(fn: (arg: T) => void): void;
}

export function asSubscribable<T>(event: InternalEvent<T>): Subscribable<T> {
    return {
        subscribe: (fn) => event.subscribe(fn),
        unsubscribe: (fn) => event.unsubscribe(fn),
    };
}
