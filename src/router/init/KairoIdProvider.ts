import { IdRegistry } from "../types/IdRegistry";
import { Random } from "../types/Random";
import { ProvideKairoIdError, ProvideKairoIdErrorReason } from "./discovery/idProvider/errors";

// kjs-router-ch 0104
export class KairoIdProvider {
    private readonly CHARSET =
        "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "?_-().";
    private readonly PREFIX_LENGTH = 8;
    private readonly ID_LENGTH = 16;

    constructor(private readonly random: Random) {}

    provideId(idRegistry: IdRegistry, addonId: string): string {
        const prefix = this.hash(addonId);

        let kairoId: string;
        let attempts = 0;

        do {
            kairoId = `${prefix}-${this.generateId()}`;
            attempts++;

            if (attempts > 100) {
                throw new ProvideKairoIdError(ProvideKairoIdErrorReason.IdGenerationFailed);
            }
        } while (idRegistry.has(kairoId));

        idRegistry.register(kairoId);

        return kairoId;
    }

    private generateId(length: number = this.ID_LENGTH): string {
        const chars = this.CHARSET;
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars[(this.random.next() * chars.length) | 0];
        }

        return result;
    }

    private hash(input: string): string {
        let hash = 2166136261;

        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }

        return (hash >>> 0).toString(36).padStart(this.PREFIX_LENGTH, "0");
    }
}
