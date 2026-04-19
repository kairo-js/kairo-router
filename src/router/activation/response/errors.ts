export class ActivationResponseError extends Error {
    public readonly reason: ActivationResponseErrorReason;
    public readonly cause?: Error;

    constructor(reason: ActivationResponseErrorReason, options: { cause?: Error }) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "ActivationResponseError";
        this.reason = reason;
    }
}

export enum ActivationResponseErrorReason {
    StringifyFailed = "StringifyFailed",
}

const DEFAULT_MESSAGES: Record<ActivationResponseErrorReason, string> = {
    [ActivationResponseErrorReason.StringifyFailed]: "Failed to stringify activation response.",
};
