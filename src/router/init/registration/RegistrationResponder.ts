import { system } from "@minecraft/server";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationEventId } from "./constants/RegistrationEventId";
import { AddonData } from "./dataBuilder/types";
import { RegistrationResponse } from "./response/types";

// kjs-router-ch 0203
export class RegistrationResponder {
    public constructor(manager: AddonRegistrationManager) {}

    public respond(addonData: AddonData) {
        const response: RegistrationResponse = {
            addonData,
            timestamp: system.currentTick,
        };

        system.sendScriptEvent(
            RegistrationEventId.Response,
            stringifyRegistrationResponse(response),
        );
    }
}
