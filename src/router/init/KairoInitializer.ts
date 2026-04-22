import { SeedRandom } from "../../utils/SeedRandom";
import { KairoContext, KairoContextMutator } from "../KairoContext";
import { ReadyState } from "../ReadyState";
import { Disposable } from "../types/Disposable";
import { KairoRuntime } from "../types/KairoRuntime";
import { Random } from "../types/Random";
import { DiscoveryController } from "./discovery/DiscoveryController";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./errors";
import { KairoIdProvider } from "./KairoIdProvider";
import { KairoInitEventId } from "./KairoInitEventId";
import { KairoInitListener } from "./KairoInitListener";
import { KairoRegistryBuilder } from "./KairoRegistryBuilder";
import { RegistrationController } from "./registration/RegistrationController";

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
    private readonly discoveryController: DiscoveryController;
    private readonly registrationController: RegistrationController;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly context: KairoContext,
        private readonly contextMutator: KairoContextMutator,
        private readonly random: Random = new SeedRandom(),
        private readonly readyState: ReadyState,
        private readonly onCompleted?: () => void,
        private readonly onDisposed?: () => void,
    ) {
        this.idProvider = new KairoIdProvider(this.random);
        this.registryBuilder = new KairoRegistryBuilder();

        this.discoveryController = new DiscoveryController(this.idProvider);

        this.registrationController = new RegistrationController(this.registryBuilder);

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
            this.discoveryController.handleDiscoveryQuery(message, {
                runtime: this.runtime,
                context: this.context,
                contextMutator: this.contextMutator,
            });

            this.phase = InitPhase.Registration;
        } catch (error) {
            this.dispose();
            throw error;
        }
    };

    private handleRegistrationRequest = (message: string): void => {
        this.assertPhase(InitPhase.Registration);

        try {
            const registry = this.registrationController.handleRegistrationRequest(message, {
                runtime: this.runtime,
                context: this.context,
                contextMutator: this.contextMutator,
            });

            if (!registry) {
                this.dispose();
                return;
            }

            this.phase = InitPhase.Completed;
            this.dispose();
            this.onCompleted?.();
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
