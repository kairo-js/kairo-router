import { SemVer, AddonProperties } from '@kairo-js/properties';
import { BlockExplodeAfterEvent, ButtonPushAfterEvent, DataDrivenEntityTriggerAfterEvent, EffectAddAfterEvent, EntityDieAfterEvent, EntityHealAfterEvent, EntityHealthChangedAfterEvent, EntityHitBlockAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityItemDropAfterEvent, EntityItemPickupAfterEvent, EntityLoadAfterEvent, EntityRemoveAfterEvent, EntitySpawnAfterEvent, ExplosionAfterEvent, GameRuleChangeAfterEvent, ItemCompleteUseAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStartUseOnAfterEvent, ItemStopUseAfterEvent, ItemStopUseOnAfterEvent, ItemUseAfterEvent, LeverActionAfterEvent, PistonActivateAfterEvent, PlayerBreakBlockAfterEvent, PlayerButtonInputAfterEvent, PlayerDimensionChangeAfterEvent, PlayerEmoteAfterEvent, PlayerGameModeChangeAfterEvent, PlayerHotbarSelectedSlotChangeAfterEvent, PlayerInputModeChangeAfterEvent, PlayerInputPermissionCategoryChangeAfterEvent, PlayerInteractWithBlockAfterEvent, PlayerInteractWithEntityAfterEvent, PlayerInventoryItemChangeAfterEvent, PlayerJoinAfterEvent, PlayerLeaveAfterEvent, PlayerPlaceBlockAfterEvent, PlayerSpawnAfterEvent, PlayerSwingStartAfterEvent, PressurePlatePopAfterEvent, PressurePlatePushAfterEvent, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, ScriptEventCommandMessageAfterEvent, TargetBlockHitAfterEvent, TripWireTripAfterEvent, WeatherChangeAfterEvent, EffectAddBeforeEvent, EntityHealBeforeEvent, EntityItemPickupBeforeEvent, EntityRemoveBeforeEvent, ExplosionBeforeEvent, ItemUseBeforeEvent, PlayerBreakBlockBeforeEvent, PlayerGameModeChangeBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerLeaveBeforeEvent, ShutdownEvent, WeatherChangeBeforeEvent, Player, CustomCommandResult, CustomCommandRegistry, CustomCommand, CustomCommandOrigin, StartupEvent } from '@minecraft/server';

declare class AddonActivateAfterEvent {
    private constructor();
}

declare class AddonDeactivateBeforeEvent {
    private constructor();
}

interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly blockExplode: BlockExplodeAfterEvent;
        readonly buttonPush: ButtonPushAfterEvent;
        readonly dataDrivenEntityTrigger: DataDrivenEntityTriggerAfterEvent;
        readonly effectAdd: EffectAddAfterEvent;
        readonly entityDie: EntityDieAfterEvent;
        readonly entityHeal: EntityHealAfterEvent;
        readonly entityHealthChanged: EntityHealthChangedAfterEvent;
        readonly entityHitBlock: EntityHitBlockAfterEvent;
        readonly entityHitEntity: EntityHitEntityAfterEvent;
        readonly entityHurt: EntityHurtAfterEvent;
        readonly entityItemDrop: EntityItemDropAfterEvent;
        readonly entityItemPickup: EntityItemPickupAfterEvent;
        readonly entityLoad: EntityLoadAfterEvent;
        readonly entityRemove: EntityRemoveAfterEvent;
        readonly entitySpawn: EntitySpawnAfterEvent;
        readonly explosion: ExplosionAfterEvent;
        readonly gameRuleChange: GameRuleChangeAfterEvent;
        readonly itemCompleteUse: ItemCompleteUseAfterEvent;
        readonly itemReleaseUse: ItemReleaseUseAfterEvent;
        readonly itemStartUse: ItemStartUseAfterEvent;
        readonly itemStartUseOn: ItemStartUseOnAfterEvent;
        readonly itemStopUse: ItemStopUseAfterEvent;
        readonly itemStopUseOn: ItemStopUseOnAfterEvent;
        readonly itemUse: ItemUseAfterEvent;
        readonly leverAction: LeverActionAfterEvent;
        readonly pistonActivate: PistonActivateAfterEvent;
        readonly playerBreakBlock: PlayerBreakBlockAfterEvent;
        readonly playerButtonInput: PlayerButtonInputAfterEvent;
        readonly playerDimensionChange: PlayerDimensionChangeAfterEvent;
        readonly playerEmote: PlayerEmoteAfterEvent;
        readonly playerGameModeChange: PlayerGameModeChangeAfterEvent;
        readonly playerHotbarSelectedSlotChange: PlayerHotbarSelectedSlotChangeAfterEvent;
        readonly playerInputModeChange: PlayerInputModeChangeAfterEvent;
        readonly playerInputPermissionCategoryChange: PlayerInputPermissionCategoryChangeAfterEvent;
        readonly playerInteractWithBlock: PlayerInteractWithBlockAfterEvent;
        readonly playerInteractWithEntity: PlayerInteractWithEntityAfterEvent;
        readonly playerInventoryItemChange: PlayerInventoryItemChangeAfterEvent;
        readonly playerJoin: PlayerJoinAfterEvent;
        readonly playerLeave: PlayerLeaveAfterEvent;
        readonly playerPlaceBlock: PlayerPlaceBlockAfterEvent;
        readonly playerSpawn: PlayerSpawnAfterEvent;
        readonly playerSwingStart: PlayerSwingStartAfterEvent;
        readonly pressurePlatePop: PressurePlatePopAfterEvent;
        readonly pressurePlatePush: PressurePlatePushAfterEvent;
        readonly projectileHitBlock: ProjectileHitBlockAfterEvent;
        readonly projectileHitEntity: ProjectileHitEntityAfterEvent;
        readonly scriptEventReceive: ScriptEventCommandMessageAfterEvent;
        readonly targetBlockHit: TargetBlockHitAfterEvent;
        readonly tripWireTrip: TripWireTripAfterEvent;
        readonly weatherChange: WeatherChangeAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
        readonly effectAdd: EffectAddBeforeEvent;
        readonly entityHeal: EntityHealBeforeEvent;
        readonly entityItemPickup: EntityItemPickupBeforeEvent;
        readonly entityRemove: EntityRemoveBeforeEvent;
        readonly explosion: ExplosionBeforeEvent;
        readonly itemUse: ItemUseBeforeEvent;
        readonly playerBreakBlock: PlayerBreakBlockBeforeEvent;
        readonly playerGameModeChange: PlayerGameModeChangeBeforeEvent;
        readonly playerInteractWithBlock: PlayerInteractWithBlockBeforeEvent;
        readonly playerInteractWithEntity: PlayerInteractWithEntityBeforeEvent;
        readonly playerLeave: PlayerLeaveBeforeEvent;
        readonly shutdown: ShutdownEvent;
        readonly weatherChange: WeatherChangeBeforeEvent;
    };
}

declare class ApiNotFoundError extends Error {
    private constructor();
}
declare class RequestTimeoutError extends Error {
    private constructor();
}
declare class BeforeHookExecutionError extends Error {
    private constructor();
}
declare class AfterHookExecutionError extends Error {
    private constructor();
}
declare class HandlerExecutionError extends Error {
    private constructor();
}
type ProtocolStage = "ApiCall" | "ApiInvoke" | "ApiResult" | "ApiHandlerResponse";
declare class ProtocolError extends Error {
    readonly source: "local_parse" | "remote";
    readonly protocolStage?: ProtocolStage | undefined;
    readonly correlationId?: string | undefined;
    private constructor();
}
interface CanceledResult {
    readonly canceled: true;
    readonly reason: "ADDON_NOT_FOUND" | "ADDON_INACTIVE" | "ADDON_UNRESOLVED" | "CANCELED_BY_HOOK";
}

interface Disposable {
    dispose(): void;
}

interface Subscribable<T> {
    subscribe(fn: (arg: T) => void): Disposable;
    unsubscribe(fn: (arg: T) => void): void;
}

