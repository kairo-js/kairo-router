import { toError } from "@kairo-js/utils";
import { KairoRuntime } from "../../../minecraft/KairoRuntime";
import type { KairoApiRegistry } from "../../api/KairoApiRegistry";
import { ApiManifestBuilder } from "../../api/ApiManifestBuilder";
import type { KairoRegistry } from "../../types/KairoRegistry";
import { KairoInitEventId } from "../constants/KairoInitEventId";
import { RegistrationResponseError, RegistrationResponseErrorReason } from "./response/errors";
import type { RegistrationResponse } from "./response/schema";
import { stringifyRegistrationResponse } from "./response/stringify";

// kjs-router-ch 0203
export class RegistrationResponder {
    private readonly manifestBuilder = new ApiManifestBuilder();

    respond(runtime: KairoRuntime, kairoRegistry: KairoRegistry, apiRegistry: KairoApiRegistry): void {
        const apiManifest = this.manifestBuilder.build(apiRegistry);

        const response: RegistrationResponse = {
            kairoRegistry,
            apiManifest,
            timestamp: runtime.currentTick(),
        };

        try {
            const responseStr = stringifyRegistrationResponse(response);
            runtime.send(KairoInitEventId.RegistrationResponse, responseStr);
        } catch (e: unknown) {
            throw new RegistrationResponseError(RegistrationResponseErrorReason.StringifyFailed, {
                cause: toError(e),
            });
        }
    }
}
