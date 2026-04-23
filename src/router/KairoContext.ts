import { AddonProperties } from "../types/AddonProperties";
import { KairoContextError, KairoContextErrorReason } from "./errors/KairoContextError";
import { KairoRegistry } from "./types/KairoRegistry";

class MutableKairoContextState {
    kairoId?: string;
    kairoRegistry?: KairoRegistry;

    activationState: "active" | "inactive" = "inactive";
}

export class KairoContext {
    constructor(
        /** @internal */
        private readonly _state: MutableKairoContextState,
        /** @internal */
        private readonly _properties: AddonProperties,
    ) {
        Object.freeze(this._properties);
    }

    get addonProperties(): AddonProperties {
        return this._properties;
    }

    get kairoId(): string {
        if (!this._state.kairoId) {
            throw new KairoContextError(KairoContextErrorReason.KairoIdNotSet);
        }
        return this._state.kairoId;
    }

    get kairoRegistry(): KairoRegistry {
        if (!this._state.kairoRegistry) {
            throw new KairoContextError(KairoContextErrorReason.RegistryNotCompleted);
        }
        return this._state.kairoRegistry;
    }

    get activationState(): "active" | "inactive" {
        return this._state.activationState;
    }

    isActive(): boolean {
        return this._state.activationState === "active";
    }

    isRegistered(): boolean {
        return !!this._state.kairoRegistry;
    }
}

export interface KairoContextMutator {
    setKairoId(value: string): void;
    setKairoRegistry(value: KairoRegistry): void;

    setActivationState(value: "active" | "inactive"): void;
}

export function createKairoContext(properties: AddonProperties): {
    context: KairoContext;
    mutator: KairoContextMutator;
} {
    const state = new MutableKairoContextState();
    const context = new KairoContext(state, properties);

    const mutator: KairoContextMutator = {
        setKairoId(value: string) {
            if (state.kairoId) {
                throw new KairoContextError(KairoContextErrorReason.KairoIdAlreadySet);
            }
            state.kairoId = value;
        },

        setKairoRegistry(value: KairoRegistry) {
            if (state.kairoRegistry) {
                throw new KairoContextError(KairoContextErrorReason.RegistryAlreadyCompleted);
            }
            state.kairoRegistry = Object.freeze(value);
        },

        setActivationState(value: "active" | "inactive") {
            state.activationState = value;
        },
    };

    return { context, mutator };
}
