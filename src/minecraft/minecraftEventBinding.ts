import { EventBindingSpec } from "../router/types/EventBindingSpec";

export const minecraftEventBinding: EventBindingSpec = {
    after: {
        playerJoin: (world, handler: (p: any) => void) =>
            world.afterEvents.playerJoin.subscribe(handler),
    },

    before: {},
};
