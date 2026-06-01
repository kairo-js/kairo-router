import type {
    BlockExplodeAfterEvent,
    ButtonPushAfterEvent,
    DataDrivenEntityTriggerAfterEvent,
    EffectAddAfterEvent,
    EffectAddBeforeEvent,
    EntityDieAfterEvent,
    EntityHealthChangedAfterEvent,
    EntityHitBlockAfterEvent,
    EntityHitEntityAfterEvent,
    EntityHealAfterEvent,
    EntityHealBeforeEvent,
    EntityHurtAfterEvent,
    EntityItemDropAfterEvent,
    EntityItemPickupAfterEvent,
    EntityItemPickupBeforeEvent,
    EntityLoadAfterEvent,
    EntityRemoveAfterEvent,
    EntityRemoveBeforeEvent,
    EntitySpawnAfterEvent,
    ExplosionAfterEvent,
    ExplosionBeforeEvent,
    GameRuleChangeAfterEvent,
    ItemCompleteUseAfterEvent,
    ItemReleaseUseAfterEvent,
    ItemStartUseAfterEvent,
    ItemStartUseOnAfterEvent,
    ItemStopUseAfterEvent,
    ItemStopUseOnAfterEvent,
    ItemUseAfterEvent,
    ItemUseBeforeEvent,
    LeverActionAfterEvent,
    PistonActivateAfterEvent,
    PlayerBreakBlockAfterEvent,
    PlayerBreakBlockBeforeEvent,
    PlayerButtonInputAfterEvent,
    PlayerDimensionChangeAfterEvent,
    PlayerEmoteAfterEvent,
    PlayerGameModeChangeAfterEvent,
    PlayerGameModeChangeBeforeEvent,
    PlayerHotbarSelectedSlotChangeAfterEvent,
    PlayerInputModeChangeAfterEvent,
    PlayerInputPermissionCategoryChangeAfterEvent,
    PlayerInteractWithBlockAfterEvent,
    PlayerInteractWithBlockBeforeEvent,
    PlayerInteractWithEntityAfterEvent,
    PlayerInteractWithEntityBeforeEvent,
    PlayerInventoryItemChangeAfterEvent,
    PlayerJoinAfterEvent,
    PlayerLeaveAfterEvent,
    PlayerLeaveBeforeEvent,
    PlayerPlaceBlockAfterEvent,
    PlayerSpawnAfterEvent,
    PlayerSwingStartAfterEvent,
    PressurePlatePopAfterEvent,
    PressurePlatePushAfterEvent,
    ProjectileHitBlockAfterEvent,
    ProjectileHitEntityAfterEvent,
    ScriptEventCommandMessageAfterEvent,
    ShutdownEvent,
    TargetBlockHitAfterEvent,
    TripWireTripAfterEvent,
    WeatherChangeAfterEvent,
    WeatherChangeBeforeEvent,
} from "@minecraft/server";

import { AddonActivateAfterEvent } from "../router/events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../router/events/classes/AddonDeactivateBeforeEvent";

