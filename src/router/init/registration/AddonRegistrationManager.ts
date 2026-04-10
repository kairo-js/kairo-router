import { KairoInitializer } from "../KairoInitializer";
import { RegistrationDataBuilder } from "./RegistrationDataBuilder";
import { RegistrationListener } from "./RegistrationListener";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private readonly listener = new RegistrationListener(this);
    private readonly parser = new RegistrationRequestParser(this);
    private readonly dataBuilder = new RegistrationDataBuilder(this);
    private readonly responder = new RegistrationResponder(this);
    public constructor(private readonly kairoInitializer: KairoInitializer) {}

    public setup(): void {
        this.listener.setup();
    }

    public handleRegistrationRequest(message: string): void {
        const request = this.parser.parse(message);
        const addonId = this.kairoInitializer.getAddonId();

        if (!request.approvals.includes(addonId)) {
            return;
        }

        const properties = this.kairoInitializer.getAddonProperties();
        const addonData = this.dataBuilder.build(addonId, properties);
        this.responder.respond(addonData);
    }

    public handleRegistrationResult(message: string): void {}
}
