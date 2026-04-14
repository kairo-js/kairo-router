import { IdRegistryFactory } from "../../types/IdRegistryFactory";
import { KairoRuntime } from "../../types/KairoRuntime";
import { AddonDiscoveryManager } from "../init/discovery/AddonDiscoveryManager";
import { DiscoveryQueryParser } from "../init/discovery/DiscoveryQueryParser";
import { DiscoveryResponder } from "../init/discovery/DiscoveryResponder";
import { KairoIdProvider } from "../init/discovery/KairoIdProvider";
import { KairoContext } from "../KairoContext";

export class AddonDiscoveryManagerFactory {
    constructor(
        private readonly runtime: KairoRuntime,
        private readonly idRegistryFactory: IdRegistryFactory,
    ) {}

    create(context: KairoContext): AddonDiscoveryManager {
        return new AddonDiscoveryManager(
            context,
            new DiscoveryQueryParser(this.runtime),
            new KairoIdProvider(this.idRegistryFactory),
            new DiscoveryResponder(this.runtime),
        );
    }
}
