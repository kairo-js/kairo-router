import { KairoRouterError, KairoRouterErrorReason } from "../errors/KairoRouterError";
import { InternalEvent } from "./types/InternalEvent";
import { KairoEventMap } from "./types/KairoEventMap";

export class EventRegistry<E extends KairoEventMap> {
    private afterStore = new Map<keyof E["after"], InternalEvent<any>>();
    private beforeStore = new Map<keyof E["before"], InternalEvent<any>>();

    constructor(private readonly isActive: () => boolean) {}

    private getOrCreateEvent<P extends "after" | "before", K extends keyof E[P]>(
        phase: P,
        name: K,
    ): InternalEvent<E[P][K]> {
        const eventName = name as string;

        if (phase === "after") {
            const store = this.afterStore;
            const key = name as unknown as keyof E["after"];
            if (!store.has(key)) {
                const options =
                    eventName === "addonActivate"
                        ? { requireActiveOnSubscribe: false, clearOnDeactivate: false }
                        : undefined;
                store.set(key, new InternalEvent(this.isActive, options));
            }
            return store.get(key) as InternalEvent<E[P][K]>;
        } else {
            const store = this.beforeStore;
            const key = name as unknown as keyof E["before"];
            if (!store.has(key)) {
                const options =
                    eventName === "addonDeactivate"
                        ? { requireActiveOnSubscribe: false, clearOnDeactivate: false }
                        : undefined;
                store.set(key, new InternalEvent(this.isActive, options));
            }
            return store.get(key) as InternalEvent<E[P][K]>;
        }
    }

    public getAfter<K extends keyof E["after"]>(name: K): InternalEvent<E["after"][K]> {
        return this.getOrCreateEvent("after", name);
    }

    public getBefore<K extends keyof E["before"]>(name: K): InternalEvent<E["before"][K]> {
        return this.getOrCreateEvent("before", name);
    }

    public emit<P extends "after" | "before", K extends keyof E[P]>(
        phase: P,
        name: K,
        payload: E[P][K],
    ): void {
        if (!this.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }
        this.getOrCreateEvent(phase, name).emit(payload);
    }

    public clearActiveScopedListeners(): void {
        for (const event of this.afterStore.values()) {
            if (event.shouldClearOnDeactivate()) event.clear();
        }
        for (const event of this.beforeStore.values()) {
            if (event.shouldClearOnDeactivate()) event.clear();
        }
    }
}
