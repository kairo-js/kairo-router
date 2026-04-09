import { system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import {
    DiscoveryQueryParseError,
    DiscoveryQueryParseErrorReason,
} from "./query/errors/DiscoveryQueryParserError";
import type { DiscoveryQuery } from "./query/types";
import { validateDiscoveryQuery } from "./query/validate";

// kjs-router-ch 0102
export class DiscoveryQueryParser {
    private static readonly TIMEOUT_TICKS = 10;

    public constructor(manager: AddonDiscoveryManager) {}

    public parse(message: string): DiscoveryQuery {
        const parsed = this.parseJson(message);

        if (!validateDiscoveryQuery(parsed)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure);
        }

        const query = parsed;

        this.validateTimestamp(query);

        return query;
    }

    private parseJson(message: string): unknown {
        try {
            return JSON.parse(message);
        } catch {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidJSON);
        }
    }

    private validateTimestamp(query: DiscoveryQuery): void {
        const diff = system.currentTick - query.timestamp;

        if (diff < 0 || diff > DiscoveryQueryParser.TIMEOUT_TICKS) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.Timeout);
        }
    }
}
