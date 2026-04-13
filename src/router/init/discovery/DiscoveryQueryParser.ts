import { system } from "@minecraft/server";
import { TimestampValidator } from "../../../utils/TimestampValidator";
import { toError } from "../../../utils/toError";
import { DiscoveryQueryParseError, DiscoveryQueryParseErrorReason } from "./query/errors";
import { DiscoveryQuery } from "./query/schema";
import { validateDiscoveryQuery } from "./query/validate";

// kjs-router-ch 0102
export class DiscoveryQueryParser {
    private readonly TIMEOUT_TICKS = 10;

    public constructor() {}

    public parse(message: string): DiscoveryQuery {
        const parsed = this.parseJson(message);

        if (!validateDiscoveryQuery(parsed)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure, {
                cause: toError(validateDiscoveryQuery.errors),
            });
        }

        const query = parsed;

        if (TimestampValidator.isExpired(system.currentTick, query.timestamp, this.TIMEOUT_TICKS)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.Timeout);
        }

        if (TimestampValidator.isFuture(system.currentTick, query.timestamp)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.FutureTimestamp);
        }

        return query;
    }

    private parseJson(message: string): unknown {
        try {
            return JSON.parse(message);
        } catch {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidJSON);
        }
    }
}
