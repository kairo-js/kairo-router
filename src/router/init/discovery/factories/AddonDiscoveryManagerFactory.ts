import { KairoContext } from "../../../KairoContext";
import { IdRegistryFactory } from "../../../types/IdRegistryFactory";
import { AddonDiscoveryManager } from "../AddonDiscoveryManager";
import { DiscoveryQueryParser } from "../DiscoveryQueryParser";
import { KairoIdProvider } from "../KairoIdProvider";

export class AddonDiscoveryManagerFactory {
    constructor() {}

    create(context: KairoContext, idRegistryFactory: IdRegistryFactory): AddonDiscoveryManager {
        return new AddonDiscoveryManager(
            context.addonProperties,
            new DiscoveryQueryParser(),
            new KairoIdProvider(idRegistryFactory),
        );
    }
}
