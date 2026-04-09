export class RegistrationRequestParseError extends Error {
    public readonly reason: RegistrationRequestParseErrorReason;

    constructor(reason: RegistrationRequestParseErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

        this.name = "RegistrationRequestParseError";
        this.reason = reason;
    }
}

export enum RegistrationRequestParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const DEFAULT_MESSAGES: Record<RegistrationRequestParseErrorReason, string> = {
    [RegistrationRequestParseErrorReason.InvalidJSON]: "Failed to parse RegistrationRequest JSON.",
    [RegistrationRequestParseErrorReason.InvalidStructure]:
        "Invalid RegistrationRequest structure.",
    [RegistrationRequestParseErrorReason.Timeout]: "RegistrationRequest has timed out.",
    [RegistrationRequestParseErrorReason.FutureTimestamp]:
        "RegistrationRequest timestamp is in the future.",
};
