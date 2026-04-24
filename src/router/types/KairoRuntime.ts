import { Disposable } from "./Disposable";
import { IdRegistry } from "./IdRegistry";
import { KairoEventMap } from "./KairoEventMap";
import { KairoSchedulerRuntime } from "./KairoSchedulerRuntime";
import { Random } from "./Random";

type AfterRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["after"]]: {
        phase: "after";
        name: K;
        payload: E["after"][K];
    };
}[keyof E["after"]];

type BeforeRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["before"]]: {
        phase: "before";
        name: K;
        payload: E["before"][K];
    };
}[keyof E["before"]];

export type RuntimeEvent<E extends KairoEventMap = KairoEventMap> =
    | AfterRuntimeEvent<E>
    | BeforeRuntimeEvent<E>;

// 環境に依存する機能を抽象化するインターフェース
export interface KairoRuntime<E extends KairoEventMap = KairoEventMap> {
    // TimeStamp の検証などに使う
    currentTick(): number;

    // アドオン間通信のための送受信機能
    send(id: string, message: string): void;
    receive(handler: (id: string, message: string) => void): Disposable;

    // 環境の読み込み完了の検知
    onReady(handler: () => void): Disposable;

    // kairoId の生成に使う
    createIdRegistry(objectiveId: string): IdRegistry;

    // kairoId の乱数生成に使う（未実装の場合はデフォルト実装を使う）
    createRandom?(): Random;

    // 環境固有のイベント
    bindEvents(handler: (ev: RuntimeEvent<E>) => void): Disposable;

    // runInterval, runTimeout の実装
    scheduler: KairoSchedulerRuntime;
}
