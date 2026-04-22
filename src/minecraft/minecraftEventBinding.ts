import { EventBindingSpec } from "../router/types/EventBindingSpec";

export const minecraftEventBinding: EventBindingSpec = {
    after: {
        playerJoin: (world, handler: (p: any) => void) => {
            const listener = (ev: any) => {
                handler({
                    playerId: ev.playerId,
                    playerName: ev.playerName,
                });
            };

            world.afterEvents.playerJoin.subscribe(listener);

            return {
                dispose: () => world.afterEvents.playerJoin.unsubscribe(listener),
            };
        },
    },

    before: {},
};
