import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryQuery } from "./DiscoveryQuery";

export class DiscoveryQueryParser {
    public constructor(manager: AddonDiscoveryManager) {}

    public parse(message: string): DiscoveryQuery {}
}
