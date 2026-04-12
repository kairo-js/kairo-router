import { system } from "@minecraft/server";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationEventId } from "./constants/RegistrationEventId";
import { AddonData } from "./dataBuilder/types";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import { stringifyRegistrationResponse } from "./response/stringify";
import { RegistrationResponse } from "./response/types";

// kjs-router-ch 0203
export class RegistrationResponder {
    public constructor(manager: AddonRegistrationManager) {}

    public respond(addonData: AddonData) {
        const response: RegistrationResponse = {
            addonData,
            timestamp: system.currentTick,
        };

        let responseStr: string;
        try {
            responseStr = stringifyRegistrationResponse(response);
        } catch (e) {
            throw new RegistrationResponseError(RegistrationResponseErrorReason.StringifyFailed);
        }

        system.sendScriptEvent(RegistrationEventId.Response, responseStr);
    }
}
