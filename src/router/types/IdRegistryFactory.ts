import { IdRegistry } from "./IdRegistry";

export interface IdRegistryFactory {
    create(objectiveId: string): IdRegistry;
}
