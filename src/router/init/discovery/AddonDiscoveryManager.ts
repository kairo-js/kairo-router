import { KairoRuntime } from "../../../minecraft/KairoRuntime";
import { KairoIdProvider } from "../KairoIdProvider";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryQueryValidator } from "./DiscoveryQueryValidator";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    private readonly parser = new DiscoveryQueryParser();
    private readonly validator = new DiscoveryQueryValidator();
    constructor(private readonly idProvider: KairoIdProvider) {}

    resolveKairoId(message: string, runtime: KairoRuntime, addonId: string): string {
        const query = this.parser.parse(message);
        this.validator.validateRequest(query, runtime.currentTick());
        const idRegistry = runtime.createIdRegistry(query.registryId);
        return this.idProvider.provideId(idRegistry, addonId);
    }
}
