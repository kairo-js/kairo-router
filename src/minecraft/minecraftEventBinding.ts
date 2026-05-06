import { EventBindingSpec } from "../router/events/types/EventBindingSpec";
import { KairoEventMap } from "../router/events/types/KairoEventMap";

export const minecraftEventBinding: EventBindingSpec<KairoEventMap> = {
    after: {
        addonActivate: (_world, _handler) => ({ dispose: () => {} }),
        playerJoin: (world, handler) => world.afterEvents.playerJoin.subscribe(handler),
    },
    before: {
        addonDeactivate: (_world, _handler) => ({ dispose: () => {} }),
    },
};
