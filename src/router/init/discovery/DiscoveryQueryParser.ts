import { safeJsonParse } from "../../../utils/jsonParse";
import { validateTimestamp } from "../../../utils/TimestampValidator";
import { toError } from "../../../utils/toError";
import { DiscoveryQueryParseError, DiscoveryQueryParseErrorReason } from "./query/errors";
import { DiscoveryQuery } from "./query/schema";
import { validateDiscoveryQuery } from "./query/validate";

// kjs-router-ch 0102
export class DiscoveryQueryParser {
    private readonly TIMEOUT_TICKS = 10;

    constructor() {}

    parse(message: string, currentTick: number): DiscoveryQuery {
        const parsed = safeJsonParse(
            message,
            () => new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidJSON),
        );

        if (!validateDiscoveryQuery(parsed)) {
            throw new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.InvalidStructure, {
                cause: toError(validateDiscoveryQuery.errors),
            });
        }

        const query: DiscoveryQuery = parsed;

        validateTimestamp(
            currentTick,
            query.timestamp,
            this.TIMEOUT_TICKS,
            () => new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.Timeout),
            () => new DiscoveryQueryParseError(DiscoveryQueryParseErrorReason.FutureTimestamp),
        );

        return query;
    }
}
