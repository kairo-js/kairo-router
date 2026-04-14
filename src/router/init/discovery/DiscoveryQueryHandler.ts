import { KairoRuntime } from "../../types/KairoRuntime";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryResponder } from "./DiscoveryResponder";

export class DiscoveryQueryHandler {
    constructor(
        private readonly discoveryManager: AddonDiscoveryManager,
        private readonly discoveryResponder: DiscoveryResponder,
        private readonly runtime: KairoRuntime,
    ) {}

    handle = (msg: string): string => {
        const kairoId = this.discoveryManager.resolveKairoId(msg, this.runtime.currentTick());

        this.discoveryResponder.respond(kairoId);
        return kairoId;
    };
}
