import { toError } from "../../utils/toError";
import { KairoEventId } from "../KairoEventId";
import { KairoRuntime } from "../types/KairoRuntime";
import { ActivationResponseError, ActivationResponseErrorReason } from "./response/errors";
import { ActivationResponse } from "./response/schema";
import { stringifyActivationResponse } from "./response/stringify";
import { ActivationResult } from "./result/schema";

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
