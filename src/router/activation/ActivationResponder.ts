import { toError } from "../../utils/toError";
import { KairoEventId } from "../KairoEventId";
import { KairoRuntime } from "../types/KairoRuntime";
import { ActivationResponseError, ActivationResponseErrorReason } from "./response/errors";
import { ActivationResponse } from "./response/schema";
import { stringifyActivationResponse } from "./response/stringify";

// kjs-router-ch 0103
export class ActivationResponder {
    public constructor() {}

    respond(runtime: KairoRuntime): void {
        const response: ActivationResponse = {
            timestamp: runtime.currentTick(),
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
