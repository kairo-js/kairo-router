import { compile, safeJsonParse } from "@kairo-js/utils";
import type { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { Disposable } from "../types/Disposable";
import type { AddonEventRegistry } from "./AddonEventRegistry";
import { EventDeliverMessageSchema, type EventDeliverMessage } from "./schema";

export class AddonEventDeliveryHandler implements Disposable {
    private listener?: Disposable;
    private disposed = false;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly registry: AddonEventRegistry,
        private readonly getOwnKairoId: () => string,
    ) {}

    setup(): void {
        const ownKairoId = this.getOwnKairoId();
        this.listener = this.runtime.receive((id, message) => {
            if (id !== `${ownKairoId}:event-deliver`) return;
            this.handleDelivery(message);
        });
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.listener?.dispose();
        this.listener = undefined;
    }

    private handleDelivery(message: string): void {
        let msg: EventDeliverMessage;
        try {
            const parsed = safeJsonParse(message, () => new Error("parse failed"));
            if (!validateEventDeliverMessage(parsed)) return;
            msg = parsed as EventDeliverMessage;
        } catch {
            return;
        }

        let payload: unknown;
        try {
            payload = JSON.parse(msg.payload);
        } catch {
            return;
        }

        this.registry.deliver(msg.emitterAddonId, msg.eventName, payload);
    }
}

const validateEventDeliverMessage = compile(EventDeliverMessageSchema);
