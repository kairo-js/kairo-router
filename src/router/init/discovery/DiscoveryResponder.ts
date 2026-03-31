import { AddonDiscoveryManager } from "./AddonDiscoveryManager";

// kjs-router-ch 006
export class DiscoveryResponder {
    public constructor(manager: AddonDiscoveryManager) {}

    public respond(addonId: string): void {}
}
