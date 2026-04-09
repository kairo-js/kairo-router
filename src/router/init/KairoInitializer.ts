import { AddonProperties } from "../../types/AddonProperties";
import { KairoRouter } from "../KairoRouter";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";

// kjs-router-ch 0010
export class KairoInitializer {
    private readonly discoveryManager = new AddonDiscoveryManager(this);
    public constructor(kairoRouter: KairoRouter) {}

    public setupInitializationEndpoint(properties: AddonProperties): void {
        this.discoveryManager.setup(properties);
    }
}
