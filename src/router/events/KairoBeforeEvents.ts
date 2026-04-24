import { asSubscribable } from "../types/Subscribable";
import { EventRegistry } from "./EventRegistry";
import { KairoEventMap } from "./types/KairoEventMap";

export class KairoBeforeEvents<E extends KairoEventMap> {
    readonly addonDeactivate;
    constructor(private registry: EventRegistry<E>) {
        this.addonDeactivate = asSubscribable(this.registry.getBefore("addonDeactivate"));
    }
}