declare class KairoAfterEvents<E extends KairoEventMap> {
    readonly addonActivate: Subscribable<E["after"]["addonActivate"]>;
    readonly blockExplode: Subscribable<E["after"]["blockExplode"]>;
    readonly buttonPush: Subscribable<E["after"]["buttonPush"]>;
    readonly dataDrivenEntityTrigger: Subscribable<E["after"]["dataDrivenEntityTrigger"]>;
    readonly effectAdd: Subscribable<E["after"]["effectAdd"]>;
    readonly entityDie: Subscribable<E["after"]["entityDie"]>;
    readonly entityHeal: Subscribable<E["after"]["entityHeal"]>;
    readonly entityHealthChanged: Subscribable<E["after"]["entityHealthChanged"]>;
    readonly entityHitBlock: Subscribable<E["after"]["entityHitBlock"]>;
    readonly entityHitEntity: Subscribable<E["after"]["entityHitEntity"]>;
    readonly entityHurt: Subscribable<E["after"]["entityHurt"]>;
    readonly entityItemDrop: Subscribable<E["after"]["entityItemDrop"]>;
    readonly entityItemPickup: Subscribable<E["after"]["entityItemPickup"]>;
    readonly entityLoad: Subscribable<E["after"]["entityLoad"]>;
    readonly entityRemove: Subscribable<E["after"]["entityRemove"]>;
    readonly entitySpawn: Subscribable<E["after"]["entitySpawn"]>;
    readonly explosion: Subscribable<E["after"]["explosion"]>;
    readonly gameRuleChange: Subscribable<E["after"]["gameRuleChange"]>;
    readonly itemCompleteUse: Subscribable<E["after"]["itemCompleteUse"]>;
    readonly itemReleaseUse: Subscribable<E["after"]["itemReleaseUse"]>;
    readonly itemStartUse: Subscribable<E["after"]["itemStartUse"]>;
    readonly itemStartUseOn: Subscribable<E["after"]["itemStartUseOn"]>;
    readonly itemStopUse: Subscribable<E["after"]["itemStopUse"]>;
    readonly itemStopUseOn: Subscribable<E["after"]["itemStopUseOn"]>;
    readonly itemUse: Subscribable<E["after"]["itemUse"]>;
    readonly leverAction: Subscribable<E["after"]["leverAction"]>;
    readonly pistonActivate: Subscribable<E["after"]["pistonActivate"]>;
    readonly playerBreakBlock: Subscribable<E["after"]["playerBreakBlock"]>;
    readonly playerButtonInput: Subscribable<E["after"]["playerButtonInput"]>;
    readonly playerDimensionChange: Subscribable<E["after"]["playerDimensionChange"]>;
    readonly playerEmote: Subscribable<E["after"]["playerEmote"]>;
    readonly playerGameModeChange: Subscribable<E["after"]["playerGameModeChange"]>;
    readonly playerHotbarSelectedSlotChange: Subscribable<E["after"]["playerHotbarSelectedSlotChange"]>;
    readonly playerInputModeChange: Subscribable<E["after"]["playerInputModeChange"]>;
    readonly playerInputPermissionCategoryChange: Subscribable<E["after"]["playerInputPermissionCategoryChange"]>;
    readonly playerInteractWithBlock: Subscribable<E["after"]["playerInteractWithBlock"]>;
    readonly playerInteractWithEntity: Subscribable<E["after"]["playerInteractWithEntity"]>;
    readonly playerInventoryItemChange: Subscribable<E["after"]["playerInventoryItemChange"]>;
    readonly playerJoin: Subscribable<E["after"]["playerJoin"]>;
    readonly playerLeave: Subscribable<E["after"]["playerLeave"]>;
    readonly playerPlaceBlock: Subscribable<E["after"]["playerPlaceBlock"]>;
    readonly playerSpawn: Subscribable<E["after"]["playerSpawn"]>;
    readonly playerSwingStart: Subscribable<E["after"]["playerSwingStart"]>;
    readonly pressurePlatePop: Subscribable<E["after"]["pressurePlatePop"]>;
    readonly pressurePlatePush: Subscribable<E["after"]["pressurePlatePush"]>;
    readonly projectileHitBlock: Subscribable<E["after"]["projectileHitBlock"]>;
    readonly projectileHitEntity: Subscribable<E["after"]["projectileHitEntity"]>;
    readonly scriptEventReceive: Subscribable<E["after"]["scriptEventReceive"]>;
    readonly targetBlockHit: Subscribable<E["after"]["targetBlockHit"]>;
    readonly tripWireTrip: Subscribable<E["after"]["tripWireTrip"]>;
    readonly weatherChange: Subscribable<E["after"]["weatherChange"]>;
    private constructor();
}

