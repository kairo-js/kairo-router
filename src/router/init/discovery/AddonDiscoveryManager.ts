import { AddonProperties } from "../../../types/AddonProperties";
import { Disposable } from "../../types/Disposable";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager implements Disposable {
    constructor(
        private readonly addonProperties: AddonProperties,
        private readonly queryParser: DiscoveryQueryParser,
        private readonly idProvider: KairoIdProvider,
        private readonly responder: DiscoveryResponder,
    ) {}

    resolveKairoId(message: string): string {
        const query = this.queryParser.parse(message);
        return this.idProvider.provideId(this.addonProperties, query);
    }

    handleRegistrationQuery(message: string): string {
        const query = this.queryParser.parse(message);
        const kairoId = this.idProvider.provideId(this.addonProperties, query);
        this.responder.respond(kairoId);
        return kairoId;
    }

    dispose(): void {}
}
