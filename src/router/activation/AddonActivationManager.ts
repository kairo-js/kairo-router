import { KairoContext } from "../KairoContext";
import { ActivationRequestParser } from "./ActivationRequestParser";
import { ActivationRequestValidator } from "./ActivationRequestValidator";
import { ActivationRequest } from "./request/schema";

export class AddonActivationManager {
    private readonly parser = new ActivationRequestParser();
    private readonly validator = new ActivationRequestValidator();

    resolveRequest(message: string, currentTick: number, context: KairoContext): ActivationRequest {
        const request = this.parser.parse(message, currentTick);
        this.validator.validateRequest(request, currentTick, context.isActive());
        return request;
    }
}
