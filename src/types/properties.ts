export interface AddonProperties {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
}

export interface AddonMetadata {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
}

export interface AddonHeader {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
}

export interface SemVer {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
}

export interface EngineVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}

export interface ManifestDependency {
    readonly module_name: MinecraftModule;
    readonly version: string;
}

export enum MinecraftModule {
    Server = "@minecraft/server",
    ServerUi = "@minecraft/server-ui",
    ServerGameTest = "@minecraft/server-gametest",
    ServerEditor = "@minecraft/server-editor",
    ServerEditorPrivateBindings = "@minecraft/server-editor-private-bindings",
    ServerNet = "@minecraft/server-net",
    ServerAdmin = "@minecraft/server-admin",
    DebugUtilities = "@minecraft/debug-utilities",
    Diagnostics = "@minecraft/diagnostics",
    ServerGraphics = "@minecraft/server-graphics",
}

export interface RequiredAddons {
    readonly [addonId: string]: string;
}

export enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental",
}
