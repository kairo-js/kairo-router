import { system } from "@minecraft/server";
import { TimestampValidator } from "../../../utils/TimestampValidator";
import {
    RegistrationRequestParseError,
    RegistrationRequestParseErrorReason,
} from "./request/errors";
import { RegistrationRequest } from "./request/types";
import { validateRegistrationRequest } from "./request/validate";

export class RegistrationRequestParser {
    private readonly TIMEOUT_TICKS = 10;
    public constructor() {}

    public parse(message: string): RegistrationRequest {
        const parsed = this.parseJson(message);

        if (!validateRegistrationRequest(parsed)) {
            throw new RegistrationRequestParseError(
                RegistrationRequestParseErrorReason.InvalidStructure,
            );
        }

        const query = parsed;

        if (TimestampValidator.isExpired(system.currentTick, query.timestamp, this.TIMEOUT_TICKS)) {
            throw new RegistrationRequestParseError(RegistrationRequestParseErrorReason.Timeout);
        }

        if (TimestampValidator.isFuture(system.currentTick, query.timestamp)) {
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
