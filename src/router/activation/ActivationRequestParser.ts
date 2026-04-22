import { safeJsonParse } from "../../utils/jsonParse";
import { toError } from "../../utils/toError";
import { ActivationRequestParseError, ActivationRequestParseErrorReason } from "./request/errors";
import { ActivationRequest } from "./request/schema";
import { validateActivationRequest } from "./request/validate";

export class ActivationRequestParser {
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

        return request;
    }
}
