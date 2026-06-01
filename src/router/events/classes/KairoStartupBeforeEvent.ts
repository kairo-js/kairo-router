import type { StartupEvent } from "@minecraft/server";
import { KairoApiRegistry } from "../../api/KairoApiRegistry";
import { KairoCustomCommandRegistry } from "./KairoCustomCommandRegistry";

export class KairoStartupBeforeEvent {
    readonly customCommandRegistry: KairoCustomCommandRegistry;
    readonly api: KairoApiRegistry;

    constructor(ev: StartupEvent, isActive: () => boolean, apiRegistry: KairoApiRegistry, getAddonName?: () => string | undefined) {
        this.customCommandRegistry = new KairoCustomCommandRegistry(ev.customCommandRegistry, isActive, getAddonName);
        this.api = apiRegistry;
    }
}
