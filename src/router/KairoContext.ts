import { AddonProperties } from "../types/AddonProperties";
import { KairoRegistry } from "./types/KairoRegistry";

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

    set kairoId(value: string) {
        if (this._kairoId) throw new Error("kairo: kairoId is already frozen.");
        this._kairoId = value;
    }

    get kairoRegistry(): KairoRegistry {
        if (!this._kairoRegistry) throw new Error("kairo: Registry not completed.");
        return this._kairoRegistry;
    }

    set kairoRegistry(value: KairoRegistry) {
        if (this._kairoRegistry) throw new Error("kairo: Registry is already frozen.");

        this._kairoRegistry = Object.freeze(value);
    }

    isRegistered(): boolean {
        return !!this._kairoRegistry;
    }
}
