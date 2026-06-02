export class ApiNotFoundError extends Error {
    constructor(apiName?: string) {
        super(apiName ? `API "${apiName}" not found` : "API not found");
        this.name = "ApiNotFoundError";
    }
}

export class RequestTimeoutError extends Error {
    constructor() {
        super("Request timed out");
        this.name = "RequestTimeoutError";
    }
}

export class BeforeHookExecutionError extends Error {
    constructor(cause?: unknown) {
        super("Before hook threw an error");
        this.name = "BeforeHookExecutionError";
        if (cause !== undefined) (this as { cause: unknown }).cause = cause;
    }
}

export class AfterHookExecutionError extends Error {
    constructor(cause?: unknown) {
        super("After hook threw an error");
        this.name = "AfterHookExecutionError";
        if (cause !== undefined) (this as { cause: unknown }).cause = cause;
    }
}

export class HandlerExecutionError extends Error {
    constructor(cause?: unknown) {
        super("Handler threw an error");
        this.name = "HandlerExecutionError";
        if (cause !== undefined) (this as { cause: unknown }).cause = cause;
    }
}

export type ProtocolStage = "ApiCall" | "ApiInvoke" | "ApiResult" | "ApiHandlerResponse";

export class ProtocolError extends Error {
    constructor(
        message: string,
        readonly source: "local_parse" | "remote",
        readonly protocolStage?: ProtocolStage,
        readonly correlationId?: string,
    ) {
        super(message);
        this.name = "ProtocolError";
    }
}

export type CancelledResult = {
    readonly cancelled: true;
    readonly reason: "ADDON_NOT_FOUND" | "ADDON_INACTIVE" | "ADDON_UNRESOLVED" | "CANCELLED_BY_HOOK";
};
