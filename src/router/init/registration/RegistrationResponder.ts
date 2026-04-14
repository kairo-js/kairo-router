import { toError } from "../../../utils/toError";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoInitEventId } from "../KairoInitEventId";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import { RegistrationResponse } from "./response/schema";
import { stringifyRegistrationResponse } from "./response/stringify";

// kjs-router-ch 0203
export class RegistrationResponder {
    constructor(private readonly runtime: KairoRuntime) {}

    respond(kairoRegistry: KairoRegistry): void {
        const response: RegistrationResponse = {
            kairoRegistry,
            timestamp: this.runtime.currentTick(),
        };

        try {
            const responseStr = stringifyRegistrationResponse(response);

            this.runtime.send(KairoInitEventId.RegistrationResponse, responseStr);
        } catch (e: unknown) {
            throw new RegistrationResponseError(RegistrationResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
