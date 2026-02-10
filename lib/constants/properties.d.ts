export type SemVer = {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
};
export type EngineVersion = [number, number, number];
export type ManifestDependency = {
    readonly module_name: "@minecraft/server" | "@minecraft/server-ui";
    readonly version: string;
};
export type AddonHeader = {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
};
export type AddonMetadata = {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
};
export type RequiredAddons = {
    readonly [addonId: string]: string;
};
export type SupportedTag = "official" | "approved" | "stable" | "experimental";
export type KairoAddonProperties = {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
};
