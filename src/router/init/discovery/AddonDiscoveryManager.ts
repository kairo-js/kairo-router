import { AddonProperties } from "../../../types/AddonProperties";
import { Disposable } from "../../types/Disposable";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager implements Disposable {
    constructor(
        private readonly addonProperties: AddonProperties,
        private readonly queryParser: DiscoveryQueryParser,
        private readonly idProvider: KairoIdProvider,
    ) {}

    resolveKairoId(message: string): string {
        const query = this.queryParser.parse(message);
        return this.idProvider.provideId(this.addonProperties, query);
    }

    dispose(): void {}
}
