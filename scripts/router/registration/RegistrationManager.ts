import { AddonProperties } from "../../types/properties";
import { KairoRegister } from "./KairoRegister";
import { RegistrationIdProvider } from "./RegistrationIdProvider";
import { RegistrationQueryListener } from "./RegistrationQueryListener";
import { RegistrationQueryParser } from "./RegistrationQueryParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-CH 003
export class RegistrationManager {
    private readonly listener = new RegistrationQueryListener(this);
    private readonly queryParser = new RegistrationQueryParser(this);
    private readonly responder = new RegistrationResponder(this);
    private readonly idProvider = new RegistrationIdProvider(this);

    public constructor(kairoRegister: KairoRegister) {}

    public setup(properties: AddonProperties): void {
        this.listener.setup();
    }

    public handleRegistrationQuery(message: string) {
        const query = this.queryParser.parse(message);
        this.responder.respond(query);
    }
}
