export class DiscoveryQueryParseError extends Error {
    public readonly reason: DiscoveryQueryParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: DiscoveryQueryParseErrorReason, options: { cause?: Error } = {}) {
        super(QUERY_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "DiscoveryQueryParseError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const QUERY_PARSE_DEFAULT_MESSAGES: Record<DiscoveryQueryParseErrorReason, string> = {
    [DiscoveryQueryParseErrorReason.InvalidJSON]: "Failed to parse DiscoveryQuery JSON.",
    [DiscoveryQueryParseErrorReason.InvalidStructure]: "Invalid DiscoveryQuery structure.",
};

export class DiscoveryQueryError extends Error {
    public readonly reason: DiscoveryQueryErrorReason;
    public readonly cause?: Error;

    constructor(reason: DiscoveryQueryErrorReason, options: { cause?: Error } = {}) {
        super(QUERY_DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "DiscoveryQueryError";
        this.reason = reason;
    }
}

export enum DiscoveryQueryErrorReason {
    Timeout = "Timeout",
    FutureTimestamp = "FutureTimestamp",
}

const QUERY_DEFAULT_MESSAGES: Record<DiscoveryQueryErrorReason, string> = {
    [DiscoveryQueryErrorReason.Timeout]: "DiscoveryQuery has timed out.",
    [DiscoveryQueryErrorReason.FutureTimestamp]: "DiscoveryQuery timestamp is in the future.",
};
