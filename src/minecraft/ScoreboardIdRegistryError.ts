export class ScoreboardIdRegistryError extends Error {
    public readonly reason: ScoreboardIdRegistryErrorReason;
    public readonly cause?: Error;

    constructor(reason: ScoreboardIdRegistryErrorReason, options: { cause?: Error }) {
        super(DEFAULT_MESSAGE[reason]);
        this.name = "ScoreboardIdRegistryError";
        this.reason = reason;
        this.cause = options.cause;
    }
}

export enum ScoreboardIdRegistryErrorReason {
    ObjectiveNotFound = "ObjectiveNotFound",
}

const DEFAULT_MESSAGE: Record<ScoreboardIdRegistryErrorReason, string> = {
    [ScoreboardIdRegistryErrorReason.ObjectiveNotFound]:
        "The specified scoreboard objective was not found.",
};
