import { KairoContext, KairoContextMutator } from "../KairoContext";
import { KairoRuntime } from "../types/KairoRuntime";
import { ActivationResponder } from "./ActivationResponder";
import { AddonActivationManager } from "./AddonActivationManager";

export class ActivationController {
    private readonly activationManager: AddonActivationManager;
    private readonly activationResponder: ActivationResponder;
    constructor(
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
    ) {
        this.activationManager = new AddonActivationManager();
        this.activationResponder = new ActivationResponder();
    }

    handleActivationRequest = (message: string, deps: { runtime: KairoRuntime }): void => {
        const request = this.activationManager.resolveRequest(
            message,
            deps.runtime.currentTick(),
            this.context,
        );

        const result = this.activationManager.apply(
            request,
            deps.runtime.currentTick(),
            this.contextMutator,
        );
        this.activationResponder.respond(result, deps.runtime);
    };
}
