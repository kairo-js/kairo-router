import { AddonDiscoveryManager } from "./AddonDiscoveryManager";

// kjs-router-ch 007
export class AddonIdProvider {
    public constructor(manager: AddonDiscoveryManager) {}

    public provideId(): string {
        return "";
    }
}
