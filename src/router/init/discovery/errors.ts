export class DiscoveryQueryError extends Error {
    public readonly reason: DiscoveryQueryErrorReason;
    public readonly cause?: Error;

    constructor(reason: DiscoveryQueryErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "DiscoveryQueryError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const DEFAULT_MESSAGES: Record<DiscoveryQueryErrorReason, string> = {
    [DiscoveryQueryErrorReason.Timeout]: "DiscoveryQuery has timed out.",
    [DiscoveryQueryErrorReason.FutureTimestamp]: "DiscoveryQuery timestamp is in the future.",
};
