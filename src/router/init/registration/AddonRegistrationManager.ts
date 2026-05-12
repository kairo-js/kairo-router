import type { AddonProperties } from "@kairo-js/properties";
import type { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "../KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";
import { RegistrationRequestValidator } from "./RegistrationRequestValidator";
import { RegistrationResultParser } from "./RegistrationResultParser";
import { RegistrationResultValidator } from "./RegistrationResultValidator";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private readonly requestParser = new RegistrationRequestParser();
    private readonly requestValidator = new RegistrationRequestValidator();

    private readonly resultParser = new RegistrationResultParser();
    private readonly resultValidator = new RegistrationResultValidator();

    constructor(private readonly registryBuilder: KairoRegistryBuilder) {}

    resolveRegistry(
        message: string,
        currentTick: number,
        kairoId: string,
        addonProperties: AddonProperties,
    ): KairoRegistry | undefined {
        const request = this.requestParser.parse(message);
        this.requestValidator.validateRequest(request, currentTick);

        if (request.rejects.includes(kairoId)) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.RegistrationRejected);
        }

        if (!request.approvals.includes(kairoId)) {
            return;
        }

        const registry: KairoRegistry = this.registryBuilder.build(kairoId, addonProperties);
        return registry;
    }

    resolveResult(message: string, currentTick: number): boolean {
        const result = this.resultParser.parse(message);
        this.resultValidator.validateRequest(result, currentTick);

        return result.success;
    }
}
