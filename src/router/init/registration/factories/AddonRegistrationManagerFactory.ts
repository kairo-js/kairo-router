import { AddonRegistrationManager } from "../AddonRegistrationManager";
import { KairoRegistryBuilder } from "../KairoRegistryBuilder";
import { RegistrationRequestParser } from "../RegistrationRequestParser";

export class AddonRegistrationManagerFactory {
    constructor() {}

    create(): AddonRegistrationManager {
        return new AddonRegistrationManager(
            new RegistrationRequestParser(),
            new KairoRegistryBuilder(),
        );
    }
}
