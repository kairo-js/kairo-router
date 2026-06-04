export type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

export interface EventSubscription {
    readonly emitterAddonId: string;
    readonly eventName: string;
}

export interface AddonEventRegistration {
    on<TPayload = unknown>(
        emitterAddonId: string,
        eventName: string,
        handler: EventHandler<TPayload>,
    ): void;
}

export class AddonEventRegistry {
    private readonly handlers = new Map<string, Map<string, EventHandler[]>>();

    on<TPayload = unknown>(
        emitterAddonId: string,
        eventName: string,
        handler: EventHandler<TPayload>,
    ): void {
        let byName = this.handlers.get(emitterAddonId);
        if (!byName) {
            byName = new Map();
            this.handlers.set(emitterAddonId, byName);
        }
        const list = byName.get(eventName) ?? [];
        list.push(handler as EventHandler);
        byName.set(eventName, list);
    }

    getSubscriptions(): EventSubscription[] {
        const subs: EventSubscription[] = [];
        for (const [emitterAddonId, byName] of this.handlers) {
            for (const eventName of byName.keys()) {
                subs.push({ emitterAddonId, eventName });
            }
        }
        return subs;
    }

    deliver(emitterAddonId: string, eventName: string, payload: unknown): void {
        const handlers = this.handlers.get(emitterAddonId)?.get(eventName) ?? [];
        for (const handler of handlers) {
            try {
                handler(payload);
            } catch {}
        }
    }
}
