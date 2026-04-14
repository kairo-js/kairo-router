import { AddonRegistrationManager } from "../init/registration/AddonRegistrationManager";
import { KairoRegistryBuilder } from "../init/registration/KairoRegistryBuilder";
import { RegistrationRequestParser } from "../init/registration/RegistrationRequestParser";
import { KairoRuntime } from "../types/KairoRuntime";

export class AddonRegistrationManagerFactory {
    constructor(private readonly runtime: KairoRuntime) {}

    create(): AddonRegistrationManager {
        return new AddonRegistrationManager(
            new RegistrationRequestParser(this.runtime),
            new KairoRegistryBuilder(),
        );
    }
}
