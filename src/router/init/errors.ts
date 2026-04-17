export class KairoRouterInitError extends Error {
    public readonly reason: KairoRouterInitErrorReason;
    public readonly cause?: Error;

    constructor(reason: KairoRouterInitErrorReason, options: { cause?: Error } = {}) {
        super(DEFAULT_MESSAGES[reason], { cause: options.cause });

        this.name = "KairoRouterInitError";
        this.reason = reason;
    }
}

export enum KairoRouterInitErrorReason {
    NotInitialized = "NotInitialized",
    AlreadyInitialized = "AlreadyInitialized",
    RegistrationRejected = "RegistrationRejected",
    RegistrationRequestNotFound = "RegistrationRequestNotFound",
}

const DEFAULT_MESSAGES: Record<KairoRouterInitErrorReason, string> = {
    [KairoRouterInitErrorReason.NotInitialized]:
        "Kairo router is not initialized. Call init() first.",
    [KairoRouterInitErrorReason.AlreadyInitialized]: "Kairo router has already been initialized.",
    [KairoRouterInitErrorReason.RegistrationRejected]: "Addon registration was rejected.",
    [KairoRouterInitErrorReason.RegistrationRequestNotFound]: "Registration request not found.",
};
