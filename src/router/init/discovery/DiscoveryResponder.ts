import { system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";
import { stringifyDiscoveryResponse } from "./format/discoveryResponse.stringify";
import { DiscoveryResponse } from "./types/DiscoveryResponse";

// kjs-router-ch 006
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
