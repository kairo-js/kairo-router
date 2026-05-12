export class RegistrationRequestParseError extends Error {
    public readonly reason: RegistrationRequestParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationRequestParseErrorReason, options: { cause?: Error } = {}) {
        super(REQUEST_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "RegistrationRequestParseError";
        this.reason = reason;
    }
}

export enum RegistrationRequestParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const REQUEST_PARSE_DEFAULT_MESSAGES: Record<RegistrationRequestParseErrorReason, string> = {
    [RegistrationRequestParseErrorReason.InvalidJSON]: "Failed to parse RegistrationRequest JSON.",
    [RegistrationRequestParseErrorReason.InvalidStructure]:
        "Invalid RegistrationRequest structure.",
};

export class RegistrationRequestError extends Error {
    public readonly reason: RegistrationRequestErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationRequestErrorReason, options: { cause?: Error } = {}) {
        super(REQUEST_DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "RegistrationRequestError";
        this.reason = reason;
    }
}

export enum RegistrationRequestErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const REQUEST_DEFAULT_MESSAGES: Record<RegistrationRequestErrorReason, string> = {
    [RegistrationRequestErrorReason.Timeout]: "RegistrationRequest has timed out.",
    [RegistrationRequestErrorReason.FutureTimestamp]:
        "RegistrationRequest timestamp is in the future.",
};
