declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
}

interface AddonProperties {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
}
interface AddonMetadata {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
}
interface AddonHeader {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
}
interface SemVer {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
}
interface EngineVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}
interface ManifestDependency {
    readonly module_name: MinecraftModule;
    readonly version: string;
}
declare enum MinecraftModule {
    Server = "@minecraft/server",
    ServerUi = "@minecraft/server-ui",
    ServerGameTest = "@minecraft/server-gametest",
    ServerEditor = "@minecraft/server-editor",
    ServerEditorPrivateBindings = "@minecraft/server-editor-private-bindings",
    ServerNet = "@minecraft/server-net",
    ServerAdmin = "@minecraft/server-admin",
    DebugUtilities = "@minecraft/debug-utilities",
    Diagnostics = "@minecraft/diagnostics",
    ServerGraphics = "@minecraft/server-graphics"
}
interface RequiredAddons {
    readonly [addonId: string]: string;
}

interface Disposable {
    dispose(): void;
}

interface Subscribable<T> {
    subscribe(fn: (arg: T) => void): Disposable;
    unsubscribe(fn: (arg: T) => void): void;
}

declare class AddonActivateAfterEvent {
    private constructor();
}

declare class AddonDeactivateBeforeEvent {
    private constructor();
}

/**
 * Minecraft PlayerJoinAfterEvent
 * https://learn.microsoft.com/ja-jp/minecraft/creator/scriptapi/minecraft/server/playerjoinafterevent?view=minecraft-bedrock-stable
 */
interface KairoPlayerJoinAfterEvent {
    readonly playerId: string;
    readonly playerName: string;
}

interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly playerJoin: KairoPlayerJoinAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
    };
}

declare class KairoAfterEvents<E extends KairoEventMap> {
    readonly addonActivate: Subscribable<E["after"]["addonActivate"]>;
    readonly playerJoin: Subscribable<E["after"]["playerJoin"]>;
    private constructor();
}

declare class KairoBeforeEvents<E extends KairoEventMap> {
    readonly addonDeactivate: Subscribable<E["before"]["addonDeactivate"]>;
    private constructor();
}

interface KairoRegistry {
    kairoId: string;
    addonId: string;
    name: string;
    description: string;
    version: SemVer;
    metadata: {
        authors: string[];
        url?: string;
        license?: string;
    };
    requiredAddons: {
        [addonId: string]: string;
    };
    tags: SupportedTag[];
}

declare class KairoContext {
    private constructor(
);
    get addonProperties(): AddonProperties;
    get kairoId(): string;
    get kairoRegistry(): KairoRegistry;
    isActive(): boolean;
    isRegistered(): boolean;
}

interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}

interface KairoSchedulerRuntime {
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    clearRun(runId: number): void;
}

interface Random {
    next(): number;
}

type AfterRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["after"]]: {
        phase: "after";
        name: K;
        payload: E["after"][K];
    };
}[keyof E["after"]];
type BeforeRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["before"]]: {
        phase: "before";
        name: K;
        payload: E["before"][K];
    };
}[keyof E["before"]];
type RuntimeEvent<E extends KairoEventMap = KairoEventMap> = AfterRuntimeEvent<E> | BeforeRuntimeEvent<E>;
interface KairoRuntime<E extends KairoEventMap = KairoEventMap> {
    currentTick(): number;
    send(id: string, message: string): void;
    receive(handler: (id: string, message: string) => void): Disposable;
    onReady(handler: () => void): Disposable;
    createIdRegistry(objectiveId: string): IdRegistry;
    createRandom?(): Random;
    bindEvents(handler: (ev: RuntimeEvent<E>) => void): Disposable;
    scheduler: KairoSchedulerRuntime;
}

type RuntimeOption = KairoRuntime<KairoEventMap> | "minecraft";
declare class KairoRouter {
    readonly afterEvents: KairoAfterEvents<KairoEventMap>;
    readonly beforeEvents: KairoBeforeEvents<KairoEventMap>;
    init(properties: AddonProperties, options?: {
        runtime?: RuntimeOption;
    }): void;
    get systemInfo(): KairoContext;
    get currentTick(): number;
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    clearRun(runId: number): void;
    private constructor();
}

declare const router: KairoRouter;

export { AddonActivateAfterEvent, AddonDeactivateBeforeEvent, type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoContext, type KairoRegistry, KairoRouter, type KairoRuntime, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
