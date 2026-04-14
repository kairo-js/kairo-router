import { AddonProperties } from "../types/AddonProperties";
import { KairoRegistry } from "./types/KairoRegistry";

class MutableKairoContextState {
    kairoId?: string;
    kairoRegistry?: KairoRegistry;
}

/** @public */
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
            throw new Error("kairo: kairoId not set.");
        }
        return this._state.kairoId;
    }

    get kairoRegistry(): KairoRegistry {
        if (!this._state.kairoRegistry) {
            throw new Error("kairo: Registry not completed.");
        }
        return this._state.kairoRegistry;
    }

    isRegistered(): boolean {
        return !!this._state.kairoRegistry;
    }
}

export interface KairoContextMutator {
    setKairoId(value: string): void;
    setKairoRegistry(value: KairoRegistry): void;
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
                throw new Error("kairo: kairoId is already frozen.");
            }
            state.kairoId = value;
        },

        setKairoRegistry(value: KairoRegistry) {
            if (state.kairoRegistry) {
                throw new Error("kairo: Registry is already frozen.");
            }
            state.kairoRegistry = Object.freeze(value);
        },
    };

    return { context, mutator };
}
