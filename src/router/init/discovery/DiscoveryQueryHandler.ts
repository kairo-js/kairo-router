import { KairoContextMutator } from "../../KairoContext";
import { KairoRuntime } from "../../types/KairoRuntime";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryResponder } from "./DiscoveryResponder";

export class DiscoveryQueryHandler {
    constructor(
        private readonly discoveryManager: AddonDiscoveryManager,
        private readonly discoveryResponder: DiscoveryResponder,
        private readonly contextMutator: KairoContextMutator,
        private readonly runtime: KairoRuntime,
    ) {}

    handle = (msg: string): void => {
        const kairoId = this.discoveryManager.resolveKairoId(msg, this.runtime.currentTick());

        this.contextMutator.setKairoId(kairoId);
        this.discoveryResponder.respond(kairoId);
    };
}
