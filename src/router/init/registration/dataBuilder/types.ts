import { RawMessage } from "@minecraft/server";
import { SemVer, SupportedTag } from "../../../../types/AddonProperties";

export interface AddonData {
    kairoId: string;
    addonId: string;
    name: RawMessage;
    description: RawMessage;
    version: SemVer;
    metadata: {
        authors: string[];
        url?: string;
        license?: string;
    };
    requiredAddons: {
        [addonId: string]: string;
    };
    tags: SupportedTag[];
}
