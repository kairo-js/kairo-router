import { AddonRegistrationManager } from "../init/registration/AddonRegistrationManager";
import { KairoRegistryBuilder } from "../init/registration/KairoRegistryBuilder";
import { RegistrationRequestParser } from "../init/registration/RegistrationRequestParser";

export class AddonRegistrationManagerFactory {
    constructor() {}

    create(): AddonRegistrationManager {
        return new AddonRegistrationManager(
            new RegistrationRequestParser(),
            new KairoRegistryBuilder(),
        );
    }
}
