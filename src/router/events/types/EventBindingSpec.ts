import { Disposable } from "../../types/Disposable";
import type { KairoEventMap } from "../../../minecraft/KairoEventMap";

export type EventBindingSpec<E extends KairoEventMap = KairoEventMap> = {
    after: {
        [K in keyof E["after"]]: (
            world: any,
            handler: (payload: E["after"][K]) => void,
        ) => Disposable;
    };
    before: {
        [K in keyof E["before"]]: (
            world: any,
            handler: (payload: E["before"][K]) => void,
        ) => Disposable;
    };
};
