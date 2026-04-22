export class ActivationRequestError extends Error {
    public readonly reason: ActivationRequestErrorReason;
    public readonly cause?: Error;

    constructor(reason: ActivationRequestErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });
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

const DEFAULT_MESSAGES: Record<ActivationRequestErrorReason, string> = {
    [ActivationRequestErrorReason.Timeout]: "ActivationRequest has timed out.",
    [ActivationRequestErrorReason.FutureTimestamp]: "ActivationRequest timestamp is in the future.",
    [ActivationRequestErrorReason.AlreadyActivated]: "Addon is already activated.",
    [ActivationRequestErrorReason.AlreadyDeactivated]: "Addon is already deactivated.",
};
