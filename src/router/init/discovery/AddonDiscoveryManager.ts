import { KairoInitializer } from "../KairoInitializer";
import { DiscoveryListener } from "./DiscoveryListener";
import { DiscoveryQueryParser } from "./DiscoveryQueryParser";
import { DiscoveryResponder } from "./DiscoveryResponder";
import { KairoIdProvider } from "./KairoIdProvider";

// kjs-router-ch 0100
export class AddonDiscoveryManager {
    private readonly listener = new DiscoveryListener(this);
    private readonly queryParser = new DiscoveryQueryParser(this);
    private readonly responder = new DiscoveryResponder(this);
    private readonly idProvider = new KairoIdProvider(this);

    public constructor(private readonly kairoInitializer: KairoInitializer) {}

    public setup(): void {
        this.listener.setup();
    }

    public handleRegistrationQuery(message: string) {
        const query = this.queryParser.parse(message);
        const kairoId = this.idProvider.provideId(
            this.kairoInitializer.getAddonProperties(),
            query,
        );

        this.kairoInitializer.setKairoId(kairoId);
        this.responder.respond(kairoId);
    }
}
