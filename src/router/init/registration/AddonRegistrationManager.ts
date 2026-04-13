import { KairoRegistry } from "../../../types/KairoRegistry";
import { KairoContext } from "../../KairoContext";
import { KairoRuntime } from "../../KairoRuntime";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private context?: KairoContext;
    private readonly parser: RegistrationRequestParser;
    private readonly builder: KairoRegistryBuilder;
    private readonly responder: RegistrationResponder;
    public constructor(
        context: KairoContext,
        private readonly runtime: KairoRuntime,
    ) {
        this.context = context;
        this.parser = new RegistrationRequestParser(this.runtime);
        this.builder = new KairoRegistryBuilder();
        this.responder = new RegistrationResponder(this.runtime);
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
