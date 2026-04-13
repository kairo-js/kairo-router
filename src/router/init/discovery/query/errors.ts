export class DiscoveryQueryParseError extends Error {
    public readonly reason: DiscoveryQueryParseErrorReason;

    constructor(reason: DiscoveryQueryParseErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "DiscoveryQueryParseError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const DEFAULT_MESSAGES: Record<DiscoveryQueryParseErrorReason, string> = {
    [DiscoveryQueryParseErrorReason.InvalidJSON]: "Failed to parse DiscoveryQuery JSON.",
    [DiscoveryQueryParseErrorReason.InvalidStructure]: "Invalid DiscoveryQuery structure.",
    [DiscoveryQueryParseErrorReason.Timeout]: "DiscoveryQuery has timed out.",
    [DiscoveryQueryParseErrorReason.FutureTimestamp]: "DiscoveryQuery timestamp is in the future.",
};
