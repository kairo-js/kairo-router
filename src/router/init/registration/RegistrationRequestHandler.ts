import { KairoContext, KairoContextMutator } from "../../KairoContext";
import { KairoRuntime } from "../../types/KairoRuntime";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationResponder } from "./RegistrationResponder";

export class RegistrationRequestHandler {
    constructor(
        private readonly registrationManager: AddonRegistrationManager,
        private readonly registrationResponder: RegistrationResponder,
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly runtime: KairoRuntime,
    ) {}

    handle = (msg: string): void => {
        const registry = this.registrationManager.resolveRegistry(
            msg,
            this.runtime.currentTick(),
            this.context.kairoId,
            this.context.addonProperties,
        );

        if (!registry) return;

        this.contextMutator.setKairoRegistry(registry);
        this.registrationResponder.respond(registry);
    };
}
