import type { SemVer } from "@kairo-js/properties";

type VersionRange = string;
type DependencyMap = Readonly<Record<string, VersionRange>>;

export interface KairoRegistry {
    readonly kairoId: string;
    readonly addonId: string;
    readonly version: SemVer;
    readonly name: string;
    readonly description: string;
    readonly metadata: {
        readonly authors: string[];
        readonly url?: string;
        readonly license?: string;
    };
    readonly dependencies: DependencyMap;
    readonly optionalDependencies: DependencyMap;
    readonly peerDependencies: DependencyMap;
    readonly tags: string[];
}
