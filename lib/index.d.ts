import { Vector3, Player, ScoreboardObjective } from '@minecraft/server';

type SemVer = {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
};
type EngineVersion = [number, number, number];
type ManifestDependency = {
    readonly module_name: "@minecraft/server" | "@minecraft/server-ui";
    readonly version: string;
};
type AddonHeader = {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
};
type AddonMetadata = {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
};
type RequiredAddons = {
    readonly [addonId: string]: string;
};
type SupportedTag = "official" | "approved" | "stable" | "experimental";
type KairoAddonProperties = {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
};

interface AddonProperty {
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

interface KairoCommand {
    sourceAddonId: string;
    commandId: string;
    commandType: string;
    data: Record<string, any>;
}
interface KairoResponse extends KairoCommand {
    success: boolean;
    errorMessage?: string;
}
type AllowedDynamicValue = boolean | number | string | Vector3 | null;
type PlayerKairoState = string & {
    __brand: "PlayerKairoState";
};
interface PlayerKairoDataDTO {
    playerId: string;
    joinOrder: number;
    states: PlayerKairoState[];
}
declare class KairoUtils {
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

type ActivateHandler = () => void | Promise<void>;
type DeactivateHandler = () => void | Promise<void>;
type ScriptEventListener = (data: KairoCommand) => void | Promise<void>;
type ScriptEventCommandHandler = (data: KairoCommand) => Promise<void | KairoResponse>;
type TickHandler = () => void | Promise<void>;
type HandlerOptions = {
    priority?: number;
};
type Assignable<T> = T | {
    run: T;
    options?: HandlerOptions;
};
declare class Kairo {
    private readonly properties;
    private static instance;
    private initialized;
    private readonly addonManager;
    private readonly addonPropertyManager;
    private readonly addonInitializer;
    private static _initHooks;
    private static _deinitHooks;
    private static _commandHandler?;
    private static _seHooks;
    private static _tickHooks;
    private static _tickIntervalId;
    private static _tickEnabled;
    private constructor();
    private static getInstance;
    static init(properties: KairoAddonProperties): void;
    getProperties(): KairoAddonProperties;
    getSelfAddonProperty(): AddonProperty;
    refreshSessionId(): void;
    subscribeReceiverHooks(): void;
    static unsubscribeInitializeHooks(): void;
    static set onActivate(val: Assignable<ActivateHandler>);
    static set onDeactivate(val: Assignable<DeactivateHandler>);
    static set onScriptEvent(val: ScriptEventCommandHandler);
    static set onTick(fn: TickHandler);
    static addActivate(fn: ActivateHandler, opt?: HandlerOptions): void;
    static addDeactivate(fn: DeactivateHandler, opt?: HandlerOptions): void;
    static addScriptEvent(fn: ScriptEventListener, opt?: HandlerOptions): void;
    static addTick(fn: TickHandler, opt?: HandlerOptions): void;
    _scriptEvent(data: KairoCommand): Promise<void | KairoResponse>;
    _activateAddon(): Promise<void>;
    _deactivateAddon(): Promise<void>;
    private static _pushSorted;
    private static _runActivateHooks;
    private static _runDeactivateHooks;
    private static _runScriptEvent;
    private static _runTick;
    private static _enableTick;
    private static _disableTick;
}

declare enum ConsoleTimeFormat {
    TimeOnly = "time",
    DateTime = "datetime",
    None = "none"
}
declare class ConsoleManager {
    private static readonly JST_OFFSET_MS;
    private static properties;
    static init(properties: KairoAddonProperties): void;
    private static requireInitialized;
    private static getJstDate;
    private static pad;
    private static formatTime;
    private static buildPrefix;
    static log(message: string, timeFormat?: ConsoleTimeFormat): void;
    static warn(message: string, timeFormat?: ConsoleTimeFormat): void;
    static error(message: string, timeFormat?: ConsoleTimeFormat): void;
}

declare class ErrorManager {
    static showErrorDetails(player: Player, errorId: string): Promise<void>;
}

declare class ScoreboardManager {
    static ensureObjective(objectiveId: string): ScoreboardObjective;
}

export { type AllowedDynamicValue, ConsoleManager, ErrorManager, Kairo, type KairoAddonProperties, type KairoCommand, type KairoResponse, KairoUtils, ScoreboardManager };
