import { system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";
import { DiscoveryResponse } from "./types/DiscoveryResponse";

import fastJson from "fast-json-stringify";

// kjs-router-ch 006
export class DiscoveryResponder {
    private readonly discoveryResponseSchema = {
        type: "object",
        properties: {
            addonId: { type: "string" },
            timestamp: { type: "number" },
        },
        required: ["addonId", "timestamp"],
        additionalProperties: false,
    } as const;
    private readonly stringifyDiscoveryResponse: (response: DiscoveryResponse) => string;

    public constructor(manager: AddonDiscoveryManager) {
        this.stringifyDiscoveryResponse = fastJson(this.discoveryResponseSchema);
    }

    public respond(addonId: string): void {
        const response: DiscoveryResponse = {
            addonId,
            timestamp: system.currentTick,
        };

        system.sendScriptEvent(
            DiscoveryEventId.Response,
            this.stringifyDiscoveryResponse(response),
        );
    }
}
