import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./DiscoveryQuery";

// kjs-router-ch 006
export class DiscoveryResponder {
    public constructor(manager: AddonDiscoveryManager) {}

    public respond(query: DiscoveryQuery): void {}
}
