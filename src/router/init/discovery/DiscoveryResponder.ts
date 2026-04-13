import { system } from "@minecraft/server";
import { toError } from "../../../utils/toError";
import { KairoInitEventId } from "../types";
import { DiscoveryResponseError, DiscoveryResponseErrorReason } from "./response/errors";
import { DiscoveryResponse } from "./response/schema";
import { stringifyDiscoveryResponse } from "./response/stringify";

// kjs-router-ch 0103
export class DiscoveryResponder {
    public constructor() {}

    public respond(kairoId: string): void {
        const response: DiscoveryResponse = {
            kairoId,
            timestamp: system.currentTick,
        };

        try {
            const responseStr = stringifyDiscoveryResponse(response);

            system.sendScriptEvent(KairoInitEventId.DiscoveryResponse, responseStr);
        } catch (e: unknown) {
            throw new DiscoveryResponseError(DiscoveryResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
