import { AddonActivateAfterEvent } from "../classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../classes/AddonDeactivateBeforeEvent";
import { KairoPlayerJoinAfterEvent } from "../classes/KairoPlayerJoinAfterEvent";

export interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly playerJoin: KairoPlayerJoinAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
    };
}
