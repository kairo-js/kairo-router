import { KairoRouterError, KairoRouterErrorReason } from "../errors/KairoRouterError";
import { KairoContext } from "../KairoContext";
import { InternalEvent } from "../types/InternalEvent";
import { KairoEventMap } from "../types/KairoEventMap";

export class EventRegistry<E extends KairoEventMap> {
    private after = new Map<string, InternalEvent<any>>();
    private before = new Map<string, InternalEvent<any>>();

    constructor(private context: KairoContext) {}

    getAfter<K extends keyof E["after"]>(name: K): InternalEvent<E["after"][K]> {
        if (!this.after.has(name as string)) {
            this.after.set(name as string, new InternalEvent(this.context));
        }
        return this.after.get(name as string)!;
    }

    getBefore<K extends keyof E["before"]>(name: K): InternalEvent<E["before"][K]> {
        if (!this.before.has(name as string)) {
            this.before.set(name as string, new InternalEvent(this.context));
        }
        return this.before.get(name as string)!;
    }

    emitAfter<K extends keyof E["after"]>(name: K, payload: E["after"][K]) {
        this.assertActive();
        this.getAfter(name).emit(payload);
    }

    emitBefore<K extends keyof E["before"]>(name: K, payload: E["before"][K]) {
        this.assertActive();
        this.getBefore(name).emit(payload);
    }

    private assertActive() {
        if (!this.context.isActive()) {
            throw new KairoRouterError(KairoRouterErrorReason.Inactive);
        }
    }
}
