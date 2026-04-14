export interface KairoRuntime {
    readonly currentTick: number;
    send(id: string, message: string): void;

    getIdRegistry(objectiveId: string): IdRegistry;
}

export interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}
