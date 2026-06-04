import type { KairoEventMap } from "../../minecraft/KairoEventMap";
import { KairoRuntime } from "../../minecraft/KairoRuntime";
import { AddonActivateAfterEvent } from "../events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/classes/AddonDeactivateBeforeEvent";
import { EventRegistry } from "../events/EventRegistry";
import { KairoContext, type KairoContextMutator } from "../KairoContext";
import type { ReadyState } from "../ReadyState";
import { ActivationRequestListener } from "./ActivationRequestListener";
import { ActivationResponder } from "./ActivationResponder";
import { AddonActivationManager } from "./AddonActivationManager";
import { ActivationEventId } from "./constants/ActivationEventId";
import type { ActivationRequest } from "./request/schema";
import type { ActivationResult } from "./result/schema";

export class ActivationController {
    private readonly activationManager = new AddonActivationManager();
    private readonly activationRequestListener: ActivationRequestListener;
    private readonly activationResponder = new ActivationResponder();

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly readyState: ReadyState,
        private readonly eventRegistry: EventRegistry<KairoEventMap>,
        private readonly lifecycle: {
            onActivate: () => void;
            onDeactivate: () => void;
        },
    ) {
        this.activationRequestListener = new ActivationRequestListener(readyState, {
            [this.context.kairoId + ":" + ActivationEventId.ActivationRequest]:
                this.handleActivationRequest,
        });
    }

    setup(): void {
        this.activationRequestListener.setup(this.runtime);
    }

    standaloneActivate(): void {
        this.contextMutator.setActivationState("active");
        this.lifecycle.onActivate();
        this.eventRegistry.emit("after", "addonActivate", new AddonActivateAfterEvent());
    }

    handleActivationRequest = (message: string): void => {
        const currentTick = this.runtime.currentTick();
        const request = this.activationManager.resolveRequest(message, currentTick, this.context);
        const result = this.apply(request);

        this.activationResponder.respond(result, this.runtime);
    };

    private apply(request: ActivationRequest): ActivationResult {
        const next = request.action === "activate" ? "active" : "inactive";

        // beforeEvents
        if (next === "inactive") {
            this.eventRegistry.emit("before", "addonDeactivate", new AddonDeactivateBeforeEvent());
        }

        this.contextMutator.setActivationState(next);

        // afterEvents
        if (next === "active") {
            this.lifecycle.onActivate();
            this.eventRegistry.emit("after", "addonActivate", new AddonActivateAfterEvent());
        } else {
            this.lifecycle.onDeactivate();
            this.eventRegistry.clearActiveScopedListeners();
        }

        return {
            kairoId: this.context.kairoId,
            status: "success",
            action: request.action,
        };
    }
}
