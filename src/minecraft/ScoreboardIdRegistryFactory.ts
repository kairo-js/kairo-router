import { IdRegistry, IdRegistryFactory } from "../types/IdRegistryFactory";
import { ScoreboardIdRegistry } from "./ScoreboardIdRegistry";

export class ScoreboardIdRegistryFactory implements IdRegistryFactory {
    create(objectiveId: string): IdRegistry {
        return new ScoreboardIdRegistry(objectiveId);
    }
}