type DeepReadonly<T> = T extends readonly (infer U)[] ? ReadonlyArray<DeepReadonly<U>> : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
interface BeforeHookContext<TArgs, TReturn> {
    args: TArgs;
    readonly callerAddonId: string;
    cancel(result?: TReturn): never;
    setRollbackData(data: unknown): void;
}
interface AfterHookContext<TArgs, TReturn> {
    readonly args: TArgs;
    result: TReturn;
    readonly callerAddonId: string;
}
interface HookRollbackContext<TArgs> {
    readonly rollbackData: unknown;
    readonly currentArgsSnapshot: DeepReadonly<TArgs>;
    readonly callerAddonId: string;
}
interface HookOptions<TArgs, TReturn> {
    priority?: number;
    modes?: ReadonlyArray<"send" | "request">;
    before?: (ctx: BeforeHookContext<TArgs, TReturn>) => Promise<void>;
    after?: (ctx: AfterHookContext<TArgs, TReturn>) => Promise<void>;
    rollback?: (ctx: HookRollbackContext<TArgs>) => Promise<TArgs | void>;
}
interface ApiHandlerContext {
    readonly callerAddonId: string;
}

interface ApiRegistration {
    register<TArgs, TReturn>(apiName: string, handler: (args: TArgs, ctx: ApiHandlerContext) => TReturn | Promise<TReturn>): void;
    hook<TArgs, TReturn>(targetAddonId: string, apiName: string, options: HookOptions<TArgs, TReturn>): void;
}

interface CommandDeclarationEntry {
    readonly name: string;
    readonly mandatoryParameters: ReadonlyArray<{
        readonly name: string;
        readonly type: string;
    }>;
    readonly optionalParameters: ReadonlyArray<{
        readonly name: string;
        readonly type: string;
    }>;
}

type KairoCommandHandler = (player: Player | undefined, ...args: any[]) => CustomCommandResult | undefined;
declare class KairoCommandRegistry {
    private readonly nativeRegistry;
    private readonly isActive;
    private readonly getAddonId;
    private readonly send;
    private sealed;
    private readonly declarations;
    constructor(nativeRegistry: CustomCommandRegistry, isActive: () => boolean, getAddonId: () => string | undefined, send: (id: string, message: string) => void);
    register(def: CustomCommand, handler: KairoCommandHandler): void;
    registerEnum(name: string, values: string[]): void;
    setupInvokeListener(receive: (handler: (id: string, message: string) => void) => Disposable): Disposable;
    seal(): void;
    getDeclarations(): CommandDeclarationEntry[];
    private assertNotSealed;
}

type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

interface AddonEventRegistration {
    on<TPayload = unknown>(emitterAddonId: string, eventName: string, handler: EventHandler<TPayload>): void;
}

declare class KairoCustomCommandRegistry {
    private constructor();
    registerCommand(customCommand: CustomCommand, callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined): void;
    registerEnum(name: string, values: string[]): void;
}

declare class KairoStartupBeforeEvent {
    readonly customCommandRegistry: KairoCustomCommandRegistry;
    readonly commands: KairoCommandRegistry;
    readonly api: ApiRegistration;
    readonly events: AddonEventRegistration;
    private constructor();
}

