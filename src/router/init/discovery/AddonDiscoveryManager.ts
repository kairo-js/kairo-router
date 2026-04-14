import { Disposable } from "../../../types/Disposable";
import { KairoContext } from "../../KairoContext";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager implements Disposable {
    constructor(
        private readonly context: KairoContext,
        private readonly queryParser: DiscoveryQueryParser,
        private readonly idProvider: KairoIdProvider,
        private readonly responder: DiscoveryResponder,
    ) {}

    handleRegistrationQuery(message: string): void {
        if (!this.context) {
            throw new Error("AddonDiscoveryManager: Context not set.");
        }

        const query = this.queryParser.parse(message);
        const kairoId = this.idProvider.provideId(this.context.addonProperties, query);
        this.context.kairoId = kairoId;
        this.responder.respond(kairoId);
    }

    dispose(): void {}
}
