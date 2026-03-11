import { KairoRouter } from "../KairoRouter";
import { AddonProperties } from "../../types/properties";
import { RegistrationManager } from "./RegistrationManager";

// kjs-router-CH 002
export class KairoRegister {
    private readonly registrationManager = new RegistrationManager(this);
    public constructor(kairoRouter: KairoRouter) {}

    public setupRegistrationEndpoint(properties: AddonProperties): void {
        this.registrationManager.setup(properties);
    }
}
