import { compile, safeJsonParse } from "@kairo-js/utils";
import type { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { Disposable } from "../types/Disposable";
import type { KairoApiRegistry } from "./KairoApiRegistry";
import { ApiHandlerResponseSchema, ApiInvokeSchema, type ApiHandlerResponse, type ApiInvoke } from "./protocol/schema";

export class InvokeHandler implements Disposable {
    private listener?: Disposable;
    private disposed = false;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly apiRegistry: KairoApiRegistry,
        private readonly getKairoKairoId: () => string,
        private readonly getOwnKairoId: () => string,
    ) {}

    setup(): void {
        const ownKairoId = this.getOwnKairoId();
        this.listener = this.runtime.receive((id, message) => {
            if (id !== `${ownKairoId}:api-invoke`) return;
            void this.handleInvoke(message);
        });
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.listener?.dispose();
        this.listener = undefined;
    }

    private async handleInvoke(message: string): Promise<void> {
        let invoke: ApiInvoke;
        try {
            const parsed = safeJsonParse(message, () => new Error("parse failed"));
            if (!validateApiInvoke(parsed)) {
                return;
            }
            invoke = parsed as ApiInvoke;
        } catch {
            return;
        }

        if (invoke.type === "send") {
            await this.executeHandler(invoke, false);
        } else {
            await this.executeHandler(invoke, true);
        }
    }

    private async executeHandler(invoke: ApiInvoke, sendResponse: boolean): Promise<void> {
        const handler = this.apiRegistry.getApiHandler(invoke.apiName);
        if (!handler) {
            if (sendResponse) {
                this.sendHandlerResponse(invoke.correlationId, false, undefined, `Handler for "${invoke.apiName}" not found`);
            }
            return;
        }

        let args: unknown;
        try {
            args = JSON.parse(invoke.args);
        } catch {
            if (sendResponse) {
                this.sendHandlerResponse(invoke.correlationId, false, undefined, "Failed to parse args");
            }
            return;
        }

        let result: unknown;
        try {
            result = await handler(args, { callerAddonId: invoke.callerAddonId });
        } catch (e) {
            if (sendResponse) {
                const message = e instanceof Error ? e.message : String(e);
                this.sendHandlerResponse(invoke.correlationId, false, undefined, message);
            }
            return;
        }

        if (!sendResponse) return;

        let resultStr: string;
        try {
            resultStr = JSON.stringify(result);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Result is not JSON serializable";
            this.sendHandlerResponse(invoke.correlationId, false, undefined, message);
            return;
        }

        this.sendHandlerResponse(invoke.correlationId, true, resultStr, undefined);
    }

    private sendHandlerResponse(
        correlationId: string,
        success: boolean,
        result: string | undefined,
        error: string | undefined,
    ): void {
        const response: ApiHandlerResponse = {
            correlationId,
            success,
            ...(result !== undefined ? { result } : {}),
            ...(error !== undefined ? { error } : {}),
            timestamp: this.runtime.currentTick(),
        };
        try {
            this.runtime.send("kairo:api-response", JSON.stringify(response));
        } catch {
            // send failure is silently ignored
        }
    }
}

const validateApiInvoke = compile(ApiInvokeSchema);
