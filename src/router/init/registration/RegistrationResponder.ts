import { system } from "@minecraft/server";
import { KairoRegistry } from "../../../types/KairoRegistry";
import { KairoInitEventId } from "../types";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import { RegistrationResponse } from "./response/schema";
import { stringifyRegistrationResponse } from "./response/stringify";

// kjs-router-ch 0203
export class RegistrationResponder {
    public constructor() {}

    public respond(kairoRegistry: KairoRegistry): void {
        const response: RegistrationResponse = {
            kairoRegistry,
            timestamp: system.currentTick,
        };

        let responseStr: string;
        try {
            responseStr = stringifyRegistrationResponse(response);
        } catch (e) {
            throw new RegistrationResponseError(RegistrationResponseErrorReason.StringifyFailed);
        }

        system.sendScriptEvent(KairoInitEventId.RegistrationResponse, responseStr);
    }
}
