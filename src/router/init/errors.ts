export class KairoRouterInitError extends Error {
    public readonly reason: KairoRouterInitErrorReason;
    constructor(reason: KairoRouterInitErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

        this.name = "KairoRouterInitError";
        this.reason = reason;
    }
}

export enum KairoRouterInitErrorReason {
    AlreadyInitialized = "AlreadyInitialized",
    RegistrationRejected = "RegistrationRejected",
    RegistrationRequestNotFound = "RegistrationRequestNotFound",
}

const DEFAULT_MESSAGES: Record<KairoRouterInitErrorReason, string> = {
    [KairoRouterInitErrorReason.AlreadyInitialized]: "Kairo router has already been initialized.",
    [KairoRouterInitErrorReason.RegistrationRejected]: "Addon registration was rejected.",
    [KairoRouterInitErrorReason.RegistrationRequestNotFound]: "Registration request not found.",
};
