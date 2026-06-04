import type { StartupEvent } from "@minecraft/server";
import { KairoApiRegistry, type ApiRegistration } from "../../api/KairoApiRegistry";
import { AddonEventRegistry, type AddonEventRegistration } from "../../event/AddonEventRegistry";
import { KairoCustomCommandRegistry } from "./KairoCustomCommandRegistry";

export class KairoStartupBeforeEvent {
    readonly customCommandRegistry: KairoCustomCommandRegistry;
    readonly api: ApiRegistration;
    readonly events: AddonEventRegistration;

    constructor(
        ev: StartupEvent,
        isActive: () => boolean,
        apiRegistry: KairoApiRegistry,
        eventRegistry: AddonEventRegistry,
        getAddonName?: () => string | undefined,
    ) {
        this.customCommandRegistry = new KairoCustomCommandRegistry(ev.customCommandRegistry, isActive, getAddonName);
        this.api = apiRegistry;
        this.events = eventRegistry;
    }
}
