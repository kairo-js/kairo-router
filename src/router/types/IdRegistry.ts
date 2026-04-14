// KairoID管理のためのインターフェース
export interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}
