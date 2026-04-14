import { KairoRuntime } from "../../../types/KairoRuntime";
import { AddonDiscoveryManager } from "../AddonDiscoveryManager";
import { DiscoveryQueryHandler } from "../DiscoveryQueryHandler";
import { DiscoveryResponder } from "../DiscoveryResponder";

export class DiscoveryQueryHandlerFactory {
    constructor() {}

    create(
        discovery: AddonDiscoveryManager,
        responder: DiscoveryResponder,
        runtime: KairoRuntime,
    ): DiscoveryQueryHandler {
        return new DiscoveryQueryHandler(discovery, responder, runtime);
    }
}
