export class RegistrationResponseError extends Error {
    public readonly reason: RegistrationResponseErrorReason;

    constructor(reason: RegistrationResponseErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

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
