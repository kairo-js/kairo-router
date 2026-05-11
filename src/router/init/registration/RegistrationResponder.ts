import { toError } from "@kairo-js/utils";
import { KairoRuntime } from "../../../minecraft/KairoRuntime";
import type { KairoRegistry } from "../../types/KairoRegistry";
import { KairoInitEventId } from "../KairoInitEventId";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import type { RegistrationResponse } from "./response/schema";
import { stringifyRegistrationResponse } from "./response/stringify";

// kjs-router-ch 0203
export class RegistrationResponder {
    constructor() {}

    respond(runtime: KairoRuntime, kairoRegistry: KairoRegistry): void {
        const response: RegistrationResponse = {
            kairoRegistry,
            timestamp: runtime.currentTick(),
        };

        try {
            const responseStr = stringifyRegistrationResponse(response);

            runtime.send(KairoInitEventId.RegistrationResponse, responseStr);
        } catch (e: unknown) {
            throw new RegistrationResponseError(RegistrationResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
