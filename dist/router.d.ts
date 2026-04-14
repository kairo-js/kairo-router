/** @public */
export declare interface AddonHeader {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
}

/** @public */
export declare interface AddonMetadata {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
}

/** @public */
export declare interface AddonProperties {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
}

/** @public */
export declare interface EngineVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}

/** @public */
export declare class KairoContext {
    /** @internal */
    private readonly _state;
    /** @internal */
    private readonly _properties;
    private constructor();
    get addonProperties(): AddonProperties;
    get kairoId(): string;
    get kairoRegistry(): KairoRegistry;
    isRegistered(): boolean;
}

/** @public */
export declare interface KairoRegistry {
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

/** @public */
export declare class KairoRouter {
    /** @internal */
    private readonly createInitializer;
    /** @internal */
    private _context?;
    /** @internal */
    private initializer;
    private constructor();
    init(properties: AddonProperties): void;
    get context(): KairoContext;
}

/** @public */
export declare interface ManifestDependency {
    readonly module_name: MinecraftModule;
    readonly version: string;
}

/** @public */
export declare enum MinecraftModule {
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
export declare interface RequiredAddons {
    readonly [addonId: string]: string;
}

/** @public */
export declare const router: KairoRouter;

/** @public */
export declare interface SemVer {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
}

/** @public */
export declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
}

export { }
