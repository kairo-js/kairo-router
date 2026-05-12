import { safeJsonParse, toError } from "@kairo-js/utils";
import { RegistrationResultParseError, RegistrationResultParseErrorReason } from "./result/errors";
import type { RegistrationResult } from "./result/schema";
import { validateRegistrationResult } from "./result/validate";

export class RegistrationResultParser {
    parse(message: string): RegistrationResult {
        const parsed = safeJsonParse(
            message,
            () => new RegistrationResultParseError(RegistrationResultParseErrorReason.InvalidJSON),
        );

        if (!validateRegistrationResult(parsed)) {
            throw new RegistrationResultParseError(
                RegistrationResultParseErrorReason.InvalidStructure,
                { cause: toError(validateRegistrationResult.errors) },
            );
        }

        const result: RegistrationResult = parsed;

        return result;
    }
}
