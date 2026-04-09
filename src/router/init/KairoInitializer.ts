import { AddonProperties } from "../../types/AddonProperties";
import { KairoRouter } from "../KairoRouter";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";

// kjs-router-ch 0010
export class KairoInitializer {
    private properties!: AddonProperties;
    private addonId!: string;
    private readonly discoveryManager = new AddonDiscoveryManager(this);
    private readonly registrationManager = new AddonRegistrationManager(this);
    public constructor(kairoRouter: KairoRouter) {}

    public setupInitializationEndpoint(properties: AddonProperties): void {
        this.properties = properties;
        this.discoveryManager.setup();
        this.registrationManager.setup();
    }

    public getAddonProperties(): AddonProperties {
        return this.properties;
    }

    public getAddonId(): string {
        return this.addonId;
    }
    public setAddonId(id: string): void {
        this.addonId = id;
    }
}
