export interface KairoRuntime {
    readonly currentTick: number;
    send(id: string, message: string): void;
}
