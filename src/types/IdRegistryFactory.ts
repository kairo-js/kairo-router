// KairoID管理のためのインターフェース
export interface IdRegistryFactory {
    create(objectiveId: string): IdRegistry;
}

export interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}
