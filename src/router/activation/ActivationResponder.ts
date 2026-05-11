import { toError } from "@kairo-js/utils";
import { KairoRuntime } from "../../minecraft/KairoRuntime";
import { KairoEventId } from "../KairoEventId";
import { ActivationResponseError, ActivationResponseErrorReason } from "./response/errors";
import type { ActivationResponse } from "./response/schema";
import { stringifyActivationResponse } from "./response/stringify";
import type { ActivationResult } from "./result/schema";

// kjs-router-ch 0103
export class ActivationResponder {
    public constructor() {}

    respond(result: ActivationResult, runtime: KairoRuntime): void {
        const response: ActivationResponse = {
            timestamp: runtime.currentTick(),
            success: result.success,
            action: result.action,
        };

        try {
            const responseStr = stringifyActivationResponse(response);

            runtime.send(KairoEventId.ActivationResponse, responseStr);
        } catch (e: unknown) {
            throw new ActivationResponseError(ActivationResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
