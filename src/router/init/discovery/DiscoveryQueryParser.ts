import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./DiscoveryQuery";

// kjs-router-ch 005
export class DiscoveryQueryParser {
    public constructor(manager: AddonDiscoveryManager) {}

    public parse(message: string): DiscoveryQuery {}
}
