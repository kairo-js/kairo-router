import { KairoContext } from "../../KairoContext";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoRegistry } from "../../types/KairoRegistry";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationResponder } from "./RegistrationResponder";

export class RegistrationRequestHandler {
    constructor(
        private readonly registrationManager: AddonRegistrationManager,
        private readonly registrationResponder: RegistrationResponder,
        private readonly context: KairoContext,
        private readonly runtime: KairoRuntime,
    ) {}

    handle = (msg: string): KairoRegistry | undefined => {
        const registry = this.registrationManager.resolveRegistry(
            msg,
            this.runtime.currentTick(),
            this.context.kairoId,
            this.context.addonProperties,
        );

        if (!registry) return;

        this.registrationResponder.respond(registry);
        return registry;
    };
}
