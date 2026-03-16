import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./DiscoveryQuery";

export class DiscoveryResponder {
    public constructor(manager: AddonDiscoveryManager) {}

    public respond(query: DiscoveryQuery): void {}
}
