import { AddonActivateAfterEvent } from "../events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/classes/AddonDeactivateBeforeEvent";
import { EventRegistry } from "../events/EventRegistry";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { KairoEventMap } from "../types/KairoEventMap";
import { KairoRuntime } from "../types/KairoRuntime";
import { ActivationResponder } from "./ActivationResponder";
import { AddonActivationManager } from "./AddonActivationManager";
import { ActivationRequest } from "./request/schema";
import { ActivationResult } from "./result/schema";

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
        const result = this.apply(request, currentTick);

        this.activationResponder.respond(result, deps.runtime);
    };

    private apply(request: ActivationRequest, tick: number): ActivationResult {
        const next = request.type === "activate" ? "active" : "inactive";

        // beforeEvents
        if (next === "inactive") {
            this.eventRegistry.emitBefore("addonDeactivate", new AddonDeactivateBeforeEvent());
        }

        this.contextMutator.setActivationState(next, tick);

        // afterEvents
        if (next === "active") {
            this.lifecycle.onActivate();
            this.eventRegistry.emitAfter("addonActivate", new AddonActivateAfterEvent());
        } else {
            this.lifecycle.onDeactivate();
        }

        return {
            success: true,
            action: request.type,
        };
    }
}
