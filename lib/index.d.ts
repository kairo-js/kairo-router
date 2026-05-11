import { SemVer, AddonProperties } from '@kairo-js/properties';
import { PlayerJoinAfterEvent } from '@minecraft/server';
import { Random } from '@kairo-js/utils';

declare class AddonActivateAfterEvent {
    private constructor();
}

declare class AddonDeactivateBeforeEvent {
    private constructor();
}

interface KairoEventMap {
    readonly after: {
        readonly addonActivate: AddonActivateAfterEvent;
        readonly playerJoin: PlayerJoinAfterEvent;
    };
    readonly before: {
        readonly addonDeactivate: AddonDeactivateBeforeEvent;
    };
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
    readonly playerJoin: Subscribable<E["after"]["playerJoin"]>;
    private constructor();
}

declare class KairoBeforeEvents<E extends KairoEventMap> {
    readonly addonDeactivate: Subscribable<E["before"]["addonDeactivate"]>;
    private constructor();
}

interface KairoRegistry {
    kairoId: string;
    addonId: string;
    name: string;
    description: string;
    version: SemVer;
    metadata: {
        authors: string[];
        url?: string;
        license?: string;
    };
    requiredAddons: {
        [addonId: string]: string;
    };
    tags: string[];
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

declare class KairoRouter {
    readonly afterEvents: KairoAfterEvents<KairoEventMap>;
    readonly beforeEvents: KairoBeforeEvents<KairoEventMap>;
    get currentTick(): number;
    get systemInfo(): KairoContext;
    clearRun(runId: number): void;
    init(properties: AddonProperties): void;
    waitForWorldLoad(): Promise<void>;
    register(targetId: string, eventId: string, returnTypes: string, ...argsTypes: string[]): void;
    request<T = unknown>(targetId: string, eventId: string, ...args: unknown[]): Promise<void>;
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    send(targetId: string, eventId: string, ...args: unknown[]): void;
    private constructor();
}

interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}

interface KairoSchedulerRuntime {
    runInterval(callback: () => void, tickInterval?: number): number;
    runTimeout(callback: () => void, tickDelay?: number): number;
    clearRun(runId: number): void;
}

type AfterRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["after"]]: {
        phase: "after";
        name: K;
        payload: E["after"][K];
    };
}[keyof E["after"]];
type BeforeRuntimeEvent<E extends KairoEventMap> = {
    [K in keyof E["before"]]: {
        phase: "before";
        name: K;
        payload: E["before"][K];
    };
}[keyof E["before"]];
type RuntimeEvent<E extends KairoEventMap = KairoEventMap> = AfterRuntimeEvent<E> | BeforeRuntimeEvent<E>;
declare class KairoRuntime<E extends KairoEventMap = KairoEventMap> {
    private readonly options;
    constructor(options?: {
        randomSeed?: string;
    });
    currentTick(): number;
    send(id: string, message: string): void;
    receive(handler: (id: string, message: string) => void): Disposable;
    onReady(handler: () => void): Disposable;
    createIdRegistry(objectiveId: string): IdRegistry;
    createRandom(): Random;
    bindEvents(handler: (ev: RuntimeEvent<E>) => void): Disposable;
    scheduler: KairoSchedulerRuntime;
}

declare class ReadyState {
    private ready;
    private listeners;
    isReady(): boolean;
    markReady(): void;
    onReady(listener: () => void): Disposable;
    wait(): Promise<void>;
}

declare abstract class ReadyBufferedListener<TId extends string> {
    protected readonly readyState: ReadyState;
    private readonly MAX_PENDING;
    private pendingMessages;
    private isSetup;
    constructor(readyState: ReadyState);
    setup(runtime: KairoRuntime): Disposable;
    private onEvent;
    private flush;
    protected abstract filter(id: string): id is TId;
    protected abstract handle(id: TId, message: string): void;
}

declare const router: KairoRouter;

export { AddonActivateAfterEvent, AddonDeactivateBeforeEvent, type Disposable, KairoContext, type KairoRegistry, KairoRouter, ReadyBufferedListener, ReadyState, router };
