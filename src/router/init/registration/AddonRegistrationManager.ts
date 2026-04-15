import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../types/KairoRegistry";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "../errors";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationRequestParser } from "./RegistrationRequestParser";

// kjs-router-ch 0200
export class AddonRegistrationManager {
    private readonly requestParser = new RegistrationRequestParser();
    private readonly regitryBuilder = new KairoRegistryBuilder();
    constructor() {}

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

        const registry: KairoRegistry = this.regitryBuilder.build(kairoId, addonProperties);
        return registry;
    }
}
