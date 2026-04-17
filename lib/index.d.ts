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
    isRegistered(): boolean;
}

interface Disposable {
    dispose(): void;
}

interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}

interface Random {
    next(): number;
}

interface KairoRuntime {
    currentTick(): number;
    send(id: string, message: string): void;
    receive(handler: (id: string, message: string) => void): Disposable;
    onReady(handler: () => void): Disposable;
    createIdRegistry(objectiveId: string): IdRegistry;
    createRandom?(): Random;
}

type RuntimeOption = KairoRuntime | "minecraft";
declare class KairoRouter {
    private constructor();
    init(properties: AddonProperties, options?: {
        runtime?: RuntimeOption;
    }): Promise<void>;
    getKairoContext(): KairoContext;
}

declare const router: KairoRouter;

export { type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoContext, type KairoRegistry, KairoRouter, type KairoRuntime, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
