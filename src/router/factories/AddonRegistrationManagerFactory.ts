import { KairoRuntime } from "../../types/KairoRuntime";
import { AddonRegistrationManager } from "../init/registration/AddonRegistrationManager";
import { KairoRegistryBuilder } from "../init/registration/KairoRegistryBuilder";
import { RegistrationRequestParser } from "../init/registration/RegistrationRequestParser";
import { RegistrationResponder } from "../init/registration/RegistrationResponder";
import { KairoContext } from "../KairoContext";

export class AddonRegistrationManagerFactory {
    constructor(private readonly runtime: KairoRuntime) {}

    create(context: KairoContext): AddonRegistrationManager {
        return new AddonRegistrationManager(
            context,
            new RegistrationRequestParser(this.runtime),
            new KairoRegistryBuilder(),
            new RegistrationResponder(this.runtime),
        );
    }
}
