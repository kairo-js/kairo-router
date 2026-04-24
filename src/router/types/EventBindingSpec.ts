import { Disposable } from "./Disposable";
import { KairoEventMap } from "./KairoEventMap";

export type EventBindingSpec<E extends KairoEventMap = KairoEventMap> = {
    after: {
        [K in keyof E["after"]]: (world: any, handler: (payload: E["after"][K]) => void) => Disposable;
    };
    before: {
        [K in keyof E["before"]]: (world: any, handler: (payload: E["before"][K]) => void) => Disposable;
    };
};
