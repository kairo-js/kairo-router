export class RegistrationResponseError extends Error {
    public readonly reason: RegistrationResponseErrorReason;
    public readonly cause?: Error;

    constructor(reason: RegistrationResponseErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "RegistrationResponseError";
        this.reason = reason;
    }
}

export enum RegistrationResponseErrorReason {
    StringifyFailed = "StringifyFailed",
}

const DEFAULT_MESSAGES: Record<RegistrationResponseErrorReason, string> = {
    [RegistrationResponseErrorReason.StringifyFailed]: "Failed to stringify registration response.",
};
