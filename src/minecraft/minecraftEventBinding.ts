import { EventBindingSpec } from "../router/types/EventBindingSpec";

export const minecraftEventBinding: EventBindingSpec = {
    after: {
        playerJoin: (world, handler) => {
            return world.afterEvents.playerJoin.subscribe(handler);
        }
    },

    before: {},
};
