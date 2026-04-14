import { world } from "@minecraft/server";
import { IdRegistry } from "../types/IdRegistryFactory";

export class ScoreboardIdRegistry implements IdRegistry {
    constructor(private readonly objectiveId: string) {}

    private get objective() {
        const obj = world.scoreboard.getObjective(this.objectiveId);
        if (!obj) {
            throw new Error(`Objective not found: ${this.objectiveId}`);
        }
        return obj;
    }

    has(id: string): boolean {
        return this.objective.hasParticipant(id);
    }

    register(id: string): void {
        this.objective.setScore(id, 0);
    }
}
