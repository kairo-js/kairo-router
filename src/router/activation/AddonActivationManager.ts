import { ActivationRequestParser } from "./ActivationRequestParser";
import { ActivationRequestValidator } from "./ActivationRequestValidator";
import { ActivationRequest } from "./request/schema";

type ActivationState = "active" | "inactive";

export class AddonActivationManager {
    private readonly parser = new ActivationRequestParser();
    private readonly validator = new ActivationRequestValidator();

    private state: ActivationState = "inactive";
    private activationTick = 0;

    resolveRequest(message: string, currentTick: number): ActivationRequest {
        const request = this.parser.parse(message, currentTick);
        this.validator.validateRequest(request, currentTick);
        return request;
    }

    apply(request: ActivationRequest, currentTick: number): void {
        if (request.type === "activate") {
            this.activate(currentTick);
        } else {
            this.deactivate();
        }
    }

    private activate(currentTick: number): void {
        if (this.state === "active") return;

        this.state = "active";
        this.activationTick = currentTick;
    }

    private deactivate(): void {
        if (this.state === "inactive") return;

        this.state = "inactive";
    }

    isActive(): boolean {
        return this.state === "active";
    }

    getCurrentTick(runtimeTick: number): number {
        return runtimeTick - this.activationTick;
    }
}
