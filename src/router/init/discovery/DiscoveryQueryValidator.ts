import { validateTimestamp } from "@kairo-js/utils";
import { DiscoveryQueryError, DiscoveryQueryErrorReason } from "./query/errors";
import type { DiscoveryQuery } from "./query/schema";

export class DiscoveryQueryValidator {
    private readonly TIMEOUT_TICKS = 10;

    validateRequest(query: DiscoveryQuery, currentTick: number): void {
        this.validateTimestamp(query, currentTick);
    }

    private validateTimestamp(query: DiscoveryQuery, currentTick: number): void {
        validateTimestamp(
            currentTick,
            query.timestamp,
            this.TIMEOUT_TICKS,
            () => new DiscoveryQueryError(DiscoveryQueryErrorReason.Timeout),
            () => new DiscoveryQueryError(DiscoveryQueryErrorReason.FutureTimestamp),
        );
    }
}
