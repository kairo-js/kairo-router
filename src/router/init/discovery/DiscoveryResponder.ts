import { system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";
import { stringifyDiscoveryResponse } from "./response/stringify";
import { DiscoveryResponse } from "./response/types";

// kjs-router-ch 0103
export class DiscoveryResponder {
    public constructor(manager: AddonDiscoveryManager) {}

    public respond(addonId: string): void {
        const response: DiscoveryResponse = {
            addonId,
            timestamp: system.currentTick,
        };

        system.sendScriptEvent(DiscoveryEventId.Response, stringifyDiscoveryResponse(response));
    }
}
