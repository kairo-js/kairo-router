import {
    DiscoveryQueryParseError,
    DiscoveryQueryParseErrorReason,
} from "../../errors/DiscoveryQueryParserError";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./DiscoveryQuery";

// kjs-router-ch 005
export class DiscoveryQueryParser {
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
        if (!this.validateQuery(query)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }
    }

    private validateQuery(query: unknown): boolean {
        if (typeof query !== "object" || query === null) return false;

        const q = query as any;

        if (typeof q.scoreboard !== "object" || q.scoreboard === null) return false;
        if (typeof q.scoreboard.objective !== "object" || q.scoreboard.objective === null)
            return false;

        const objective = q.scoreboard.objective;

        return typeof objective.id === "string" && objective.displayName === "kairo:id_checker";
    }
}
