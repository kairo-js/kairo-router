import type { AddonProperties } from "@kairo-js/properties";
import type { KairoRegistry } from "../types/KairoRegistry";

export class KairoRegistryBuilder {
    build(kairoId: string, properties: AddonProperties): KairoRegistry {
        return {
            kairoId: kairoId,
            addonId: properties.id,
            name: properties.header.name,
            description: properties.header.description,
            version: properties.header.version,
            metadata: {
                authors: properties.metadata?.authors ?? [],
                url: properties.metadata?.url,
                license: properties.metadata?.license,
            },
            dependencies: properties.dependencies ?? {},
            optionalDependencies: properties.optionalDependencies ?? {},
            peerDependencies: properties.peerDependencies ?? {},
            tags: properties.tags ?? [],
        };
    }
}
