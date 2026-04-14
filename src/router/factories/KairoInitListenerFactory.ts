import { KairoInitListener } from "../init/KairoInitListener";
import { KairoRuntime } from "../types/KairoRuntime";

export class KairoInitListenerFactory {
    constructor(private readonly runtime: KairoRuntime) {}

    create(): KairoInitListener {
        return new KairoInitListener(this.runtime);
    }
}
