import { asSubscribable } from "../types/Subscribable";
import { EventRegistry } from "./EventRegistry";
import { KairoEventMap } from "./types/KairoEventMap";

export class KairoAfterEvents<E extends KairoEventMap> {
    readonly addonActivate;
    readonly playerJoin;
    constructor(private readonly registry: EventRegistry<E>) {
        this.addonActivate = asSubscribable(this.registry.getAfter("addonActivate"));
        this.playerJoin = asSubscribable(this.registry.getAfter("playerJoin"));
    }
}
