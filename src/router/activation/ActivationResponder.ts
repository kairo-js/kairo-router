import { toError } from "@kairo-js/utils";
import { KairoRuntime } from "../../minecraft/KairoRuntime";
import { ActivationEventId } from "./constants/ActivationEventId";
import { ActivationResponseError, ActivationResponseErrorReason } from "./response/errors";
import type { ActivationResponse } from "./response/schema";
import { stringifyActivationResponse } from "./response/stringify";
import type { ActivationResult } from "./result/schema";

// kjs-router-ch 0103
export class ActivationResponder {
    public constructor() {}

    respond(result: ActivationResult, runtime: KairoRuntime): void {
        const response: ActivationResponse = {
            kairoId: result.kairoId,
            status: result.status,
            action: result.action,
            reason: result.reason,
            timestamp: runtime.currentTick(),
        };

        try {
            const responseStr = stringifyActivationResponse(response);

            runtime.send(ActivationEventId.ActivationResponse, responseStr);
        } catch (e: unknown) {
            throw new ActivationResponseError(ActivationResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
