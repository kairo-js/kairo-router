import { Disposable } from "../../../types/Disposable";
import { KairoContext } from "../../KairoContext";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager implements Disposable {
    private context?: KairoContext;

    constructor(
        private readonly queryParser = new DiscoveryQueryParser(),
        private readonly responder = new DiscoveryResponder(),
        private readonly idProvider = new KairoIdProvider(),
    ) {}

    setContext(context: KairoContext): void {
        this.context = context;
    }

    handleRegistrationQuery(message: string): void {
        if (!this.context) {
            throw new Error("AddonDiscoveryManager: Context not set.");
        }

        const query = this.queryParser.parse(message);
        const kairoId = this.idProvider.provideId(this.context.addonProperties, query);
        this.context.kairoId = kairoId;
        this.responder.respond(kairoId);
    }

    dispose(): void {
        this.context = undefined;
    }
}
