import { world } from "@minecraft/server";
import { AddonProperties } from "../../../types/AddonProperties";
import { ProvideKairoIdError, ProvideKairoIdErrorReason } from "./idProvider/errors";
import { DiscoveryQuery } from "./query/schema";

// kjs-router-ch 0104
export class KairoIdProvider {
    private CHARSET =
        "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "?_-().";
    private PREFIX_LENGTH = 8;
    private ID_LENGTH = 16;

    public constructor() {}

    public provideId(properties: AddonProperties, query: DiscoveryQuery): string {
        const objective = world.scoreboard.getObjective(query.scoreboard.objective.id);

        if (!objective) {
            throw new ProvideKairoIdError(ProvideKairoIdErrorReason.ObjectiveNotFound);
        }

        const prefix = this.hash(properties.id);

        let addonId: string;
        let attempts = 0;

        do {
            addonId = `${prefix}-${this.generateId()}`;
            attempts++;

            if (attempts > 100) {
                throw new ProvideKairoIdError(ProvideKairoIdErrorReason.IdGenerationFailed);
            }
        } while (objective.hasParticipant(addonId));

        objective.setScore(addonId, 0);

        return addonId;
    }

    private generateId(length: number = this.ID_LENGTH): string {
        const chars = this.CHARSET;
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars[(Math.random() * chars.length) | 0];
        }

        return result;
    }

    private hash(input: string): string {
        let hash = 2166136261;

        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }

        return (hash >>> 0).toString(36).padStart(this.PREFIX_LENGTH, "0");
    }
}
