import { type Random } from "@kairo-js/utils";
import { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { KairoCommandRegistry } from "../command/KairoCommandRegistry";
import type { AddonEventRegistry } from "../event/AddonEventRegistry";
import type { KairoApiRegistry } from "../api/KairoApiRegistry";
import { ApiManifestBuilder } from "../api/ApiManifestBuilder";
import type { KairoContext, KairoContextMutator } from "../KairoContext";
import { ReadyState } from "../ReadyState";
import type { Disposable } from "../types/Disposable";
import { KairoInitEventId } from "./constants/KairoInitEventId";
import { DiscoveryController } from "./discovery/DiscoveryController";
import { KairoRouterInitError, KairoRouterInitErrorReason } from "./errors";
import { KairoIdProvider } from "./KairoIdProvider";
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
        private readonly random: Random,
        private readonly readyState: ReadyState,
        private readonly apiRegistry: KairoApiRegistry,
        private readonly eventRegistry: AddonEventRegistry,
        private readonly onCompleted?: () => void,
        private readonly onDisposed?: () => void,
        private readonly getCommandRegistry?: () => KairoCommandRegistry | undefined,
    ) {
        this.idProvider = new KairoIdProvider(this.random);
        this.registryBuilder = new KairoRegistryBuilder();

        this.discoveryController = new DiscoveryController(this.idProvider);

        this.registrationController = new RegistrationController(this.registryBuilder, this.apiRegistry);

        this.initListener = new KairoInitListener(this.readyState, {
            [KairoInitEventId.DiscoveryQuery]: this.handleDiscoveryQuery,
            [KairoInitEventId.RegistrationRequest]: this.handleRegistrationRequest,
            [KairoInitEventId.RegistrationResult]: this.handleRegistrationResult,
        });
    }

    setup(): void {
        this.assertNotDisposed();
        this.subscription = this.initListener.setup(this.runtime);
    }

    dispose(): void {
        if (this.phase === InitPhase.Disposed) return;
        if (this.phase === InitPhase.Completed) {
            this.disposeSubscription();
            return;
        }

        this.phase = InitPhase.Disposed;
        this.disposeSubscription();

        this.onDisposed?.();
    }

    private complete(): void {
        this.phase = InitPhase.Completed;
        this.disposeSubscription();

        this.onCompleted?.();
    }

    private disposeSubscription(): void {
        this.subscription?.dispose();
        this.subscription = undefined;
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
        } catch (error) {
            this.dispose();
            throw error;
        }
    };

    private handleRegistrationResult = (message: string): void => {
        this.assertPhase(InitPhase.Registration);

        try {
            const isSuccess = this.registrationController.handleRegistrationResult(message, {
                runtime: this.runtime,
            });

            if (!isSuccess) {
                this.dispose();
                return;
            }

            this.sendApiManifest();
            this.complete();
        } catch (error) {
            this.dispose();
            throw error;
        }
    };

    private sendApiManifest(): void {
        const manifest = new ApiManifestBuilder().build(this.apiRegistry, this.eventRegistry);

        const message = {
            kairoId: this.context.kairoId,
            apis: manifest.apis,
            hooks: manifest.hooks,
            eventSubscriptions: manifest.eventSubscriptions ?? [],
            timestamp: this.runtime.currentTick(),
        };

        const messageStr = JSON.stringify(message);

        this.runtime.sendDeferred(KairoInitEventId.ApiManifest, messageStr);
    }

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
