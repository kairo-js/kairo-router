import { KairoAddonProperties, SemVer } from "../constants/properties";
import { Kairo } from "./Kairo";
export interface AddonProperty {
    id: string;
    name: string;
    description: string;
    sessionId: string;
    version: SemVer;
    dependencies: {
        module_name: string;
        version: string;
    }[];
    requiredAddons: {
        [name: string]: string;
    };
    tags: string[];
}
export declare class AddonPropertyManager {
    private readonly kairo;
    private self;
    private readonly charset;
    private constructor();
    static create(kairo: Kairo, properties: KairoAddonProperties): AddonPropertyManager;
    getSelfAddonProperty(): AddonProperty;
    refreshSessionId(): void;
}
