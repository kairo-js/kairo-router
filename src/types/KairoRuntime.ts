import { Disposable } from "./Disposable";

// 通信専用のランタイムインターフェース
export interface KairoRuntime {
    currentTick(): number;
    send(id: string, message: string): void;
    subscribe(handler: (id: string, message: string) => void): Disposable;
}
