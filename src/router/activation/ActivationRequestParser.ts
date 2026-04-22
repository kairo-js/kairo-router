import { safeJsonParse } from "../../utils/jsonParse";
import { validateTimestamp } from "../../utils/TimestampValidator";
import { toError } from "../../utils/toError";
import { ActivationRequestParseError, ActivationRequestParseErrorReason } from "./request/errors";
import { ActivationRequest } from "./request/schema";
import { validateActivationRequest } from "./request/validate";

export class ActivationRequestParser {
    private readonly TIMEOUT_TICKS = 10;

    parse(message: string, currentTick: number): ActivationRequest {
        const parsed = safeJsonParse(
            message,
            () => new ActivationRequestParseError(ActivationRequestParseErrorReason.InvalidJSON),
        );

        if (!validateActivationRequest(parsed)) {
            throw new ActivationRequestParseError(
                ActivationRequestParseErrorReason.InvalidStructure,
                {
                    cause: toError(validateActivationRequest.errors),
                },
            );
        }

        const request: ActivationRequest = parsed;

        validateTimestamp(
            currentTick,
            request.timestamp,
            this.TIMEOUT_TICKS,
            () => new ActivationRequestParseError(ActivationRequestParseErrorReason.Timeout),
            () =>
                new ActivationRequestParseError(ActivationRequestParseErrorReason.FutureTimestamp),
        );

        return request;
    }
}
