export class KairoRouterError extends Error {
    public readonly reason: KairoRouterErrorReason;
    public readonly cause?: Error;

    constructor(reason: KairoRouterErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });
        this.name = "KairoRouterError";
        this.reason = reason;
    }
}

export enum KairoRouterErrorReason {
    Inactive = "Inactive",
}

const DEFAULT_MESSAGES: Record<KairoRouterErrorReason, string> = {
    [KairoRouterErrorReason.Inactive]: "KairoRouter is inactive.",
};
