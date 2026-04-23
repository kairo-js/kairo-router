import { AddonActivateAfterEvent } from "../events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../events/classes/AddonDeactivateBeforeEvent";
import { KairoPlayerJoinAfterEvent } from "../events/classes/KairoPlayerJoinAfterEvent";

export interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly playerJoin: KairoPlayerJoinAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
    };
}
