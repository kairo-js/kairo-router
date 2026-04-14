import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationResponder } from "./RegistrationResponder";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    public constructor(
        private readonly parser: RegistrationRequestParser,
        private readonly builder: KairoRegistryBuilder,
        private readonly responder: RegistrationResponder,
    ) {}

    resolveRegistry(
        message: string,
        kairoId: string,
        addonProperties: AddonProperties,
    ): KairoRegistry | undefined {
        const request = this.parser.parse(message);

        if (request.rejects.includes(kairoId)) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.RegistrationRejected);
        }

        if (!request.approvals.includes(kairoId)) {
            return;
        }

        const registry: KairoRegistry = this.builder.build(kairoId, addonProperties);
        return registry;
    }

    handleRegistrationResult(message: string): void {}

    dispose(): void {}
}
