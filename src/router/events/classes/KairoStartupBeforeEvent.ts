import type { StartupEvent } from "@minecraft/server";
import { KairoApiRegistry, type ApiRegistration } from "../../api/KairoApiRegistry";
import { KairoCommandRegistry } from "../../command/KairoCommandRegistry";
import { AddonEventRegistry, type AddonEventRegistration } from "../../event/AddonEventRegistry";

export class KairoStartupBeforeEvent {
    readonly commands: KairoCommandRegistry;
    readonly api: ApiRegistration;
    readonly events: AddonEventRegistration;

    constructor(
        ev: StartupEvent,
        isActive: () => boolean,
        apiRegistry: KairoApiRegistry,
        eventRegistry: AddonEventRegistry,
        getAddonName?: () => string | undefined,
        commandRegistry?: KairoCommandRegistry,
    ) {
        this.commands = commandRegistry ?? new KairoCommandRegistry(
            ev.customCommandRegistry,
            isActive,
            () => undefined,
            () => {},
        );
        this.api = apiRegistry;
        this.events = eventRegistry;
    }
}
