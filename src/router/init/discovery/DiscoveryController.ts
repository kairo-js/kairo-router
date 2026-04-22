import { KairoContext, KairoContextMutator } from "../../KairoContext";
import { KairoRuntime } from "../../types/KairoRuntime";
import { KairoIdProvider } from "../KairoIdProvider";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryResponder } from "./DiscoveryResponder";

export class DiscoveryController {
    private readonly discoveryManager: AddonDiscoveryManager;
    private readonly discoveryResponder: DiscoveryResponder;

    constructor(private readonly idProvider: KairoIdProvider) {
        this.discoveryManager = new AddonDiscoveryManager(this.idProvider);
        this.discoveryResponder = new DiscoveryResponder();
    }

    handleDiscoveryQuery = (
        message: string,
        deps: { runtime: KairoRuntime; context: KairoContext; contextMutator: KairoContextMutator },
    ): void => {
        const kairoId = this.discoveryManager.resolveKairoId(
            message,
            deps.runtime,
            deps.context.addonProperties.id,
        );

        this.discoveryResponder.respond(deps.runtime, kairoId);
        deps.contextMutator.setKairoId(kairoId);
    };
}
