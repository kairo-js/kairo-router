export class RegistrationResultParseError extends Error {
    public readonly reason: RegistrationResultParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationResultParseErrorReason, options: { cause?: Error } = {}) {
        super(RESULT_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "RegistrationResultParseError";
        this.reason = reason;
    }
}

export enum RegistrationResultParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const RESULT_PARSE_DEFAULT_MESSAGES: Record<RegistrationResultParseErrorReason, string> = {
    [RegistrationResultParseErrorReason.InvalidJSON]: "Failed to parse RegistrationResult JSON.",
    [RegistrationResultParseErrorReason.InvalidStructure]: "Invalid RegistrationResult structure.",
};

export class RegistrationResultError extends Error {
    public readonly reason: RegistrationResultErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationResultErrorReason, options: { cause?: Error } = {}) {
        super(RESULT_DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "RegistrationResultError";
        this.reason = reason;
    }
}

export enum RegistrationResultErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const RESULT_DEFAULT_MESSAGES: Record<RegistrationResultErrorReason, string> = {
    [RegistrationResultErrorReason.Timeout]: "RegistrationResult has timed out.",
    [RegistrationResultErrorReason.FutureTimestamp]:
        "RegistrationResult timestamp is in the future.",
};
