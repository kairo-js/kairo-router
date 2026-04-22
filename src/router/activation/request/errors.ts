export class ActivationRequestParseError extends Error {
    public readonly reason: ActivationRequestParseErrorReason;
    public readonly cause?: Error;

    constructor(reason: ActivationRequestParseErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "ActivationRequestParseError";
        this.reason = reason;
    }
}

export enum ActivationRequestParseErrorReason {
    InvalidJSON = "InvalidJSON",
    InvalidStructure = "InvalidStructure",
}

const DEFAULT_MESSAGES: Record<ActivationRequestParseErrorReason, string> = {
    [ActivationRequestParseErrorReason.InvalidJSON]: "Failed to parse ActivationRequest JSON.",
    [ActivationRequestParseErrorReason.InvalidStructure]: "Invalid ActivationRequest structure.",
};
