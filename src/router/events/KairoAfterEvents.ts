import { KairoEventMap } from "../types/KairoEventMap";
import { asSubscribable } from "../types/Subscribable";
import { EventRegistry } from "./EventRegistry";

export class KairoAfterEvents<E extends KairoEventMap> {
    readonly addonActivate;
    readonly playerJoin;
    constructor(private readonly registry: EventRegistry<E>) {
        this.addonActivate = asSubscribable(
            this.registry.getAfter("addonActivate", {
                requireActiveOnSubscribe: false,
                clearOnDeactivate: false,
            }),
        );
        this.playerJoin = asSubscribable(this.registry.getAfter("playerJoin"));
    }
}