declare class KairoBeforeEvents<E extends KairoEventMap> {
    readonly startup: Subscribable<KairoStartupBeforeEvent>;
    readonly addonDeactivate: Subscribable<E["before"]["addonDeactivate"]>;
    readonly effectAdd: Subscribable<E["before"]["effectAdd"]>;
    readonly entityHeal: Subscribable<E["before"]["entityHeal"]>;
    readonly entityItemPickup: Subscribable<E["before"]["entityItemPickup"]>;
    readonly entityRemove: Subscribable<E["before"]["entityRemove"]>;
    readonly explosion: Subscribable<E["before"]["explosion"]>;
    readonly itemUse: Subscribable<E["before"]["itemUse"]>;
    readonly playerBreakBlock: Subscribable<E["before"]["playerBreakBlock"]>;
    readonly playerGameModeChange: Subscribable<E["before"]["playerGameModeChange"]>;
    readonly playerInteractWithBlock: Subscribable<E["before"]["playerInteractWithBlock"]>;
    readonly playerInteractWithEntity: Subscribable<E["before"]["playerInteractWithEntity"]>;
    readonly playerLeave: Subscribable<E["before"]["playerLeave"]>;
    readonly shutdown: Subscribable<E["before"]["shutdown"]>;
    readonly weatherChange: Subscribable<E["before"]["weatherChange"]>;
    private constructor();
}

type VersionRange = string;
type DependencyMap = Readonly<Record<string, VersionRange>>;
interface KairoRegistry {
    readonly kairoId: string;
    readonly addonId: string;
    readonly version: SemVer;
    readonly name: string;
    readonly description: string;
    readonly metadata: {
        readonly authors: string[];
        readonly url?: string;
        readonly license?: string;
    };
    readonly dependencies: DependencyMap;
    readonly optionalDependencies: DependencyMap;
    readonly tags: string[];
}

declare class KairoContext {
    private constructor(
);
    get addonProperties(): AddonProperties;
    get kairoId(): string;
    get kairoRegistry(): KairoRegistry;
    isActive(): boolean;
    isRegistered(): boolean;
}

interface RouterInitOptions {
    /**
     * `true`  — always attempt standalone (even with cross-addon dependencies)
     * `false` — never attempt standalone
     * `undefined` (default) — standalone only when required dependencies are limited to kairo / kairo-database
     */
    standalone?: boolean;
}
declare class KairoRouter {
    readonly afterEvents: KairoAfterEvents<KairoEventMap>;
    readonly beforeEvents: KairoBeforeEvents<KairoEventMap>;
    private constructor();
    get currentTick(): number;
    get systemInfo(): KairoContext;
    clearRun(runId: number): void;
    getAddonId(): string | undefined;
    getKairoId(): string | undefined;
    onceRegistered(callback: (kairoId: string) => void): void;
    send(targetAddonId: string, apiName: string, args?: unknown): void;
    request<TReturn>(targetAddonId: string, apiName: string, args?: unknown, options?: {
        timeout?: number;
    }): Promise<TReturn | CanceledResult>;
    emit(eventName: string, payload?: unknown): void;
    save(key: string, value: unknown): Promise<void>;
    load<T = unknown>(key: string, options?: {
        addonId?: string;
    }): Promise<T | undefined>;
    delete(key: string): Promise<void>;
    has(key: string, options?: {
        addonId?: string;
    }): Promise<boolean>;
    init(properties: AddonProperties, options?: RouterInitOptions): void;
    waitForWorldLoad(): Promise<void>;
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
}

declare const router: KairoRouter;

export { AddonActivateAfterEvent, AddonDeactivateBeforeEvent, type AddonEventRegistration, type AfterHookContext, AfterHookExecutionError, type ApiHandlerContext, ApiNotFoundError, type ApiRegistration, type BeforeHookContext, BeforeHookExecutionError, type CanceledResult, type DeepReadonly, type Disposable, HandlerExecutionError, type HookOptions, type HookRollbackContext, type KairoCommandHandler, KairoCommandRegistry, KairoContext, KairoCustomCommandRegistry, type KairoRegistry, KairoRouter, KairoStartupBeforeEvent, ProtocolError, type ProtocolStage, RequestTimeoutError, type RouterInitOptions, router };
