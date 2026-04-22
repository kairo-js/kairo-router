import { AddonActivateAfterEvent } from "../events/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/AddonDeactivateBeforeEvent";
import { PlayerJoinAfterEv } from "../events/PlayerJoinAfterEv";

export interface KairoEventMap {
    after: {
        addonActivate: AddonActivateAfterEvent;
        playerJoin: PlayerJoinAfterEv;
    };
    before: {
        addonDeactivate: AddonDeactivateBeforeEvent;
    };
}
