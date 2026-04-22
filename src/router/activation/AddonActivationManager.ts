import { KairoContext, KairoContextMutator } from "../KairoContext";
import { ActivationRequestParser } from "./ActivationRequestParser";
import { ActivationRequestValidator } from "./ActivationRequestValidator";
import { ActivationRequest } from "./request/schema";
import { ActivationResult } from "./result/schema";

export class AddonActivationManager {
    private readonly parser = new ActivationRequestParser();
    private readonly validator = new ActivationRequestValidator();

    constructor() {}

    resolveRequest(message: string, currentTick: number, context: KairoContext): ActivationRequest {
        const request = this.parser.parse(message, currentTick);
        this.validator.validateRequest(request, currentTick, context.isActive());
        return request;
    }

    apply(
        request: ActivationRequest,
        currentTick: number,
        contextMutator: KairoContextMutator,
    ): ActivationResult {
        if (request.type === "activate") {
            contextMutator.setActivationState("active", currentTick);

            return {
                success: true,
                action: "activate",
            };
        }

        contextMutator.setActivationState("inactive", currentTick);

        return {
            success: true,
            action: "deactivate",
        };
    }
}
