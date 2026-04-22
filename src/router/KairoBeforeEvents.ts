import { EventRegistry } from "./EventRegistry";
import { KairoEventMap } from "./types/KairoEventMap";
import { asSubscribable } from "./types/Subscribable";

export class KairoBeforeEvents<E extends KairoEventMap> {
    constructor(private registry: EventRegistry<E>) {}

    get addonDeactivate() {
        return asSubscribable(this.registry.getBefore("addonDeactivate"));
    }
}
