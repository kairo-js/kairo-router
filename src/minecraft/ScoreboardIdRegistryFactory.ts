import { IdRegistry } from "../router/types/IdRegistry";
import { IdRegistryFactory } from "../router/types/IdRegistryFactory";
import { ScoreboardIdRegistry } from "./ScoreboardIdRegistry";

export class ScoreboardIdRegistryFactory implements IdRegistryFactory {
    create(objectiveId: string): IdRegistry {
        return new ScoreboardIdRegistry(objectiveId);
    }
}
