import { AddonDiscoveryManager } from "../init/discovery/AddonDiscoveryManager";
import { DiscoveryQueryParser } from "../init/discovery/DiscoveryQueryParser";
import { KairoIdProvider } from "../init/discovery/KairoIdProvider";
import { KairoContext } from "../KairoContext";
import { IdRegistryFactory } from "../types/IdRegistryFactory";

export class AddonDiscoveryManagerFactory {
    constructor(private readonly idRegistryFactory: IdRegistryFactory) {}

    create(context: KairoContext): AddonDiscoveryManager {
        return new AddonDiscoveryManager(
            context.addonProperties,
            new DiscoveryQueryParser(),
            new KairoIdProvider(this.idRegistryFactory),
        );
    }
}
