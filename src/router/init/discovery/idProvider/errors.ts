export class ProvideKairoIdError extends Error {
    public readonly reason: ProvideKairoIdErrorReason;

    constructor(reason: ProvideKairoIdErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "ProvideKairoIdError";
        this.reason = reason;
    }
}

export enum ProvideKairoIdErrorReason {
    IdGenerationFailed = "IdGenerationFailed",
}

const DEFAULT_MESSAGES: Record<ProvideKairoIdErrorReason, string> = {
    [ProvideKairoIdErrorReason.IdGenerationFailed]: "Failed to generate a unique addon ID.",
};
