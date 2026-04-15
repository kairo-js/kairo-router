/** @public */
declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
}

/** @public */
interface AddonProperties {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
}
/** @public */
interface AddonMetadata {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
}
/** @public */
interface AddonHeader {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
}
/** @public */
interface SemVer {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
}
/** @public */
interface EngineVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}
/** @public */
interface ManifestDependency {
    readonly module_name: MinecraftModule;
    readonly version: string;
}
/** @public */
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
/** @public */
interface RequiredAddons {
    readonly [addonId: string]: string;
}

/** @public */
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

declare class MutableKairoContextState {
    kairoId?: string;
    kairoRegistry?: KairoRegistry;
}
/** @public */
declare class KairoContext {
    /** @internal */
    private readonly _state;
    /** @internal */
    private readonly _properties;
    constructor(
    /** @internal */
    _state: MutableKairoContextState, 
    /** @internal */
    _properties: AddonProperties);
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

interface KairoRuntime {
    currentTick(): number;
    send(id: string, message: string): void;
    subscribe(handler: (id: string, message: string) => void): Disposable;
    createIdRegistry(objectiveId: string): IdRegistry;
}

type RuntimeOption = KairoRuntime | "minecraft";
declare class KairoRouter {
    /** @internal */
    private kairoContext?;
    /** @internal */
    private runtime?;
    constructor();
    init(properties: AddonProperties, options?: {
        runtime?: RuntimeOption;
    }): Promise<void>;
    getKairoContext(): KairoContext;
}

/** @public */
declare const router: KairoRouter;

export { type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoContext, type KairoRegistry, KairoRouter, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
