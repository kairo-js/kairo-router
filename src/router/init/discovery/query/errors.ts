export class DiscoveryQueryParseError extends Error {
    public readonly reason: DiscoveryQueryParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: DiscoveryQueryParseErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "DiscoveryQueryParseError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const DEFAULT_MESSAGES: Record<DiscoveryQueryParseErrorReason, string> = {
    [DiscoveryQueryParseErrorReason.InvalidJSON]: "Failed to parse DiscoveryQuery JSON.",
    [DiscoveryQueryParseErrorReason.InvalidStructure]: "Invalid DiscoveryQuery structure.",
};
