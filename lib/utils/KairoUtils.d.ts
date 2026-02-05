import { KairoAddonProperties } from "../constants/properties";
import { Vector3 } from "@minecraft/server";
export interface KairoCommand {
    sourceAddonId: string;
    commandId: string;
    commandType: string;
    data: Record<string, any>;
}
export interface KairoResponse extends KairoCommand {
    success: boolean;
    errorMessage?: string;
}
export type AllowedDynamicValue = boolean | number | string | Vector3 | null;
export type PlayerKairoState = string & {
    __brand: "PlayerKairoState";
};
export interface PlayerKairoDataDTO {
    playerId: string;
    joinOrder: number;
    states: PlayerKairoState[];
}
export declare class KairoUtils {
    private static properties;
    private static pendingRequests;
    static init(properties: KairoAddonProperties): void;
    private static requireInitialized;
    static sendKairoCommand(targetAddonId: string, commandType: string, data?: Record<string, any>, timeoutTicks?: number): Promise<void>;
    static sendKairoCommandAndWaitResponse(targetAddonId: string, commandType: string, data?: Record<string, any>, timeoutTicks?: number): Promise<KairoResponse>;
    static buildKairoResponse(data?: Record<string, any>, success?: boolean, errorMessage?: string): KairoResponse;
    private static readonly charset;
    static generateRandomId(length?: number): string;
    static getPlayerKairoData(playerId: string): Promise<PlayerKairoDataDTO>;
    static getPlayersKairoData(): Promise<PlayerKairoDataDTO[]>;
    static saveToDataVault(key: string, value: AllowedDynamicValue): Promise<void>;
    static loadFromDataVault(key: string): Promise<AllowedDynamicValue>;
    static resolvePendingRequest(commandId: string, response?: KairoResponse): void;
    static rejectPendingRequest(commandId: string, error?: unknown): void;
    private static sendInternal;
    private static lastTick;
    static onTick(): void;
    static isRawMessage(value: unknown): boolean;
    private static isVector3;
}
