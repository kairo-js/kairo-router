import { KairoContext, KairoContextMutator } from "../../../KairoContext";
import { KairoRuntime } from "../../../types/KairoRuntime";
import { AddonRegistrationManager } from "../AddonRegistrationManager";
import { RegistrationRequestHandler } from "../RegistrationRequestHandler";
import { RegistrationResponder } from "../RegistrationResponder";

export class RegistrationRequestHandlerFactory {
    constructor() {}

    create(
        registration: AddonRegistrationManager,
        responder: RegistrationResponder,
        context: KairoContext,
        mutator: KairoContextMutator,
        runtime: KairoRuntime,
    ): RegistrationRequestHandler {
        return new RegistrationRequestHandler(registration, responder, context, mutator, runtime);
    }
}
