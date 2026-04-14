import { KairoRuntime } from "../../../types/KairoRuntime";
import { DiscoveryResponder } from "../DiscoveryResponder";

export class DiscoveryResponderFactory {
    constructor() {}

    create(runtime: KairoRuntime): DiscoveryResponder {
        return new DiscoveryResponder(runtime);
    }
}
