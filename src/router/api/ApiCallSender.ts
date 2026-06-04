import { compile, safeJsonParse } from "@kairo-js/utils";
import type { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { Disposable } from "../types/Disposable";
import {
    AfterHookExecutionError,
    ApiNotFoundError,
    BeforeHookExecutionError,
    type CanceledResult,
    HandlerExecutionError,
    HostSwitchingError,
    ProtocolError,
    RequestTimeoutError,
} from "./errors";
import { ApiCallSchema, ApiResultSchema, type ApiCall, type ApiResult } from "./protocol/schema";

const DEFAULT_TIMEOUT_TICKS = 20;
const SAFETY_MARGIN_TICKS = 5;

type PendingRequest = {
    resolve: (result: unknown) => void;
    reject: (error: unknown) => void;
    safetyCleanupId?: number;
};

export class ApiCallSender implements Disposable {
    private readonly pendingRequests = new Map<string, PendingRequest>();
    private sessionId: string;
    private counter = 0;
    private resultListener?: Disposable;
    private disposed = false;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly getCallerKairoId: () => string,
        private readonly getCallerAddonId: () => string,
    ) {
        this.sessionId = Math.random().toString(36).slice(2, 8);
    }

    setup(): void {
        this.resultListener = this.runtime.receive((id, message) => {
            if (!id.endsWith(":api-result")) return;
            const correlationId = id.slice(0, -":api-result".length);
            if (!this.pendingRequests.has(correlationId)) return;
            this.handleApiResult(correlationId, message);
        });
    }

    send(targetAddonId: string, apiName: string, args?: unknown): void {
        const call: ApiCall = {
            type: "send",
            correlationId: "",
            targetAddonId,
            callerAddonId: this.getCallerAddonId(),
            apiName,
            args: JSON.stringify(args ?? null),
            timestamp: this.runtime.currentTick(),
        };
        try {
            this.runtime.send("kairo:api-call", JSON.stringify(call));
        } catch {
            // fire-and-forget: ignore errors
        }
    }

    request<TReturn>(
        targetAddonId: string,
        apiName: string,
        args?: unknown,
        options?: { timeout?: number },
    ): Promise<TReturn | CanceledResult> {
        const correlationId = `kjs-${this.sessionId}-${this.counter++}`;
        const timeoutTicks = options?.timeout ?? DEFAULT_TIMEOUT_TICKS;

        const call: ApiCall = {
            type: "request",
            correlationId,
            targetAddonId,
            callerAddonId: this.getCallerAddonId(),
            apiName,
            args: JSON.stringify(args ?? null),
            timeout: timeoutTicks,
            timestamp: this.runtime.currentTick(),
        };

        return new Promise<TReturn | CanceledResult>((resolve, reject) => {
            const safetyTimeoutMs = (timeoutTicks + SAFETY_MARGIN_TICKS) * 50;
            const safetyCleanupId = this.runtime.scheduler.runTimeout(() => {
                const pending = this.pendingRequests.get(correlationId);
                if (pending) {
                    this.pendingRequests.delete(correlationId);
                }
            }, timeoutTicks + SAFETY_MARGIN_TICKS);

            this.pendingRequests.set(correlationId, {
                resolve: resolve as (v: unknown) => void,
                reject,
                safetyCleanupId,
            });

            try {
                this.runtime.send("kairo:api-call", JSON.stringify(call));
            } catch (e) {
                this.pendingRequests.delete(correlationId);
                this.runtime.scheduler.clearRun(safetyCleanupId);
                reject(new ProtocolError("Failed to send ApiCall", "local_parse", "ApiCall", correlationId));
            }
        });
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;

        for (const [, pending] of this.pendingRequests) {
            if (pending.safetyCleanupId !== undefined) {
                this.runtime.scheduler.clearRun(pending.safetyCleanupId);
            }
        }
        this.pendingRequests.clear();

        this.resultListener?.dispose();
        this.resultListener = undefined;
    }

    private handleApiResult(correlationId: string, message: string): void {
        const pending = this.pendingRequests.get(correlationId);
        if (!pending) return;

        this.pendingRequests.delete(correlationId);
        if (pending.safetyCleanupId !== undefined) {
            this.runtime.scheduler.clearRun(pending.safetyCleanupId);
        }

        let result: ApiResult;
        try {
            const parsed = safeJsonParse(message, () => new Error("parse failed"));
            if (!validateApiResult(parsed)) {
                throw new ProtocolError(
                    "Invalid ApiResult schema",
                    "local_parse",
                    "ApiResult",
                    correlationId,
                );
            }
            result = parsed as ApiResult;
        } catch (e) {
            pending.reject(
                e instanceof ProtocolError
                    ? e
                    : new ProtocolError("Failed to parse ApiResult", "local_parse", "ApiResult", correlationId),
            );
            return;
        }

        if (result.success) {
            try {
                const value = result.result !== undefined ? JSON.parse(result.result) : undefined;
                pending.resolve(value);
            } catch {
                pending.reject(new ProtocolError("Failed to parse ApiResult.result", "local_parse", "ApiResult", correlationId));
            }
            return;
        }

        if (result.canceled) {
            pending.resolve({
                canceled: true as const,
                reason: result.reason as CanceledResult["reason"],
            });
            return;
        }

        switch (result.errorType) {
            case "API_NOT_FOUND":
                pending.reject(new ApiNotFoundError());
                break;
            case "BEFORE_HOOK_EXECUTION":
                pending.reject(new BeforeHookExecutionError(result.error));
                break;
            case "AFTER_HOOK_EXECUTION":
                pending.reject(new AfterHookExecutionError(result.error));
                break;
            case "HANDLER_EXECUTION":
                pending.reject(new HandlerExecutionError(result.error));
                break;
            case "TIMEOUT":
                pending.reject(new RequestTimeoutError());
                break;
            case "HOST_SWITCHING":
                pending.reject(new HostSwitchingError());
                break;
            case "PROTOCOL_ERROR":
                pending.reject(new ProtocolError(result.error ?? "Remote protocol error", "remote", "ApiResult", correlationId));
                break;
            default:
                pending.reject(new ProtocolError("Unknown error type", "remote", "ApiResult", correlationId));
        }
    }
}

const validateApiResult = compile(ApiResultSchema);
