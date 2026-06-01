import type { Disposable } from "../types/Disposable";

export type BeforeHookContext<TArgs, TReturn> = {
    args: TArgs;
    result: TReturn | undefined;
    readonly callerAddonId: string;
    cancel(): void;
};

export type AfterHookContext<TArgs, TReturn> = {
    readonly args: Readonly<TArgs>;
    result: TReturn;
    readonly callerAddonId: string;
};

export type HookRollbackContext<TArgs> = {
    readonly args: Readonly<TArgs>;
    readonly callerAddonId: string;
};

export type HookOptions<TArgs, TReturn> = {
    priority?: number;
    version?: string;
    before?: (ctx: BeforeHookContext<TArgs, TReturn>) => Promise<void>;
    after?: (ctx: AfterHookContext<TArgs, TReturn>) => Promise<void>;
    rollback?: (ctx: HookRollbackContext<TArgs>) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiHandler = (args: any) => any;

export type InternalHookDeclaration = {
    readonly targetAddonId: string;
    readonly apiName: string;
    readonly priority: number;
    readonly version?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly before?: (ctx: BeforeHookContext<any, any>) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly after?: (ctx: AfterHookContext<any, any>) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly rollback?: (ctx: HookRollbackContext<any>) => Promise<void>;
};

export class KairoApiRegistry implements Disposable {
    private sealed = false;
    private readonly apiHandlers = new Map<string, ApiHandler>();
    private readonly hookDeclarations: InternalHookDeclaration[] = [];

    register<TArgs, TReturn>(
        apiName: string,
        handler: (args: TArgs) => TReturn | Promise<TReturn>,
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
        this.hookDeclarations.push({
            targetAddonId,
            apiName,
            priority: options.priority ?? 0,
            version: options.version,
            before: options.before as InternalHookDeclaration["before"],
            after: options.after as InternalHookDeclaration["after"],
            rollback: options.rollback as InternalHookDeclaration["rollback"],
        });
    }

    seal(): void {
        this.sealed = true;
    }

    getApiHandlers(): ReadonlyMap<string, ApiHandler> {
        return this.apiHandlers;
    }

    getHookDeclarations(): readonly InternalHookDeclaration[] {
        return this.hookDeclarations;
    }

    dispose(): void {
        this.seal();
    }

    private assertNotSealed(): void {
        if (this.sealed) {
            throw new Error("[kairo-router] API registration is only allowed during the startup event");
        }
    }
}
