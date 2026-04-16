import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoIdProvider } from "../KairoIdProvider";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    private readonly queryParser = new DiscoveryQueryParser();
    constructor(private readonly idProvider: KairoIdProvider) {}

    resolveKairoId(message: string, runtime: KairoRuntime, addonId: string): string {
        const query = this.queryParser.parse(message, runtime.currentTick());
        const idRegistry = runtime.createIdRegistry(query.idNamespace);
        return this.idProvider.provideId(idRegistry, addonId);
    }
}
