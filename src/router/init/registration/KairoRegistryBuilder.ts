import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../types/KairoRegistry";

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
            requiredAddons: properties.requiredAddons ?? {},
            tags: properties.tags ?? [],
        };
    }
}
