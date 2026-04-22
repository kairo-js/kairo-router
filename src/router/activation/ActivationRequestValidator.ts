import { validateTimestamp } from "../../utils/validateTimestamp";
import { ActivationRequestError, ActivationRequestErrorReason } from "./errors";
import { ActivationRequest } from "./request/schema";

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
        if (request.type === "activate") {
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
