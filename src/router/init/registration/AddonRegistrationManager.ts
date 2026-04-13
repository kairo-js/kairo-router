import { KairoRegistry } from "../../../types/KairoRegistry";
import { KairoContext } from "../../KairoContext";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private context?: KairoContext;
    public constructor(
        private readonly parser = new RegistrationRequestParser(),
        private readonly builder = new KairoRegistryBuilder(),
        private readonly responder = new RegistrationResponder(),
    ) {}

    setContext(context: KairoContext): void {
        this.context = context;
    }

    handleRegistrationRequest(message: string): void {
        if (!this.context) {
            throw new Error("AddonRegistrationManager: Context not set.");
        }

        const request = this.parser.parse(message);
        const kairoId = this.context.kairoId;

        if (request.rejects.includes(kairoId)) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.RegistrationRejected);
        }

        if (!request.approvals.includes(kairoId)) {
            return;
        }

        const properteis = this.context.addonProperties;
        const registry: KairoRegistry = this.builder.build(kairoId, properteis);

        this.context.kairoRegistry = registry;

        this.responder.respond(registry);
    }

    handleRegistrationResult(message: string): void {}

    dispose(): void {
        this.context = undefined;
    }
}
