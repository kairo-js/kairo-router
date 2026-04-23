import { KairoSchedulerRuntime } from "./types/KairoSchedulerRuntime";

export class KairoScheduler {
    private active = false;
    private tasks = new Map<number, "interval" | "timeout">();

    constructor(private runtime: KairoSchedulerRuntime) {}

    setActive(state: boolean) {
        this.active = state;

        if (!state) {
            this.tasks.forEach((_, id) => {
                this.runtime.clearRun(id);
            });
            this.tasks.clear();
        }
    }

    runInterval(cb: () => void, tick?: number): number {
        if (!this.active) {
            throw new Error("Scheduler is inactive");
        }

        const id = this.runtime.runInterval(cb, tick);
        this.tasks.set(id, "interval");
        return id;
    }

    runTimeout(cb: () => void, tick?: number): number {
        if (!this.active) {
            throw new Error("Scheduler is inactive");
        }

        const id = this.runtime.runTimeout(cb, tick);
        this.tasks.set(id, "timeout");
        return id;
    }

    clearRun(id: number): void {
        this.runtime.clearRun(id);
        this.tasks.delete(id);
    }
}
