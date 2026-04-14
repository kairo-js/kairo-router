import { TimestampValidator } from "../../../utils/TimestampValidator";
import { toError } from "../../../utils/toError";
import {
    RegistrationRequestParseError,
    RegistrationRequestParseErrorReason,
} from "./request/errors";
import { RegistrationRequest } from "./request/schema";
import { validateRegistrationRequest } from "./request/validate";

export class RegistrationRequestParser {
    private readonly TIMEOUT_TICKS = 10;
    constructor() {}

    parse(message: string, currentTick: number): RegistrationRequest {
        const parsed = this.parseJson(message);

        if (!validateRegistrationRequest(parsed)) {
            throw new RegistrationRequestParseError(
                RegistrationRequestParseErrorReason.InvalidStructure,
                { cause: toError(validateRegistrationRequest.errors) },
            );
        }

        const query = parsed;

        if (TimestampValidator.isExpired(currentTick, query.timestamp, this.TIMEOUT_TICKS)) {
            throw new RegistrationRequestParseError(RegistrationRequestParseErrorReason.Timeout);
        }

        if (TimestampValidator.isFuture(currentTick, query.timestamp)) {
            throw new RegistrationRequestParseError(
                RegistrationRequestParseErrorReason.FutureTimestamp,
            );
        }

        return query;
    }

    private parseJson(message: string): unknown {
        try {
            return JSON.parse(message);
        } catch {
            throw new RegistrationRequestParseError(
                RegistrationRequestParseErrorReason.InvalidJSON,
            );
        }
    }
}
