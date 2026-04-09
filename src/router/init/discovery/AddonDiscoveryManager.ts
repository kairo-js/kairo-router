import { AddonProperties } from "../../../types/AddonProperties";
import { KairoInitializer } from "../KairoInitializer";
import { AddonIdProvider } from "./AddonIdProvider";
import { DiscoveryQueryListener } from "./DiscoveryQueryListener";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    private properties!: AddonProperties;
    private readonly listener = new DiscoveryQueryListener(this);
    private readonly queryParser = new DiscoveryQueryParser(this);
    private readonly responder = new DiscoveryResponder(this);
    private readonly idProvider = new AddonIdProvider(this);

    public constructor(kairoInitializer: KairoInitializer) {}

    public setup(properties: AddonProperties): void {
        this.properties = properties;
        this.listener.setup();
    }

    public handleRegistrationQuery(message: string) {
        const query = this.queryParser.parse(message);
        const addonId = this.idProvider.provideId(this.properties, query);
        this.responder.respond(addonId);
    }
}
