export type SemVer = {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
};
export type UUID = string;
export type EngineVersion = [number, number, number];
export type ManifestDependency = {
    readonly module_name: string;
    readonly version: string;
};
export type ScriptModule = {
    readonly type: "script";
    readonly language: "javascript";
    readonly entry: string;
    readonly version: "header.version" | string;
    readonly uuid: UUID;
};
export type ResourcePack = {
    readonly name: string;
    readonly description: string;
    readonly uuid: UUID;
    readonly module_uuid: UUID;
};
export type AddonHeader = {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
    readonly uuid: UUID;
};
export type AddonMetadata = {
    readonly authors: string[];
};
export type RequiredAddons = {
    readonly [addonId: string]: string;
};
export type SupportedTag = "official" | "approved" | "stable" | "experimental";
export type KairoAddonProperties = {
    readonly id: string;
    readonly metadata: AddonMetadata;
    readonly header: AddonHeader;
    readonly resourcepack: ResourcePack;
    readonly modules: ScriptModule[];
    readonly dependencies: ManifestDependency[];
    readonly requiredAddons: RequiredAddons;
    readonly tags: SupportedTag[];
};
