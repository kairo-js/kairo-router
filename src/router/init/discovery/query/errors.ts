export class DiscoveryQueryParseError extends Error {
    public readonly reason: DiscoveryQueryParseErrorReason;

    constructor(reason: DiscoveryQueryParseErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

        this.name = "DiscoveryQueryParseError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
    Timeout = "Timeout",
}

const DEFAULT_MESSAGES: Record<DiscoveryQueryParseErrorReason, string> = {
    [DiscoveryQueryParseErrorReason.InvalidJSON]: "Failed to parse DiscoveryQuery JSON.",
    [DiscoveryQueryParseErrorReason.InvalidStructure]: "Invalid DiscoveryQuery structure.",
    [DiscoveryQueryParseErrorReason.Timeout]: "DiscoveryQuery has timed out.",
};
