import { safeJsonParse } from "../../../utils/jsonParse";
import { validateTimestamp } from "../../../utils/TimestampValidator";
import { toError } from "../../../utils/toError";
import {
    RegistrationRequestParseError,
    RegistrationRequestParseErrorReason,
} from "./request/errors";
import { RegistrationRequest } from "./request/schema";
import { validateRegistrationRequest } from "./request/validate";

export class RegistrationRequestParser {
    private readonly TIMEOUT_TICKS = 10;

    parse(message: string, currentTick: number): RegistrationRequest {
        const parsed = safeJsonParse(
            message,
            () =>
                new RegistrationRequestParseError(RegistrationRequestParseErrorReason.InvalidJSON),
        );

        if (!validateRegistrationRequest(parsed)) {
            throw new RegistrationRequestParseError(
                RegistrationRequestParseErrorReason.InvalidStructure,
                { cause: toError(validateRegistrationRequest.errors) },
            );
        }

        const request: RegistrationRequest = parsed;

        validateTimestamp(
            currentTick,
            request.timestamp,
            this.TIMEOUT_TICKS,
            () => new RegistrationRequestParseError(RegistrationRequestParseErrorReason.Timeout),
            () =>
                new RegistrationRequestParseError(
                    RegistrationRequestParseErrorReason.FutureTimestamp,
                ),
        );

        return request;
    }
}
