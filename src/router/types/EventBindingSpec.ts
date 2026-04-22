import { Disposable } from "./Disposable";

export type EventBindingSpec = {
    after: Record<string, (world: any, handler: (payload: any) => void) => Disposable>;
    before: Record<string, (world: any, handler: (payload: any) => void) => Disposable>;
};
