import { toError } from "../../../utils/toError";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoInitEventId } from "../KairoInitEventId";
import { DiscoveryResponseError, DiscoveryResponseErrorReason } from "./response/errors";
import { DiscoveryResponse } from "./response/schema";
import { stringifyDiscoveryResponse } from "./response/stringify";

// kjs-router-ch 0103
export class DiscoveryResponder {
    public constructor() {}

    respond(runtime: KairoRuntime, kairoId: string): void {
        const response: DiscoveryResponse = {
            kairoId,
            timestamp: runtime.currentTick(),
        };

        try {
            const responseStr = stringifyDiscoveryResponse(response);

            runtime.send(KairoInitEventId.DiscoveryResponse, responseStr);
        } catch (e: unknown) {
            throw new DiscoveryResponseError(DiscoveryResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
