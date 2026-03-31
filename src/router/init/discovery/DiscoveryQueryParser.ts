import { system } from "@minecraft/server";
import {
    DiscoveryQueryParseError,
    DiscoveryQueryParseErrorReason,
} from "../../errors/DiscoveryQueryParserError";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./types/DiscoveryQuery";

// kjs-router-ch 005
export class DiscoveryQueryParser {
    private readonly TIMEOUT_TICKS = 10;

    public constructor(manager: AddonDiscoveryManager) {}

    public parse(message: string): DiscoveryQuery {
        let parsed: unknown;

        try {
            parsed = JSON.parse(message);
        } catch {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidJSON);
        }

        this.assertQuery(parsed);

        return parsed;
    }

    private assertQuery(query: unknown): asserts query is DiscoveryQuery {
        if (typeof query !== "object" || query === null) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }

        const q = query as any;

        if (typeof q.timestamp !== "number") {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }

        const currentTick = system.currentTick;
        const diff = currentTick - q.timestamp;

        if (diff < 0 || diff > this.TIMEOUT_TICKS) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.Timeout);
        }

        if (typeof q.scoreboard !== "object" || q.scoreboard === null) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }

        if (typeof q.scoreboard.objective !== "object" || q.scoreboard.objective === null) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }

        const objective = q.scoreboard.objective;

        if (typeof objective.id !== "string" || objective.displayName !== "kairo:id_checker") {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }
    }
}
