export class ProvideAddonIdError extends Error {
    public readonly reason: ProvideAddonIdErrorReason;

    constructor(reason: ProvideAddonIdErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

        this.name = "ProvideAddonIdError";
        this.reason = reason;
    }
}

export enum ProvideAddonIdErrorReason {
    ObjectiveNotFound = "ObjectiveNotFound",
    IdGenerationFailed = "IdGenerationFailed",
}

const DEFAULT_MESSAGES: Record<ProvideAddonIdErrorReason, string> = {
    [ProvideAddonIdErrorReason.ObjectiveNotFound]: "Scoreboard objective not found.",
    [ProvideAddonIdErrorReason.IdGenerationFailed]: "Failed to generate a unique addon ID.",
};
