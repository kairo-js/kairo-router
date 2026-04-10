import { AddonProperties } from "../../../types/AddonProperties";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { AddonData } from "./dataBuilder/types";

// kjs-router-ch 0202
export class RegistrationDataBuilder {
    public constructor(manager: AddonRegistrationManager) {}

    public build(addonId: string, properties: AddonProperties): AddonData {
        return {};
    }
}
