import { AddonProperties } from "../../types/properties";
import { KairoRouter } from "../KairoRouter";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";

// kjs-router-ch 002
export class KairoInitializer {
    private readonly discoveryManager = new AddonDiscoveryManager(this);
    public constructor(kairoRouter: KairoRouter) {}

    public setupInitializationEndpoint(properties: AddonProperties): void {
        this.discoveryManager.setup(properties);
    }
}
