import { Disposable } from "../../../types/Disposable";
import { KairoContext } from "../../KairoContext";
import { KairoRuntime } from "../../KairoRuntime";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager implements Disposable {
    private context?: KairoContext;
    private readonly queryParser: DiscoveryQueryParser;
    private readonly idProvider: KairoIdProvider;
    private readonly responder: DiscoveryResponder;

    constructor(
        context: KairoContext,
        private readonly runtime: KairoRuntime,
    ) {
        this.context = context;
        this.queryParser = new DiscoveryQueryParser(this.runtime);
        this.idProvider = new KairoIdProvider(this.runtime);
        this.responder = new DiscoveryResponder(this.runtime);
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
