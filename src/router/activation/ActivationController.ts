import { KairoRuntime } from "../../minecraft/KairoRuntime";
import { AddonActivateAfterEvent } from "../events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/classes/AddonDeactivateBeforeEvent";
import { EventRegistry } from "../events/EventRegistry";
import type { KairoEventMap } from "../events/types/KairoEventMap";
import { KairoContext, type KairoContextMutator } from "../KairoContext";
import { ActivationResponder } from "./ActivationResponder";
import { AddonActivationManager } from "./AddonActivationManager";
import type { ActivationRequest } from "./request/schema";
import type { ActivationResult } from "./result/schema";

export class ActivationController {
    private readonly activationManager = new AddonActivationManager();
    private readonly activationResponder = new ActivationResponder();

    constructor(
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly eventRegistry: EventRegistry<KairoEventMap>,
        private readonly lifecycle: {
            onActivate: () => void;
            onDeactivate: () => void;
        },
    ) {}

    handleActivationRequest = (message: string, deps: { runtime: KairoRuntime }): void => {
        const currentTick = deps.runtime.currentTick();
        const request = this.activationManager.resolveRequest(message, currentTick, this.context);
        const result = this.apply(request);

        this.activationResponder.respond(result, deps.runtime);
    };

    private apply(request: ActivationRequest): ActivationResult {
        const next = request.type === "activate" ? "active" : "inactive";

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
            success: true,
            action: request.type,
        };
    }
}
