import type { BlockComponentRegistry, ItemComponentRegistry, StartupEvent } from "@minecraft/server";
import { KairoApiRegistry, type ApiRegistration } from "../../api/KairoApiRegistry";
import { KairoCommandRegistry } from "../../command/KairoCommandRegistry";
import { AddonEventRegistry, type AddonEventRegistration } from "../../event/AddonEventRegistry";

export class KairoStartupBeforeEvent {
    readonly blockComponentRegistry: BlockComponentRegistry;
    readonly customCommandRegistry: KairoCommandRegistry;
    readonly itemComponentRegistry: ItemComponentRegistry;
    readonly addonApi: ApiRegistration;
    readonly addonEvents: AddonEventRegistration;
    /** @deprecated Use addonApi instead. */
    readonly api: ApiRegistration;
    /** @deprecated Use addonEvents instead. */
    readonly events: AddonEventRegistration;

    constructor(
        ev: StartupEvent,
        isActive: () => boolean,
        apiRegistry: KairoApiRegistry,
        eventRegistry: AddonEventRegistry,
        commandRegistry?: KairoCommandRegistry,
    ) {
        this.blockComponentRegistry = ev.blockComponentRegistry;
        this.customCommandRegistry = commandRegistry ?? new KairoCommandRegistry(
            ev.customCommandRegistry,
            isActive,
        );
        this.itemComponentRegistry = ev.itemComponentRegistry;
        this.addonApi = apiRegistry;
        this.addonEvents = eventRegistry;
        this.api = this.addonApi;
        this.events = this.addonEvents;
    }
}
