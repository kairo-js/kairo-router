import { EventBindingSpec } from "../router/types/EventBindingSpec";
import { KairoEventMap } from "../router/types/KairoEventMap";

export const minecraftEventBinding: EventBindingSpec<KairoEventMap> = {
    after: {
        addonActivate: (_world, _handler) => {
            return {
                dispose: () => {},
            };
        },
        playerJoin: (world, handler) => {
            return world.afterEvents.playerJoin.subscribe(handler);
        },
    },

    before: {
        addonDeactivate: (_world, _handler) => {
            return {
                dispose: () => {},
            };
        },
    },
};
