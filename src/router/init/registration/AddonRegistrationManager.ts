import { KairoContext } from "../../KairoContext";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    public constructor(
        private readonly context: KairoContext,
        private readonly parser: RegistrationRequestParser,
        private readonly builder: KairoRegistryBuilder,
        private readonly responder: RegistrationResponder,
    ) {}

    handleRegistrationRequest(message: string): void {
        const request = this.parser.parse(message);
        const kairoId = this.context.kairoId;

        if (request.rejects.includes(kairoId)) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.RegistrationRejected);
        }

        if (!request.approvals.includes(kairoId)) {
            return;
        }

        const properties = this.context.addonProperties;
        const registry: KairoRegistry = this.builder.build(kairoId, properties);

        this.context.kairoRegistry = registry;

        this.responder.respond(registry);
    }

    handleRegistrationResult(message: string): void {}

    dispose(): void {}
}
