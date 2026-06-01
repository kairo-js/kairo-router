import { asSubscribable } from "../types/Subscribable";
import { EventRegistry } from "./EventRegistry";
import { InternalEvent } from "./types/InternalEvent";
import type { KairoEventMap } from "../../minecraft/KairoEventMap";
import type { KairoStartupBeforeEvent } from "./classes/KairoStartupBeforeEvent";

export class KairoBeforeEvents<E extends KairoEventMap> {
    readonly startup;
    readonly addonDeactivate;
    readonly effectAdd;
    readonly entityHeal;
    readonly entityItemPickup;
    readonly entityRemove;
    readonly explosion;
    readonly itemUse;
    readonly playerBreakBlock;
    readonly playerGameModeChange;
    readonly playerInteractWithBlock;
    readonly playerInteractWithEntity;
    readonly playerLeave;
    readonly shutdown;
    readonly weatherChange;

    constructor(
        private readonly registry: EventRegistry<E>,
        startupEvent: InternalEvent<KairoStartupBeforeEvent>,
    ) {
        this.startup              = asSubscribable(startupEvent);
        this.addonDeactivate          = asSubscribable(this.registry.getBefore("addonDeactivate"));
        this.effectAdd                = asSubscribable(this.registry.getBefore("effectAdd"));
        this.entityHeal               = asSubscribable(this.registry.getBefore("entityHeal"));
        this.entityItemPickup         = asSubscribable(this.registry.getBefore("entityItemPickup"));
        this.entityRemove             = asSubscribable(this.registry.getBefore("entityRemove"));
        this.explosion                = asSubscribable(this.registry.getBefore("explosion"));
        this.itemUse                  = asSubscribable(this.registry.getBefore("itemUse"));
        this.playerBreakBlock         = asSubscribable(this.registry.getBefore("playerBreakBlock"));
        this.playerGameModeChange     = asSubscribable(this.registry.getBefore("playerGameModeChange"));
        this.playerInteractWithBlock  = asSubscribable(this.registry.getBefore("playerInteractWithBlock"));
        this.playerInteractWithEntity = asSubscribable(this.registry.getBefore("playerInteractWithEntity"));
        this.playerLeave              = asSubscribable(this.registry.getBefore("playerLeave"));
        this.shutdown                 = asSubscribable(this.registry.getBefore("shutdown"));
        this.weatherChange            = asSubscribable(this.registry.getBefore("weatherChange"));
    }
}
