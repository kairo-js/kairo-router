import { KairoEventMap } from "../types/KairoEventMap";
import { asSubscribable } from "../types/Subscribable";
import { EventRegistry } from "./EventRegistry";

export class KairoAfterEvents<E extends KairoEventMap> {
    constructor(private registry: EventRegistry<E>) {}

    get addonActivate() {
        return asSubscribable(this.registry.getAfter("addonActivate"));
    }

    get playerJoin() {
        return asSubscribable(this.registry.getAfter("playerJoin"));
    }
}
