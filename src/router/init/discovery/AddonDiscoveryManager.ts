import { AddonProperties } from "../../../types/properties";
import { KairoInitializer } from "../KairoInitializer";
import { AddonIdProvider } from "./AddonIdProvider";
import { DiscoveryQueryListener } from "./DiscoveryQueryListener";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";

export class AddonDiscoveryManager {
    private readonly listener = new DiscoveryQueryListener(this);
    private readonly queryParser = new DiscoveryQueryParser(this);
    private readonly responder = new DiscoveryResponder(this);
    private readonly idProvider = new AddonIdProvider(this);

    public constructor(kairoInitializer: KairoInitializer) {}

    public setup(properties: AddonProperties): void {
        this.listener.setup();
    }

    public handleRegistrationQuery(message: string) {
        const query = this.queryParser.parse(message);
        this.responder.respond(query);
    }
}
