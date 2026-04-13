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
declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
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
    private readonly _properties;
    private _kairoId?;
    private _kairoRegistry?;
    private constructor(_properties: AddonProperties);
    get addonProperties(): AddonProperties;
    get kairoId(): string;
    set kairoId(value: string);
    get kairoRegistry(): KairoRegistry;
    set kairoRegistry(value: KairoRegistry);
    isRegistered(): boolean;
}

declare class KairoRouter {
    private _context?;
    private initializer?;
    private constructor();
    init(properties: AddonProperties): void;
    get context(): KairoContext;
    private completeInitialization;
}

declare const router: KairoRouter;

export { type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoRouter, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
