import type { Disposable } from "../types/Disposable";

export type DeepReadonly<T> = T extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

export interface BeforeHookContext<TArgs, TReturn> {
    args: TArgs;
    readonly callerAddonId: string;
    cancel(result?: TReturn): never;
    setRollbackData(data: unknown): void;
}

export interface AfterHookContext<TArgs, TReturn> {
    readonly args: TArgs;
    result: TReturn;
    readonly callerAddonId: string;
}

export interface HookRollbackContext<TArgs> {
    readonly rollbackData: unknown;
    readonly currentArgsSnapshot: DeepReadonly<TArgs>;
    readonly callerAddonId: string;
}

export interface HookOptions<TArgs, TReturn> {
    priority?: number;
    modes?: ReadonlyArray<"send" | "request">;
    before?: (ctx: BeforeHookContext<TArgs, TReturn>) => Promise<void>;
    after?: (ctx: AfterHookContext<TArgs, TReturn>) => Promise<void>;
    rollback?: (ctx: HookRollbackContext<TArgs>) => Promise<TArgs | void>;
}

export interface ApiHandlerContext {
    readonly callerAddonId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiHandler = (args: any, ctx: ApiHandlerContext) => any;

export type HookPhase = "before" | "after";

export interface HookDeclaration {
    readonly targetAddonId: string;
    readonly apiName: string;
    readonly priority: number;
    readonly modes: ReadonlyArray<"send" | "request">;
    readonly sequence: number;
    declaringAddonId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly before?: (ctx: BeforeHookContext<any, any>) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly after?: (ctx: AfterHookContext<any, any>) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly rollback?: (ctx: HookRollbackContext<any>) => Promise<any | void>;
}

export interface ApiRegistration {
    register<TArgs, TReturn>(
        apiName: string,
        handler: (args: TArgs, ctx: ApiHandlerContext) => TReturn | Promise<TReturn>,
    ): void;
    hook<TArgs, TReturn>(
        targetAddonId: string,
        apiName: string,
        options: HookOptions<TArgs, TReturn>,
    ): void;
}

export class KairoApiRegistry implements Disposable {
    private sealed = false;
    private readonly apiHandlers = new Map<string, ApiHandler>();
    private readonly hookDeclarations: HookDeclaration[] = [];
    private sequenceCounter = 0;

    register<TArgs, TReturn>(
        apiName: string,
        handler: (args: TArgs, ctx: ApiHandlerContext) => TReturn | Promise<TReturn>,
    ): void {
        this.assertNotSealed();
        if (this.apiHandlers.has(apiName)) {
            throw new Error(`[kairo-router] API "${apiName}" is already registered`);
        }
        this.apiHandlers.set(apiName, handler as ApiHandler);
    }

    hook<TArgs, TReturn>(
        targetAddonId: string,
        apiName: string,
        options: HookOptions<TArgs, TReturn>,
    ): void {
        this.assertNotSealed();
        if (!options.before && !options.after) {
            throw new Error("[kairo-router] hook must have at least one of before or after");
        }

        const modes: ReadonlyArray<"send" | "request"> =
            options.modes ?? (options.after ? ["request"] : ["send", "request"]);

        this.hookDeclarations.push({
            targetAddonId,
            apiName,
            priority: options.priority ?? 0,
            modes,
            sequence: this.sequenceCounter++,
            before: options.before as HookDeclaration["before"],
            after: options.after as HookDeclaration["after"],
            rollback: options.rollback as HookDeclaration["rollback"],
        });
    }

    seal(): void {
        this.sealed = true;
    }

    setDeclaringAddonId(addonId: string): void {
        for (const decl of this.hookDeclarations) {
            if (!decl.declaringAddonId) {
                (decl as { declaringAddonId: string }).declaringAddonId = addonId;
            }
        }
    }

    getApiHandler(apiName: string): ApiHandler | undefined {
        return this.apiHandlers.get(apiName);
    }

    getApiNames(): ReadonlyArray<string> {
        return [...this.apiHandlers.keys()];
    }

    getHookDeclarations(): readonly HookDeclaration[] {
        return this.hookDeclarations;
    }

    dispose(): void {
        this.seal();
    }

    private assertNotSealed(): void {
        if (this.sealed) {
            throw new Error(
                "[kairo-router] API registration is only allowed during the startup event",
            );
        }
    }
}
