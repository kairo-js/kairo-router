import type { PlayerJoinAfterEvent } from "@minecraft/server";

import { AddonActivateAfterEvent } from "../router/events/classes/AddonActivateAfterEvent";
import { AddonDeactivateBeforeEvent } from "../router/events/classes/AddonDeactivateBeforeEvent";

export interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly playerJoin: PlayerJoinAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
    };
}
