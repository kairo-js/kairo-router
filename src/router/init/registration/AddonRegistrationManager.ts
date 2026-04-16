import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "../KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private readonly requestParser = new RegistrationRequestParser();
    constructor(private readonly registryBuilder: KairoRegistryBuilder) {}

    resolveRegistry(
        message: string,
        currentTick: number,
        kairoId: string,
        addonProperties: AddonProperties,
    ): KairoRegistry | undefined {
        const request = this.requestParser.parse(message, currentTick);

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
