export class KairoContextError extends Error {
    public readonly reason: KairoContextErrorReason;
    public readonly cause?: Error;
    constructor(reason: KairoContextErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "KairoContextError";
        this.reason = reason;
    }
}

export enum KairoContextErrorReason {
    KairoIdNotSet = "KairoIdNotSet",
    KairoIdAlreadySet = "KairoIdAlreadySet",
    RegistryNotCompleted = "RegistryNotCompleted",
    RegistryAlreadyCompleted = "RegistryAlreadyCompleted",
}

const DEFAULT_MESSAGES: Record<KairoContextErrorReason, string> = {
    [KairoContextErrorReason.KairoIdNotSet]: "kairo: kairoId not set.",
    [KairoContextErrorReason.KairoIdAlreadySet]: "kairo: kairoId is already set.",
    [KairoContextErrorReason.RegistryNotCompleted]: "kairo: Registry not completed.",
    [KairoContextErrorReason.RegistryAlreadyCompleted]: "kairo: Registry is already completed.",
};
