import { AddonProperties } from "../../../types/AddonProperties";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    constructor(
        private readonly addonProperties: AddonProperties,
        private readonly queryParser: DiscoveryQueryParser,
        private readonly idProvider: KairoIdProvider,
    ) {}

    resolveKairoId(message: string, currentTick: number): string {
        const query = this.queryParser.parse(message, currentTick);
        return this.idProvider.provideId(this.addonProperties, query);
    }
}
