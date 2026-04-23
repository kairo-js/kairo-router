import { AddonActivateAfterEvent } from "../events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/classes/AddonDeactivateBeforeEvent";
import { PlayerJoinAfterEv } from "../events/classes/PlayerJoinAfterEv";

export interface KairoEventMap {
    after: {
        addonActivate: AddonActivateAfterEvent;
        playerJoin: PlayerJoinAfterEv;
    };
    before: {
        addonDeactivate: AddonDeactivateBeforeEvent;
    };
}
