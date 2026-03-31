export class DiscoveryProvideIdError extends Error {
    public readonly reason: DiscoveryProvideIdErrorReason;

    constructor(reason: DiscoveryProvideIdErrorReason) {
        super(DEFAULT_MESSAGES[reason]);

        this.name = "DiscoveryProvideIdError";
        this.reason = reason;
    }
}

export enum DiscoveryProvideIdErrorReason {
    ObjectiveNotFound = "ObjectiveNotFound",
    IdGenerationFailed = "IdGenerationFailed",
}

const DEFAULT_MESSAGES: Record<DiscoveryProvideIdErrorReason, string> = {
    [DiscoveryProvideIdErrorReason.ObjectiveNotFound]: "Scoreboard objective not found.",
    [DiscoveryProvideIdErrorReason.IdGenerationFailed]: "Failed to generate a unique addon ID.",
};
