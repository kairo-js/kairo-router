import { validateTimestamp } from "@kairo-js/utils";
import { ActivationRequestError, ActivationRequestErrorReason } from "./request/errors";
import type { ActivationRequest } from "./request/schema";

export class ActivationRequestValidator {
    private readonly TIMEOUT_TICKS = 10;

    validateRequest(request: ActivationRequest, currentTick: number, isActive: boolean): void {
        this.validateTimestamp(request, currentTick);
        this.validateState(request, isActive);
    }

    private validateTimestamp(request: ActivationRequest, currentTick: number): void {
        validateTimestamp(
            currentTick,
            request.timestamp,
            this.TIMEOUT_TICKS,
            () => new ActivationRequestError(ActivationRequestErrorReason.Timeout),
            () => new ActivationRequestError(ActivationRequestErrorReason.FutureTimestamp),
        );
    }

    private validateState(request: ActivationRequest, isActive: boolean): void {
        if (request.action === "activate") {
            if (isActive) {
                throw new ActivationRequestError(ActivationRequestErrorReason.AlreadyActivated);
            }
            return;
        }

        if (!isActive) {
            throw new ActivationRequestError(ActivationRequestErrorReason.AlreadyDeactivated);
        }
    }
}
