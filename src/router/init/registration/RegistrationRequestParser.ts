import { safeJsonParse } from "../../../utils/jsonParse";
import { toError } from "../../../utils/toError";
import {
    RegistrationRequestParseError,
    RegistrationRequestParseErrorReason,
} from "./request/errors";
import { RegistrationRequest } from "./request/schema";
import { validateRegistrationRequest } from "./request/validate";

export class RegistrationRequestParser {
    parse(message: string): RegistrationRequest {
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

        return request;
    }
}
