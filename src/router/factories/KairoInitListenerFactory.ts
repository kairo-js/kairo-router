import { KairoInitListener } from "../init/KairoInitListener";
import { KairoRuntime } from "../types/KairoRuntime";

export class KairoInitListenerFactory {
    constructor() {}

    create(runtime: KairoRuntime): KairoInitListener {
        return new KairoInitListener(runtime);
    }
}
