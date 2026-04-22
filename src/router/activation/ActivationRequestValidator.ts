import { validateTimestamp } from "../../utils/validateTimestamp";
import { ActivationRequestError, ActivationRequestErrorReason } from "./errors";
import { ActivationRequest } from "./request/schema";

export class ActivationRequestValidator {
    private readonly TIMEOUT_TICKS = 10;

    validateRequest(request: ActivationRequest, currentTick: number): void {
        this.validateTimestamp(request, currentTick);
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
}
