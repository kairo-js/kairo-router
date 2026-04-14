import { AddonProperties } from "../types/AddonProperties";
import { KairoRegistry } from "./types/KairoRegistry";

const contextMutationToken = Symbol("kairo-context-mutation-token");

export interface KairoContextMutator {
    setKairoId(value: string): void;
    setKairoRegistry(value: KairoRegistry): void;
}

export class KairoContext {
    private _kairoId?: string;
    private _kairoRegistry?: KairoRegistry;

    constructor(private readonly _properties: AddonProperties) {
        Object.freeze(this._properties);
    }

    get addonProperties(): AddonProperties {
        return this._properties;
    }

    get kairoId(): string {
        if (!this._kairoId) throw new Error("kairo: kairoId not set.");
        return this._kairoId;
    }

    applyKairoId(value: string, token: symbol): void {
        if (token !== contextMutationToken) {
            throw new Error("kairo: unauthorized context mutation.");
        }
        if (this._kairoId) throw new Error("kairo: kairoId is already frozen.");
        this._kairoId = value;
    }

    get kairoRegistry(): KairoRegistry {
        if (!this._kairoRegistry) throw new Error("kairo: Registry not completed.");
        return this._kairoRegistry;
    }

    applyKairoRegistry(value: KairoRegistry, token: symbol): void {
        if (token !== contextMutationToken) {
            throw new Error("kairo: unauthorized context mutation.");
        }
        if (this._kairoRegistry) throw new Error("kairo: Registry is already frozen.");

        this._kairoRegistry = Object.freeze(value);
    }

    isRegistered(): boolean {
        return !!this._kairoRegistry;
    }
}

export function createKairoContext(properties: AddonProperties): {
    context: KairoContext;
    mutator: KairoContextMutator;
} {
    const context = new KairoContext(properties);
    return {
        context,
        mutator: {
            setKairoId: (value: string) => context.applyKairoId(value, contextMutationToken),
            setKairoRegistry: (value: KairoRegistry) =>
                context.applyKairoRegistry(value, contextMutationToken),
        },
    };
}