export interface KairoEventMap {
    readonly after: {
        readonly addonActivate:                          AddonActivateAfterEvent;
        readonly blockExplode:                           BlockExplodeAfterEvent;
        readonly buttonPush:                             ButtonPushAfterEvent;
        readonly dataDrivenEntityTrigger:                DataDrivenEntityTriggerAfterEvent;
        readonly effectAdd:                              EffectAddAfterEvent;
        readonly entityDie:                              EntityDieAfterEvent;
        readonly entityHeal:                             EntityHealAfterEvent;
        readonly entityHealthChanged:                    EntityHealthChangedAfterEvent;
        readonly entityHitBlock:                         EntityHitBlockAfterEvent;
        readonly entityHitEntity:                        EntityHitEntityAfterEvent;
        readonly entityHurt:                             EntityHurtAfterEvent;
        readonly entityItemDrop:                         EntityItemDropAfterEvent;
        readonly entityItemPickup:                       EntityItemPickupAfterEvent;
        readonly entityLoad:                             EntityLoadAfterEvent;
        readonly entityRemove:                           EntityRemoveAfterEvent;
        readonly entitySpawn:                            EntitySpawnAfterEvent;
        readonly explosion:                              ExplosionAfterEvent;
        readonly gameRuleChange:                         GameRuleChangeAfterEvent;
        readonly itemCompleteUse:                        ItemCompleteUseAfterEvent;
        readonly itemReleaseUse:                         ItemReleaseUseAfterEvent;
        readonly itemStartUse:                           ItemStartUseAfterEvent;
        readonly itemStartUseOn:                         ItemStartUseOnAfterEvent;
        readonly itemStopUse:                            ItemStopUseAfterEvent;
        readonly itemStopUseOn:                          ItemStopUseOnAfterEvent;
        readonly itemUse:                                ItemUseAfterEvent;
        readonly leverAction:                            LeverActionAfterEvent;
        readonly pistonActivate:                         PistonActivateAfterEvent;
        readonly playerBreakBlock:                       PlayerBreakBlockAfterEvent;
        readonly playerButtonInput:                      PlayerButtonInputAfterEvent;
        readonly playerDimensionChange:                  PlayerDimensionChangeAfterEvent;
        readonly playerEmote:                            PlayerEmoteAfterEvent;
        readonly playerGameModeChange:                   PlayerGameModeChangeAfterEvent;
        readonly playerHotbarSelectedSlotChange:         PlayerHotbarSelectedSlotChangeAfterEvent;
        readonly playerInputModeChange:                  PlayerInputModeChangeAfterEvent;
        readonly playerInputPermissionCategoryChange:    PlayerInputPermissionCategoryChangeAfterEvent;
        readonly playerInteractWithBlock:                PlayerInteractWithBlockAfterEvent;
        readonly playerInteractWithEntity:               PlayerInteractWithEntityAfterEvent;
        readonly playerInventoryItemChange:              PlayerInventoryItemChangeAfterEvent;
        readonly playerJoin:                             PlayerJoinAfterEvent;
        readonly playerLeave:                            PlayerLeaveAfterEvent;
        readonly playerPlaceBlock:                       PlayerPlaceBlockAfterEvent;
        readonly playerSpawn:                            PlayerSpawnAfterEvent;
        readonly playerSwingStart:                       PlayerSwingStartAfterEvent;
        readonly pressurePlatePop:                       PressurePlatePopAfterEvent;
        readonly pressurePlatePush:                      PressurePlatePushAfterEvent;
        readonly projectileHitBlock:                     ProjectileHitBlockAfterEvent;
        readonly projectileHitEntity:                    ProjectileHitEntityAfterEvent;
        readonly scriptEventReceive:                     ScriptEventCommandMessageAfterEvent;
        readonly targetBlockHit:                         TargetBlockHitAfterEvent;
        readonly tripWireTrip:                           TripWireTripAfterEvent;
        readonly weatherChange:                          WeatherChangeAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate:           AddonDeactivateBeforeEvent;
        readonly effectAdd:                 EffectAddBeforeEvent;
        readonly entityHeal:                EntityHealBeforeEvent;
        readonly entityItemPickup:          EntityItemPickupBeforeEvent;
        readonly entityRemove:              EntityRemoveBeforeEvent;
        readonly explosion:                 ExplosionBeforeEvent;
        readonly itemUse:                   ItemUseBeforeEvent;
        readonly playerBreakBlock:          PlayerBreakBlockBeforeEvent;
        readonly playerGameModeChange:      PlayerGameModeChangeBeforeEvent;
        readonly playerInteractWithBlock:   PlayerInteractWithBlockBeforeEvent;
        readonly playerInteractWithEntity:  PlayerInteractWithEntityBeforeEvent;
        readonly playerLeave:               PlayerLeaveBeforeEvent;
        readonly shutdown:                  ShutdownEvent;
        readonly weatherChange:             WeatherChangeBeforeEvent;
    };
}
