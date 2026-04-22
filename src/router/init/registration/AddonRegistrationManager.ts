import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "../KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationRequestValidator } from "./RegistrationRequestValidator";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private readonly parser = new RegistrationRequestParser();
    private readonly validator = new RegistrationRequestValidator();
    constructor(private readonly registryBuilder: KairoRegistryBuilder) {}

    resolveRegistry(
        message: string,
        currentTick: number,
        kairoId: string,
        addonProperties: AddonProperties,
    ): KairoRegistry | undefined {
        const request = this.parser.parse(message, currentTick);
        this.validator.validateRequest(request, currentTick);

        if (request.rejects.includes(kairoId)) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.RegistrationRejected);
        }

        if (!request.approvals.includes(kairoId)) {
            return;
        }

        const registry: KairoRegistry = this.registryBuilder.build(kairoId, addonProperties);
        return registry;
    }
}
