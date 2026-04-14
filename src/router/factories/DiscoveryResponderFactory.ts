import { DiscoveryResponder } from "../init/discovery/DiscoveryResponder";
import { KairoRuntime } from "../types/KairoRuntime";

export class DiscoveryResponderFactory {
    constructor(private readonly runtime: KairoRuntime) {}

    create(): DiscoveryResponder {
        return new DiscoveryResponder(this.runtime);
    }
}
