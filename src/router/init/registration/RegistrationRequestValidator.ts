import { validateTimestamp } from "../../../utils/validateTimestamp";
import { RegistrationRequestError, RegistrationRequestErrorReason } from "./errors";
import { RegistrationRequest } from "./request/schema";

export class RegistrationRequestValidator {
    private readonly TIMEOUT_TICKS = 10;

    validateRequest(request: RegistrationRequest, currentTick: number): void {
        this.validateTimestamp(request, currentTick);
    }

    private validateTimestamp(request: RegistrationRequest, currentTick: number): void {
        validateTimestamp(
            currentTick,
            request.timestamp,
            this.TIMEOUT_TICKS,
            () => new RegistrationRequestError(RegistrationRequestErrorReason.Timeout),
            () => new RegistrationRequestError(RegistrationRequestErrorReason.FutureTimestamp),
        );
    }
}
