import { Disposable } from "./Disposable";
import { IdRegistry } from "./IdRegistry";

// 環境に依存する機能を抽象化するインターフェース
export interface KairoRuntime {
    // TimeStamp の検証などに使う
    currentTick(): number;

    // アドオン間通信のための送受信機能
    send(id: string, message: string): void;
    subscribe(handler: (id: string, message: string) => void): Disposable;

    // kairoId の生成に使う
    createIdRegistry(objectiveId: string): IdRegistry;
}
