import { KairoRegistry } from "../../../types/KairoRegistry";
import { toError } from "../../../utils/toError";
import { KairoRuntime } from "../../KairoRuntime";
import { KairoInitEventId } from "../types";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import { RegistrationResponse } from "./response/schema";
import { stringifyRegistrationResponse } from "./response/stringify";

// kjs-router-ch 0203
export class RegistrationResponder {
    public constructor(private readonly runtime: KairoRuntime) {}

    public respond(kairoRegistry: KairoRegistry): void {
        const response: RegistrationResponse = {
            kairoRegistry,
            timestamp: this.runtime.currentTick,
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
