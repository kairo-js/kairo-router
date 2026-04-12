import { system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";
import { DiscoveryResponseError, DiscoveryResponseErrorReason } from "./response/errors";
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

        if (!validateDiscoveryResponse(response)) {
            throw new DiscoveryResponseError(DiscoveryResponseErrorReason.InvalidStructure);
        }

        let responseStr: string;
        try {
            responseStr = stringifyDiscoveryResponse(response);
        } catch (e) {
            throw new DiscoveryResponseError(DiscoveryResponseErrorReason.StringifyFailed, {
                cause: e,
            });
        }

        system.sendScriptEvent(DiscoveryEventId.Response, responseStr);
    }
}
