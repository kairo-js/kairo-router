import { SeedRandom } from "../../utils/SeedRandom";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { ReadyState } from "../ReadyState";
import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { Random } from "../types/Random";
import { AddonDiscoveryManager } from "./discovery/AddonDiscoveryManager";
import { DiscoveryResponder } from "./discovery/DiscoveryResponder";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./errors";
import { KairoIdProvider } from "./KairoIdProvider";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { AddonRegistrationManager } from "./registration/AddonRegistrationManager";
import { RegistrationResponder } from "./registration/RegistrationResponder";

enum InitPhase {
    Discovery,
    Registration,
    Completed,
    Disposed,
}

// kjs-router-ch 0010
export class KairoInitializer implements Disposable {
    private subscription?: Disposable;
    private phase = InitPhase.Discovery;

    private readonly idProvider: KairoIdProvider;
    private readonly registryBuilder: KairoRegistryBuilder;

    private readonly initListener: KairoInitListener;
    private readonly discoveryManager: AddonDiscoveryManager;
    private readonly discoveryResponder: DiscoveryResponder;
    private readonly registrationManager: AddonRegistrationManager;
    private readonly registrationResponder: RegistrationResponder;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly random: Random = new SeedRandom(),
        private readonly readyState: ReadyState,
        private readonly onDisposed?: () => void,
    ) {
        this.idProvider = new KairoIdProvider(this.random);
        this.registryBuilder = new KairoRegistryBuilder();

        this.discoveryManager = new AddonDiscoveryManager(this.idProvider);
        this.discoveryResponder = new DiscoveryResponder();

        this.registrationManager = new AddonRegistrationManager(this.registryBuilder);
        this.registrationResponder = new RegistrationResponder();

        this.initListener = new KairoInitListener(this.readyState, {
            [KairoInitEventId.DiscoveryQuery]: this.handleDiscoveryQuery,
            [KairoInitEventId.RegistrationRequest]: this.handleRegistrationRequest,
        });
    }

    setup(): void {
        this.assertNotDisposed();
        this.subscription = this.initListener.setup(this.runtime);
    }

    dispose(): void {
        if (this.phase === InitPhase.Disposed) return;

        this.phase = InitPhase.Disposed;

        this.subscription?.dispose();
        this.subscription = undefined;

        try {
            this.onDisposed?.();
        } catch {}
    }

    private handleDiscoveryQuery = (message: string): void => {
        this.assertPhase(InitPhase.Discovery);

        try {
            const kairoId = this.discoveryManager.resolveKairoId(
                message,
                this.runtime,
                this.context.addonProperties.id,
            );

            this.discoveryResponder.respond(this.runtime, kairoId);
            this.contextMutator.setKairoId(kairoId);

            this.phase = InitPhase.Registration;
        } catch (error) {
            this.dispose();
            throw error;
        }
    };

    private handleRegistrationRequest = (message: string): void => {
        this.assertPhase(InitPhase.Registration);

        try {
            const registry = this.registrationManager.resolveRegistry(
                message,
                this.runtime.currentTick(),
                this.context.kairoId,
                this.context.addonProperties,
            );

            if (!registry) {
                this.dispose();
                return;
            }

            this.registrationResponder.respond(this.runtime, registry);
            this.contextMutator.setKairoRegistry(registry);

            this.phase = InitPhase.Completed;
            this.dispose();
        } catch (error) {
            this.dispose();
            throw error;
        }
    };

    private assertNotDisposed(): void {
        if (this.phase === InitPhase.Disposed) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.AlreadyDisposed);
        }
    }

    private assertPhase(expected: InitPhase): void {
        if (this.phase !== expected) {
            throw new KairoRouterInitError(KairoRouterInitErrorReason.InvalidPhase);
        }
    }
}
