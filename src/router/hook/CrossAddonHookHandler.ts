import { compile, safeJsonParse } from "@kairo-js/utils";
import type { KairoRuntime } from "../../minecraft/KairoRuntime";
import type { Disposable } from "../types/Disposable";
import type { KairoApiRegistry } from "../api/KairoApiRegistry";
import {
    HookInvokeMessageSchema,
    HookResponseMessageSchema,
    type HookInvokeMessage,
    type HookResponseMessage,
} from "./schema";

interface CancelSignal { result: unknown; hasResult: boolean; }

export class CrossAddonHookHandler implements Disposable {
    private listener?: Disposable;
    private disposed = false;

    constructor(
        private readonly runtime: KairoRuntime,
        private readonly apiRegistry: KairoApiRegistry,
        private readonly getOwnKairoId: () => string,
    ) {}

    setup(): void {
        const ownKairoId = this.getOwnKairoId();
        this.listener = this.runtime.receive((id, message) => {
            if (id !== `${ownKairoId}:hook-invoke`) return;
            void this.handleInvoke(message);
        });
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.listener?.dispose();
        this.listener = undefined;
    }

    private async handleInvoke(rawMessage: string): Promise<void> {
        let msg: HookInvokeMessage;
        try {
            const parsed = safeJsonParse(rawMessage, () => new Error("parse failed"));
            if (!validateHookInvoke(parsed)) return;
            msg = parsed as HookInvokeMessage;
        } catch {
            return;
        }

        const decl = this.apiRegistry.getHookDeclarations().find(
            (d) => d.sequence === msg.declarationSequence,
        );

        if (!decl) {
            this.sendResponse(msg.hookCorrelationId, { outcome: "failed", error: "Hook declaration not found" });
            return;
        }

        let args: unknown;
        let result: unknown;
        try {
            args = JSON.parse(msg.args);
            if (msg.result !== undefined) result = JSON.parse(msg.result);
        } catch {
            this.sendResponse(msg.hookCorrelationId, { outcome: "failed", error: "Failed to parse args/result" });
            return;
        }

        if (msg.phase === "before" && decl.before) {
            await this.runBefore(msg, decl.before as (ctx: unknown) => Promise<void>, args);
        } else if (msg.phase === "after" && decl.after) {
            await this.runAfter(msg, decl.after as (ctx: unknown) => Promise<void>, args, result);
        } else if (msg.phase === "rollback" && decl.rollback) {
            await this.runRollback(msg, decl.rollback as (ctx: unknown) => Promise<unknown>, args);
        } else {
            this.sendResponse(msg.hookCorrelationId, { outcome: "failed", error: "No matching hook phase" });
        }
    }

    private async runBefore(
        msg: HookInvokeMessage,
        beforeFn: (ctx: unknown) => Promise<void>,
        initialArgs: unknown,
    ): Promise<void> {
        let args = initialArgs;
        const rollbackDataStore = { data: undefined as unknown, set: false };
        const cancelState = { signal: null as CancelSignal | null };

        const ctx = {
            get args() { return args; },
            set args(v: unknown) { args = v; },
            callerAddonId: msg.callerAddonId,
            cancel(result?: unknown): never {
                if (!cancelState.signal) {
                    cancelState.signal = { result, hasResult: result !== undefined };
                }
                return undefined as never;
            },
            setRollbackData(data: unknown): void {
                rollbackDataStore.data = data;
                rollbackDataStore.set = true;
            },
        };

        try {
            await beforeFn(ctx);
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            this.sendResponse(msg.hookCorrelationId, { outcome: "failed", error });
            return;
        }

        const signal = cancelState.signal;
        if (signal) {
            if (signal.hasResult) {
                this.sendResponse(msg.hookCorrelationId, {
                    outcome: "cancel_with_result",
                    cancelResult: JSON.stringify(signal.result),
                });
            } else {
                this.sendResponse(msg.hookCorrelationId, { outcome: "cancel" });
            }
            return;
        }

        const response: Partial<HookResponseMessage> = {
            outcome: "continue",
            modifiedArgs: JSON.stringify(args),
        };
        if (rollbackDataStore.set) {
            response.rollbackData = JSON.stringify(rollbackDataStore.data);
        }
        this.sendResponse(msg.hookCorrelationId, response as HookResponseMessage);
    }

    private async runAfter(
        msg: HookInvokeMessage,
        afterFn: (ctx: unknown) => Promise<void>,
        args: unknown,
        initialResult: unknown,
    ): Promise<void> {
        const resultHolder = { value: initialResult };

        const ctx = {
            get args() { return args; },
            get result() { return resultHolder.value; },
            set result(v: unknown) { resultHolder.value = v; },
            callerAddonId: msg.callerAddonId,
        };

        try {
            await afterFn(ctx);
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            this.sendResponse(msg.hookCorrelationId, { outcome: "failed", error });
            return;
        }

        this.sendResponse(msg.hookCorrelationId, {
            outcome: "continue",
            modifiedResult: JSON.stringify(resultHolder.value),
        });
    }

    private async runRollback(
        msg: HookInvokeMessage,
        rollbackFn: (ctx: unknown) => Promise<unknown>,
        currentArgs: unknown,
    ): Promise<void> {
        let rollbackData: unknown;
        try {
            rollbackData = msg.rollbackData !== undefined ? JSON.parse(msg.rollbackData) : undefined;
        } catch {
            rollbackData = undefined;
        }

        const ctx = {
            rollbackData,
            currentArgsSnapshot: currentArgs,
            callerAddonId: msg.callerAddonId,
        };

        let returned: unknown;
        try {
            returned = await rollbackFn(ctx);
        } catch {
            this.sendResponse(msg.hookCorrelationId, { outcome: "continue" });
            return;
        }

        const response: Partial<HookResponseMessage> = { outcome: "continue" };
        if (returned !== undefined) {
            response.returnedArgs = JSON.stringify(returned);
        }
        this.sendResponse(msg.hookCorrelationId, response as HookResponseMessage);
    }

    private sendResponse(hookCorrelationId: string, partial: Partial<HookResponseMessage> & { outcome: HookResponseMessage["outcome"] }): void {
        const response: HookResponseMessage = {
            hookCorrelationId,
            ...partial,
            timestamp: this.runtime.currentTick(),
        };
        try {
            this.runtime.send("kairo:hook-response", JSON.stringify(response));
        } catch {}
    }
}

const validateHookInvoke = compile(HookInvokeMessageSchema);
