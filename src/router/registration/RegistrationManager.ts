import { AddonProperties } from "../../types/properties";
import { KairoRegister } from "./KairoRegister";
import { RegistrationListener } from "./RegistrationListener";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-CH 003
export class RegistrationManager {
    public readonly registrationListener = new RegistrationListener(this);
    public readonly registrationResponder = new RegistrationResponder(this);

    public constructor(kairoRegister: KairoRegister) {}

    public setup(properties: AddonProperties): void {
        this.registrationListener.setup();
    }
}
