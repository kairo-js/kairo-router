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
    readonly module_name: MinecraftModuleType;
    readonly version: string;
}
type MinecraftModuleType = "@minecraft/server" | "@minecraft/server-ui" | "@minecraft/server-gametest" | "@minecraft/server-editor" | "@minecraft/server-editor-private-bindings" | "@minecraft/server-net" | "@minecraft/server-admin" | "@minecraft/debug-utilities" | "@minecraft/diagnostics" | "@minecraft/server-graphics";
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
declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
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

declare class KairoRouter {
    readonly afterEvents: KairoAfterEvents<KairoEventMap>;
    readonly beforeEvents: KairoBeforeEvents<KairoEventMap>;
    get currentTick(): number;
    get systemInfo(): KairoContext;
    clearRun(runId: number): void;
    init(properties: AddonProperties): void;
    register(targetId: string, eventId: string, returnTypes: string, ...argsTypes: string[]): void;
    request<T = unknown>(targetId: string, eventId: string, ...args: unknown[]): Promise<void>;
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    send(targetId: string, eventId: string, ...args: unknown[]): void;
    private constructor();
}

declare const router: KairoRouter;

export { AddonActivateAfterEvent, AddonDeactivateBeforeEvent, type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoContext, type KairoRegistry, KairoRouter, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
