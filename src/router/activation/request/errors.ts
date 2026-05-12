export class ActivationRequestParseError extends Error {
    public readonly reason: ActivationRequestParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: ActivationRequestParseErrorReason, options: { cause?: Error } = {}) {
        super(REQUEST_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "ActivationRequestParseError";
        this.reason = reason;
    }
}

export enum ActivationRequestParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const REQUEST_PARSE_DEFAULT_MESSAGES: Record<ActivationRequestParseErrorReason, string> = {
    [ActivationRequestParseErrorReason.InvalidJSON]: "Failed to parse ActivationRequest JSON.",
    [ActivationRequestParseErrorReason.InvalidStructure]: "Invalid ActivationRequest structure.",
};

export class ActivationRequestError extends Error {
    public readonly reason: ActivationRequestErrorReason;
    public readonly cause?: Error;

    constructor(reason: ActivationRequestErrorReason, options: { cause?: Error } = {}) {
        super(REQUEST_DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "ActivationRequestError";
        this.reason = reason;
    }
}

export enum ActivationRequestErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
    AlreadyActivated = "AlreadyActivated",
    AlreadyDeactivated = "AlreadyDeactivated",
}

const REQUEST_DEFAULT_MESSAGES: Record<ActivationRequestErrorReason, string> = {
    [ActivationRequestErrorReason.Timeout]: "ActivationRequest has timed out.",
    [ActivationRequestErrorReason.FutureTimestamp]: "ActivationRequest timestamp is in the future.",
    [ActivationRequestErrorReason.AlreadyActivated]: "Addon is already activated.",
    [ActivationRequestErrorReason.AlreadyDeactivated]: "Addon is already deactivated.",
};
