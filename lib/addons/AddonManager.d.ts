import type { AddonProperty } from "./AddonPropertyManager";
import type { KairoCommand, KairoResponse } from "../utils/KairoUtils";
import { Kairo } from "./Kairo";
import { KairoAddonProperties } from "../constants/properties";
export type RegistrationState = "registered" | "unregistered" | "missing_requiredAddons";
export interface AddonData {
    id: string;
    name: string;
    description: [string, string];
    isActive: boolean;
    isEditable: boolean;
    selectedVersion: string;
    activeVersion: string;
    versions: {
        [version: string]: {
            isRegistered: boolean;
            registrationState: RegistrationState;
            canInitActivate?: boolean;
            sessionId?: string;
            tags?: string[];
            dependencies?: {
                module_name: string;
                version: string;
            }[];
            requiredAddons?: {
                [name: string]: string;
            };
        };
    };
}
export declare class AddonManager {
    private readonly kairo;
    private readonly receiver;
    private _isActive;
    private constructor();
    static create(kairo: Kairo): AddonManager;
    getSelfAddonProperty(): AddonProperty;
    subscribeReceiverHooks(): void;
    _activateAddon(): void;
    _deactivateAddon(): void;
    _scriptEvent(data: KairoCommand): Promise<void | KairoResponse>;
    get isActive(): boolean;
    setActiveState(state: boolean): void;
    getProperties(): KairoAddonProperties;
}
