import { validateTimestamp } from "@kairo-js/utils";
import { RegistrationResultError, RegistrationResultErrorReason } from "./result/errors";
import type { RegistrationResult } from "./result/schema";

export class RegistrationResultValidator {
    private readonly TIMEOUT_TICKS = 10;

    validateRequest(result: RegistrationResult, currentTick: number): void {
        this.validateTimestamp(result, currentTick);
    }

    private validateTimestamp(result: RegistrationResult, currentTick: number): void {
        validateTimestamp(
            currentTick,
            result.timestamp,
            this.TIMEOUT_TICKS,
            () => new RegistrationResultError(RegistrationResultErrorReason.Timeout),
            () => new RegistrationResultError(RegistrationResultErrorReason.FutureTimestamp),
        );
    }
}
