export class DiscoveryResponseError extends Error {
    public readonly reason: DiscoveryResponseErrorReason;
    public readonly cause?: Error;

    constructor(reason: DiscoveryResponseErrorReason, options: { cause?: Error }) {
        super(
            DEFAULT_MESSAGES[reason] +
                (options.cause ? `\nOriginal error: ${options.cause.message}` : ""),
        );

        this.name = "DiscoveryResponseError";
        this.reason = reason;
        this.cause = options.cause;
    }
}

export enum DiscoveryResponseErrorReason {
    StringifyFailed = "StringifyFailed",
}

const DEFAULT_MESSAGES: Record<DiscoveryResponseErrorReason, string> = {
    [DiscoveryResponseErrorReason.StringifyFailed]: "Failed to stringify discovery response.",
};
