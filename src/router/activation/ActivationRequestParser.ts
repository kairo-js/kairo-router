import { safeJsonParse, toError } from "@kairo-js/utils";
import { ActivationRequestParseError, ActivationRequestParseErrorReason } from "./request/errors";
import type { ActivationRequest } from "./request/schema";
import { validateActivationRequest } from "./request/validate";

export class ActivationRequestParser {
    parse(message: string): ActivationRequest {
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
