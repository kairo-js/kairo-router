import { KairoContext, KairoContextMutator } from "../../KairoContext";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoRegistryBuilder } from "../KairoRegistryBuilder";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationResponder } from "./RegistrationResponder";

export class RegistrationController {
    private readonly registrationManager: AddonRegistrationManager;
    private readonly registrationResponder: RegistrationResponder;

    constructor(private readonly registryBuilder: KairoRegistryBuilder) {
        this.registrationManager = new AddonRegistrationManager(this.registryBuilder);
        this.registrationResponder = new RegistrationResponder();
    }

    handleRegistrationRequest = (
        message: string,
        deps: { runtime: KairoRuntime; context: KairoContext; contextMutator: KairoContextMutator },
    ): KairoRegistry | undefined => {
        const registry = this.registrationManager.resolveRegistry(
            message,
            deps.runtime.currentTick(),
            deps.context.kairoId,
            deps.context.addonProperties,
        );

        if (!registry) return;

        this.registrationResponder.respond(deps.runtime, registry);
        deps.contextMutator.setKairoRegistry(registry);

        return registry;
    };
}
