export class RegistrationRequestParseError extends Error {
    public readonly reason: RegistrationRequestParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationRequestParseErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "RegistrationRequestParseError";
        this.reason = reason;
    }
}

export enum RegistrationRequestParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const DEFAULT_MESSAGES: Record<RegistrationRequestParseErrorReason, string> = {
    [RegistrationRequestParseErrorReason.InvalidJSON]: "Failed to parse RegistrationRequest JSON.",
    [RegistrationRequestParseErrorReason.InvalidStructure]:
        "Invalid RegistrationRequest structure.",
};
