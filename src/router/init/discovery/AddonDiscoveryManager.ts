import { KairoRuntime } from "../../types/KairoRuntime";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    private readonly queryParser = new DiscoveryQueryParser();
    private readonly idProvider = new KairoIdProvider();
    constructor() {}

    resolveKairoId(message: string, runtime: KairoRuntime, addonId: string): string {
        const query = this.queryParser.parse(message, runtime.currentTick());
        const idRegistry = runtime.createIdRegistry(query.idNamespace);
        return this.idProvider.provideId(idRegistry, addonId);
    }
}
