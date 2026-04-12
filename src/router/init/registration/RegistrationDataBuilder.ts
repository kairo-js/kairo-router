import { AddonProperties } from "../../../types/AddonProperties";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { AddonData } from "./dataBuilder/types";

// kjs-router-ch 0202
export class RegistrationDataBuilder {
    public constructor(manager: AddonRegistrationManager) {}

    public build(kairoId: string, properties: AddonProperties): AddonData {
        return {
            kairoId,
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
