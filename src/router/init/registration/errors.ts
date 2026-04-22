export class RegistrationRequestError extends Error {
    public readonly reason: RegistrationRequestErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationRequestErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "RegistrationRequestError";
        this.reason = reason;
    }
}

export enum RegistrationRequestErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const DEFAULT_MESSAGES: Record<RegistrationRequestErrorReason, string> = {
    [RegistrationRequestErrorReason.Timeout]: "RegistrationRequest has timed out.",
    [RegistrationRequestErrorReason.FutureTimestamp]:
        "RegistrationRequest timestamp is in the future.",
};
