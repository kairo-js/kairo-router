import { AddonProperties } from "../../../types/AddonProperties";
import { KairoRegistry } from "../../../types/KairoRegistry";

export class KairoRegistryBuilder {
    public build(kairoId: string, props: AddonProperties): KairoRegistry {
        return {
            kairoId: kairoId,
            addonId: props.id,
            name: props.header.name,
            description: props.header.description,
            version: props.header.version,
            metadata: {
                authors: props.metadata?.authors ?? [],
                url: props.metadata?.url,
                license: props.metadata?.license,
            },
            requiredAddons: props.requiredAddons ?? {},
            tags: props.tags ?? [],
        };
    }
}
