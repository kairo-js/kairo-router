import { SemVer, AddonProperties } from '@kairo-js/properties';
import { PlayerJoinAfterEvent } from '@minecraft/server';

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

declare const router: KairoRouter;

export { AddonActivateAfterEvent, AddonDeactivateBeforeEvent, type Disposable, KairoContext, type KairoRegistry, KairoRouter, router };
