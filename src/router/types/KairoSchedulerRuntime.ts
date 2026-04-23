export interface KairoSchedulerRuntime {
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    clearRun(runId: number): void;
}
