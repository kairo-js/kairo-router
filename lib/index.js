// src/minecraft/KairoRuntime.ts
import { SeedRandom } from "@kairo-js/utils";
import {
  ScriptEventSource,
  system as system2,
  world as world2
} from "@minecraft/server";

// src/minecraft/ScoreboardIdRegistry.ts
import { world } from "@minecraft/server";
var ScoreboardIdRegistry = class {
  constructor(objectiveId) {
    this.objectiveId = objectiveId;
  }
  get objective() {
    const obj = world.scoreboard.getObjective(this.objectiveId);
    if (!obj) {
      throw new Error(`Objective not found: ${this.objectiveId}`);
    }
    return obj;
  }
  has(id) {
    return this.objective.hasParticipant(id);
  }
  register(id) {
    this.objective.setScore(id, 0);
  }
};

// src/minecraft/minecraftEventBinding.ts
import { system } from "@minecraft/server";
function bind(signal, handler) {
  const sub = signal.subscribe(handler);
  return { dispose: () => signal.unsubscribe(sub) };
}
var minecraftEventBinding = {
  after: {
    addonActivate: (_w, _h) => ({ dispose: () => {
    } }),
    blockExplode: (w, h) => bind(w.afterEvents.blockExplode, h),
    buttonPush: (w, h) => bind(w.afterEvents.buttonPush, h),
    dataDrivenEntityTrigger: (w, h) => bind(w.afterEvents.dataDrivenEntityTrigger, h),
    effectAdd: (w, h) => bind(w.afterEvents.effectAdd, h),
    entityDie: (w, h) => bind(w.afterEvents.entityDie, h),
    entityHeal: (w, h) => bind(w.afterEvents.entityHeal, h),
    entityHealthChanged: (w, h) => bind(w.afterEvents.entityHealthChanged, h),
    entityHitBlock: (w, h) => bind(w.afterEvents.entityHitBlock, h),
    entityHitEntity: (w, h) => bind(w.afterEvents.entityHitEntity, h),
    entityHurt: (w, h) => bind(w.afterEvents.entityHurt, h),
    entityItemDrop: (w, h) => bind(w.afterEvents.entityItemDrop, h),
    entityItemPickup: (w, h) => bind(w.afterEvents.entityItemPickup, h),
    entityLoad: (w, h) => bind(w.afterEvents.entityLoad, h),
    entityRemove: (w, h) => bind(w.afterEvents.entityRemove, h),
    entitySpawn: (w, h) => bind(w.afterEvents.entitySpawn, h),
    explosion: (w, h) => bind(w.afterEvents.explosion, h),
    gameRuleChange: (w, h) => bind(w.afterEvents.gameRuleChange, h),
    itemCompleteUse: (w, h) => bind(w.afterEvents.itemCompleteUse, h),
    itemReleaseUse: (w, h) => bind(w.afterEvents.itemReleaseUse, h),
    itemStartUse: (w, h) => bind(w.afterEvents.itemStartUse, h),
    itemStartUseOn: (w, h) => bind(w.afterEvents.itemStartUseOn, h),
    itemStopUse: (w, h) => bind(w.afterEvents.itemStopUse, h),
    itemStopUseOn: (w, h) => bind(w.afterEvents.itemStopUseOn, h),
    itemUse: (w, h) => bind(w.afterEvents.itemUse, h),
    leverAction: (w, h) => bind(w.afterEvents.leverAction, h),
    pistonActivate: (w, h) => bind(w.afterEvents.pistonActivate, h),
    playerBreakBlock: (w, h) => bind(w.afterEvents.playerBreakBlock, h),
    playerButtonInput: (w, h) => bind(w.afterEvents.playerButtonInput, h),
    playerDimensionChange: (w, h) => bind(w.afterEvents.playerDimensionChange, h),
    playerEmote: (w, h) => bind(w.afterEvents.playerEmote, h),
    playerGameModeChange: (w, h) => bind(w.afterEvents.playerGameModeChange, h),
    playerHotbarSelectedSlotChange: (w, h) => bind(w.afterEvents.playerHotbarSelectedSlotChange, h),
    playerInputModeChange: (w, h) => bind(w.afterEvents.playerInputModeChange, h),
    playerInputPermissionCategoryChange: (w, h) => bind(w.afterEvents.playerInputPermissionCategoryChange, h),
    playerInteractWithBlock: (w, h) => bind(w.afterEvents.playerInteractWithBlock, h),
    playerInteractWithEntity: (w, h) => bind(w.afterEvents.playerInteractWithEntity, h),
    playerInventoryItemChange: (w, h) => bind(w.afterEvents.playerInventoryItemChange, h),
    playerJoin: (w, h) => bind(w.afterEvents.playerJoin, h),
    playerLeave: (w, h) => bind(w.afterEvents.playerLeave, h),
    playerPlaceBlock: (w, h) => bind(w.afterEvents.playerPlaceBlock, h),
    playerSpawn: (w, h) => bind(w.afterEvents.playerSpawn, h),
    playerSwingStart: (w, h) => bind(w.afterEvents.playerSwingStart, h),
    pressurePlatePop: (w, h) => bind(w.afterEvents.pressurePlatePop, h),
    pressurePlatePush: (w, h) => bind(w.afterEvents.pressurePlatePush, h),
    projectileHitBlock: (w, h) => bind(w.afterEvents.projectileHitBlock, h),
    projectileHitEntity: (w, h) => bind(w.afterEvents.projectileHitEntity, h),
    scriptEventReceive: (_w, h) => bind(system.afterEvents.scriptEventReceive, h),
    targetBlockHit: (w, h) => bind(w.afterEvents.targetBlockHit, h),
    tripWireTrip: (w, h) => bind(w.afterEvents.tripWireTrip, h),
    weatherChange: (w, h) => bind(w.afterEvents.weatherChange, h)
  },
  before: {
    addonDeactivate: (_w, _h) => ({ dispose: () => {
    } }),
    effectAdd: (w, h) => bind(w.beforeEvents.effectAdd, h),
    entityHeal: (w, h) => bind(w.beforeEvents.entityHeal, h),
    entityItemPickup: (w, h) => bind(w.beforeEvents.entityItemPickup, h),
    entityRemove: (w, h) => bind(w.beforeEvents.entityRemove, h),
    explosion: (w, h) => bind(w.beforeEvents.explosion, h),
    itemUse: (w, h) => bind(w.beforeEvents.itemUse, h),
    playerBreakBlock: (w, h) => bind(w.beforeEvents.playerBreakBlock, h),
    playerGameModeChange: (w, h) => bind(w.beforeEvents.playerGameModeChange, h),
    playerInteractWithBlock: (w, h) => bind(w.beforeEvents.playerInteractWithBlock, h),
    playerInteractWithEntity: (w, h) => bind(w.beforeEvents.playerInteractWithEntity, h),
    playerLeave: (w, h) => bind(w.beforeEvents.playerLeave, h),
    shutdown: (_w, h) => bind(system.beforeEvents.shutdown, h),
    weatherChange: (w, h) => bind(w.beforeEvents.weatherChange, h)
  }
};

// src/minecraft/KairoRuntime.ts
var KairoRuntime = class {
  constructor(options = {}) {
    this.options = options;
  }
  static onStartup(handler) {
    const sub = system2.beforeEvents.startup.subscribe(handler);
    return { dispose: () => system2.beforeEvents.startup.unsubscribe(sub) };
  }
  currentTick() {
    return system2.currentTick;
  }
  send(id, message) {
    system2.sendScriptEvent(id, message);
  }
  receive(handler) {
    const listener = (ev) => {
      if (ev.sourceType !== ScriptEventSource.Server) return;
      handler(ev.id, ev.message);
    };
    system2.afterEvents.scriptEventReceive.subscribe(listener);
    return {
      dispose: () => system2.afterEvents.scriptEventReceive.unsubscribe(listener)
    };
  }
  onReady(handler) {
    const listener = (_ev) => handler();
    world2.afterEvents.worldLoad.subscribe(listener);
    return {
      dispose: () => world2.afterEvents.worldLoad.unsubscribe(listener)
    };
  }
  createIdRegistry(objectiveId) {
    return new ScoreboardIdRegistry(objectiveId);
  }
  createRandom() {
    return new SeedRandom(this.options.randomSeed);
  }
  bindEvents(handler) {
    const disposables = [];
    for (const [name, fn] of Object.entries(minecraftEventBinding.after)) {
      disposables.push(
        fn(world2, (payload) => {
          handler({ phase: "after", name, payload });
        })
      );
    }
    for (const [name, fn] of Object.entries(minecraftEventBinding.before)) {
      disposables.push(
        fn(world2, (payload) => {
          handler({ phase: "before", name, payload });
        })
      );
    }
    return {
      dispose: () => disposables.forEach((d) => d.dispose())
    };
  }
  scheduler = {
    runInterval: (cb, tick) => system2.runInterval(cb, tick),
    runTimeout: (cb, tick) => system2.runTimeout(cb, tick),
    clearRun: (id) => system2.clearRun(id)
  };
};

// src/router/KairoRouter.ts
import { SeedRandom as SeedRandom2 } from "@kairo-js/utils";

// src/router/api/ApiCallSender.ts
import { compile, safeJsonParse } from "@kairo-js/utils";

// src/router/api/errors.ts
var ApiNotFoundError = class extends Error {
  constructor(apiName) {
    super(apiName ? `API "${apiName}" not found` : "API not found");
    this.name = "ApiNotFoundError";
  }
};
var RequestTimeoutError = class extends Error {
  constructor() {
    super("Request timed out");
    this.name = "RequestTimeoutError";
  }
};
var BeforeHookExecutionError = class extends Error {
  constructor(cause) {
    super("Before hook threw an error");
    this.name = "BeforeHookExecutionError";
    if (cause !== void 0) this.cause = cause;
  }
};
var AfterHookExecutionError = class extends Error {
  constructor(cause) {
    super("After hook threw an error");
    this.name = "AfterHookExecutionError";
    if (cause !== void 0) this.cause = cause;
  }
};
var HandlerExecutionError = class extends Error {
  constructor(cause) {
    super("Handler threw an error");
    this.name = "HandlerExecutionError";
    if (cause !== void 0) this.cause = cause;
  }
};
var ProtocolError = class extends Error {
  constructor(message, source, protocolStage, correlationId) {
    super(message);
    this.source = source;
    this.protocolStage = protocolStage;
    this.correlationId = correlationId;
    this.name = "ProtocolError";
  }
};

// src/router/api/protocol/schema.ts
import { Type } from "@sinclair/typebox";
var ApiCallSchema = Type.Object(
  {
    type: Type.Union([Type.Literal("send"), Type.Literal("request")]),
    correlationId: Type.String(),
    targetAddonId: Type.String(),
    apiName: Type.String(),
    args: Type.String(),
    timeout: Type.Optional(Type.Integer({ minimum: 1 })),
    timestamp: Type.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var ApiInvokeSchema = Type.Object(
  {
    type: Type.Union([Type.Literal("send"), Type.Literal("request")]),
    correlationId: Type.String(),
    callerAddonId: Type.String(),
    apiName: Type.String(),
    args: Type.String(),
    timestamp: Type.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var ApiHandlerResponseSchema = Type.Object(
  {
    correlationId: Type.String(),
    success: Type.Boolean(),
    result: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    timestamp: Type.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var ApiResultSchema = Type.Object(
  {
    correlationId: Type.String(),
    success: Type.Boolean(),
    result: Type.Optional(Type.String()),
    cancelled: Type.Optional(Type.Literal(true)),
    reason: Type.Optional(Type.String()),
    errorType: Type.Optional(
      Type.Union([
        Type.Literal("API_NOT_FOUND"),
        Type.Literal("BEFORE_HOOK_EXECUTION"),
        Type.Literal("AFTER_HOOK_EXECUTION"),
        Type.Literal("HANDLER_EXECUTION"),
        Type.Literal("TIMEOUT"),
        Type.Literal("PROTOCOL_ERROR")
      ])
    ),
    error: Type.Optional(Type.String()),
    timestamp: Type.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var ApiManifestSchema = Type.Object(
  {
    apis: Type.Array(Type.Object({ name: Type.String() })),
    hooks: Type.Array(
      Type.Object({
        targetAddonId: Type.String(),
        apiName: Type.String(),
        priority: Type.Integer({ minimum: -2147483648, maximum: 2147483647 }),
        phases: Type.Array(
          Type.Union([Type.Literal("before"), Type.Literal("after")])
        )
      })
    )
  },
  { additionalProperties: false }
);

// src/router/api/ApiCallSender.ts
var DEFAULT_TIMEOUT_TICKS = 20;
var SAFETY_MARGIN_TICKS = 5;
var ApiCallSender = class {
  constructor(runtime, getCallerKairoId) {
    this.runtime = runtime;
    this.getCallerKairoId = getCallerKairoId;
    this.sessionId = Math.random().toString(36).slice(2, 8);
  }
  pendingRequests = /* @__PURE__ */ new Map();
  sessionId;
  counter = 0;
  resultListener;
  disposed = false;
  setup() {
    this.resultListener = this.runtime.receive((id, message) => {
      if (!id.endsWith(":api-result")) return;
      const correlationId = id.slice(0, -":api-result".length);
      if (!this.pendingRequests.has(correlationId)) return;
      this.handleApiResult(correlationId, message);
    });
  }
  send(targetAddonId, apiName, args) {
    const call = {
      type: "send",
      correlationId: "",
      targetAddonId,
      apiName,
      args: JSON.stringify(args ?? null),
      timestamp: this.runtime.currentTick()
    };
    try {
      this.runtime.send("kairo:api-call", JSON.stringify(call));
    } catch {
    }
  }
  request(targetAddonId, apiName, args, options) {
    const correlationId = `kjs-${this.sessionId}-${this.counter++}`;
    const timeoutTicks = options?.timeout ?? DEFAULT_TIMEOUT_TICKS;
    const call = {
      type: "request",
      correlationId,
      targetAddonId,
      apiName,
      args: JSON.stringify(args ?? null),
      timeout: timeoutTicks,
      timestamp: this.runtime.currentTick()
    };
    return new Promise((resolve, reject) => {
      const safetyTimeoutMs = (timeoutTicks + SAFETY_MARGIN_TICKS) * 50;
      const safetyCleanupId = this.runtime.scheduler.runTimeout(() => {
        const pending = this.pendingRequests.get(correlationId);
        if (pending) {
          this.pendingRequests.delete(correlationId);
        }
      }, timeoutTicks + SAFETY_MARGIN_TICKS);
      this.pendingRequests.set(correlationId, {
        resolve,
        reject,
        safetyCleanupId
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
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const [, pending] of this.pendingRequests) {
      if (pending.safetyCleanupId !== void 0) {
        this.runtime.scheduler.clearRun(pending.safetyCleanupId);
      }
    }
    this.pendingRequests.clear();
    this.resultListener?.dispose();
    this.resultListener = void 0;
  }
  handleApiResult(correlationId, message) {
    const pending = this.pendingRequests.get(correlationId);
    if (!pending) return;
    this.pendingRequests.delete(correlationId);
    if (pending.safetyCleanupId !== void 0) {
      this.runtime.scheduler.clearRun(pending.safetyCleanupId);
    }
    let result;
    try {
      const parsed = safeJsonParse(message, () => new Error("parse failed"));
      if (!validateApiResult(parsed)) {
        throw new ProtocolError(
          "Invalid ApiResult schema",
          "local_parse",
          "ApiResult",
          correlationId
        );
      }
      result = parsed;
    } catch (e) {
      pending.reject(
        e instanceof ProtocolError ? e : new ProtocolError("Failed to parse ApiResult", "local_parse", "ApiResult", correlationId)
      );
      return;
    }
    if (result.success) {
      try {
        const value = result.result !== void 0 ? JSON.parse(result.result) : void 0;
        pending.resolve(value);
      } catch {
        pending.reject(new ProtocolError("Failed to parse ApiResult.result", "local_parse", "ApiResult", correlationId));
      }
      return;
    }
    if (result.cancelled) {
      pending.resolve({
        cancelled: true,
        reason: result.reason
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
      case "PROTOCOL_ERROR":
        pending.reject(new ProtocolError(result.error ?? "Remote protocol error", "remote", "ApiResult", correlationId));
        break;
      default:
        pending.reject(new ProtocolError("Unknown error type", "remote", "ApiResult", correlationId));
    }
  }
};
var validateApiResult = compile(ApiResultSchema);

// src/router/api/KairoApiRegistry.ts
var KairoApiRegistry = class {
  sealed = false;
  apiHandlers = /* @__PURE__ */ new Map();
  hookDeclarations = [];
  sequenceCounter = 0;
  register(apiName, handler) {
    this.assertNotSealed();
    if (this.apiHandlers.has(apiName)) {
      throw new Error(`[kairo-router] API "${apiName}" is already registered`);
    }
    this.apiHandlers.set(apiName, handler);
  }
  hook(targetAddonId, apiName, options) {
    this.assertNotSealed();
    if (!options.before && !options.after) {
      throw new Error("[kairo-router] hook must have at least one of before or after");
    }
    const modes = options.modes ?? (options.after ? ["request"] : ["send", "request"]);
    this.hookDeclarations.push({
      targetAddonId,
      apiName,
      priority: options.priority ?? 0,
      modes,
      sequence: this.sequenceCounter++,
      before: options.before,
      after: options.after,
      rollback: options.rollback
    });
  }
  seal() {
    this.sealed = true;
  }
  setDeclaringAddonId(addonId) {
    for (const decl of this.hookDeclarations) {
      if (!decl.declaringAddonId) {
        decl.declaringAddonId = addonId;
      }
    }
  }
  getApiHandler(apiName) {
    return this.apiHandlers.get(apiName);
  }
  getApiNames() {
    return [...this.apiHandlers.keys()];
  }
  getHookDeclarations() {
    return this.hookDeclarations;
  }
  dispose() {
    this.seal();
  }
  assertNotSealed() {
    if (this.sealed) {
      throw new Error(
        "[kairo-router] API registration is only allowed during the startup event"
      );
    }
  }
};

// src/router/api/InvokeHandler.ts
import { compile as compile2, safeJsonParse as safeJsonParse2 } from "@kairo-js/utils";
var InvokeHandler = class {
  constructor(runtime, apiRegistry, getKairoKairoId, getOwnKairoId) {
    this.runtime = runtime;
    this.apiRegistry = apiRegistry;
    this.getKairoKairoId = getKairoKairoId;
    this.getOwnKairoId = getOwnKairoId;
  }
  listener;
  disposed = false;
  setup() {
    const ownKairoId = this.getOwnKairoId();
    this.listener = this.runtime.receive((id, message) => {
      if (id !== `${ownKairoId}:api-invoke`) return;
      void this.handleInvoke(message);
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.listener?.dispose();
    this.listener = void 0;
  }
  async handleInvoke(message) {
    let invoke;
    try {
      const parsed = safeJsonParse2(message, () => new Error("parse failed"));
      if (!validateApiInvoke(parsed)) {
        console.warn("[kairo-router] InvokeHandler: invalid ApiInvoke schema");
        return;
      }
      invoke = parsed;
    } catch {
      console.warn("[kairo-router] InvokeHandler: failed to parse ApiInvoke");
      return;
    }
    if (invoke.type === "send") {
      await this.executeHandler(invoke, false);
    } else {
      await this.executeHandler(invoke, true);
    }
  }
  async executeHandler(invoke, sendResponse) {
    const handler = this.apiRegistry.getApiHandler(invoke.apiName);
    if (!handler) {
      if (sendResponse) {
        this.sendHandlerResponse(invoke.correlationId, false, void 0, `Handler for "${invoke.apiName}" not found`);
      }
      return;
    }
    let args;
    try {
      args = JSON.parse(invoke.args);
    } catch {
      if (sendResponse) {
        this.sendHandlerResponse(invoke.correlationId, false, void 0, "Failed to parse args");
      }
      return;
    }
    let result;
    try {
      result = await handler(args);
    } catch (e) {
      if (sendResponse) {
        const message = e instanceof Error ? e.message : String(e);
        this.sendHandlerResponse(invoke.correlationId, false, void 0, message);
      } else {
        console.warn("[kairo-router] InvokeHandler: handler threw (send mode):", e);
      }
      return;
    }
    if (!sendResponse) return;
    let resultStr;
    try {
      resultStr = JSON.stringify(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Result is not JSON serializable";
      this.sendHandlerResponse(invoke.correlationId, false, void 0, message);
      return;
    }
    this.sendHandlerResponse(invoke.correlationId, true, resultStr, void 0);
  }
  sendHandlerResponse(correlationId, success, result, error) {
    const response = {
      correlationId,
      success,
      ...result !== void 0 ? { result } : {},
      ...error !== void 0 ? { error } : {},
      timestamp: this.runtime.currentTick()
    };
    try {
      this.runtime.send("kairo:api-response", JSON.stringify(response));
    } catch (e) {
      console.warn("[kairo-router] InvokeHandler: failed to send ApiHandlerResponse:", e);
    }
  }
};
var validateApiInvoke = compile2(ApiInvokeSchema);

// src/router/events/classes/AddonActivateAfterEvent.ts
var AddonActivateAfterEvent = class {
};

// src/router/events/classes/AddonDeactivateBeforeEvent.ts
var AddonDeactivateBeforeEvent = class {
};

// src/router/errors/KairoRouterError.ts
var KairoRouterError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "KairoRouterError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES = {
  ["Inactive" /* Inactive */]: "KairoRouter is inactive."
};

// src/router/events/types/InternalEvent.ts
var InternalEvent = class {
  constructor(isActive, options = {
    requireActiveOnSubscribe: true,
    clearOnDeactivate: true
  }) {
    this.isActive = isActive;
    this.options = options;
  }
  listeners = /* @__PURE__ */ new Set();
  subscribe(fn) {
    if (this.options.requireActiveOnSubscribe && !this.isActive()) {
      throw new KairoRouterError("Inactive" /* Inactive */);
    }
    this.listeners.add(fn);
    return {
      dispose: () => this.unsubscribe(fn)
    };
  }
  unsubscribe(fn) {
    this.listeners.delete(fn);
  }
  emit(arg) {
    for (const fn of this.listeners) {
      try {
        fn(arg);
      } catch (e) {
        console.warn("[kairo-router] event listener threw an error:", e);
      }
    }
  }
  clear() {
    this.listeners.clear();
  }
  shouldClearOnDeactivate() {
    return this.options.clearOnDeactivate;
  }
};

// src/router/events/EventRegistry.ts
var EventRegistry = class {
  constructor(isActive) {
    this.isActive = isActive;
  }
  afterStore = /* @__PURE__ */ new Map();
  beforeStore = /* @__PURE__ */ new Map();
  getOrCreateEvent(phase, name) {
    const eventName = name;
    if (phase === "after") {
      const store = this.afterStore;
      const key = name;
      if (!store.has(key)) {
        const options = eventName === "addonActivate" ? { requireActiveOnSubscribe: false, clearOnDeactivate: false } : void 0;
        store.set(key, new InternalEvent(this.isActive, options));
      }
      return store.get(key);
    } else {
      const store = this.beforeStore;
      const key = name;
      if (!store.has(key)) {
        const options = eventName === "addonDeactivate" ? { requireActiveOnSubscribe: false, clearOnDeactivate: false } : void 0;
        store.set(key, new InternalEvent(this.isActive, options));
      }
      return store.get(key);
    }
  }
  getAfter(name) {
    return this.getOrCreateEvent("after", name);
  }
  getBefore(name) {
    return this.getOrCreateEvent("before", name);
  }
  emit(phase, name, payload) {
    if (!this.isActive()) {
      throw new KairoRouterError("Inactive" /* Inactive */);
    }
    this.getOrCreateEvent(phase, name).emit(payload);
  }
  clearActiveScopedListeners() {
    for (const event of this.afterStore.values()) {
      if (event.shouldClearOnDeactivate()) event.clear();
    }
    for (const event of this.beforeStore.values()) {
      if (event.shouldClearOnDeactivate()) event.clear();
    }
  }
};

// src/router/errors/KairoContextError.ts
var KairoContextError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES2[reason], { cause: options.cause });
    this.name = "KairoContextError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES2 = {
  ["KairoIdNotSet" /* KairoIdNotSet */]: "kairo: kairoId not set.",
  ["KairoIdAlreadySet" /* KairoIdAlreadySet */]: "kairo: kairoId is already set.",
  ["RegistryNotCompleted" /* RegistryNotCompleted */]: "kairo: Registry not completed.",
  ["RegistryAlreadyCompleted" /* RegistryAlreadyCompleted */]: "kairo: Registry is already completed."
};

// src/router/KairoContext.ts
var MutableKairoContextState = class {
  kairoId;
  kairoRegistry;
  activationState = "inactive";
};
var KairoContext = class {
  constructor(_state, _properties) {
    this._state = _state;
    this._properties = _properties;
    Object.freeze(this._properties);
  }
  get addonProperties() {
    return this._properties;
  }
  get kairoId() {
    if (!this._state.kairoId) {
      throw new KairoContextError("KairoIdNotSet" /* KairoIdNotSet */);
    }
    return this._state.kairoId;
  }
  get kairoRegistry() {
    if (!this._state.kairoRegistry) {
      throw new KairoContextError("RegistryNotCompleted" /* RegistryNotCompleted */);
    }
    return this._state.kairoRegistry;
  }
  isActive() {
    return this._state.activationState === "active";
  }
  isRegistered() {
    return !!this._state.kairoRegistry;
  }
};
function createKairoContext(properties) {
  const state = new MutableKairoContextState();
  const context = new KairoContext(state, properties);
  const mutator = {
    setKairoId(value) {
      if (state.kairoId) {
        throw new KairoContextError("KairoIdAlreadySet" /* KairoIdAlreadySet */);
      }
      state.kairoId = value;
    },
    setKairoRegistry(value) {
      if (state.kairoRegistry) {
        throw new KairoContextError("RegistryAlreadyCompleted" /* RegistryAlreadyCompleted */);
      }
      state.kairoRegistry = Object.freeze(value);
    },
    setActivationState(value) {
      state.activationState = value;
    }
  };
  return { context, mutator };
}

// src/router/errors/KairoListenerError.ts
var KairoListenerError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES3[reason], { cause: options.cause });
    this.name = "KairoListenerError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES3 = {
  ["AlreadySetUp" /* AlreadySetUp */]: "Listener is already set up."
};

// src/router/ReadyBufferedListener.ts
var ReadyBufferedListener = class {
  constructor(readyState) {
    this.readyState = readyState;
  }
  MAX_PENDING = 1e3;
  pendingMessages = [];
  isSetup = false;
  setup(runtime) {
    if (this.isSetup) {
      throw new KairoListenerError("AlreadySetUp" /* AlreadySetUp */);
    }
    this.isSetup = true;
    const receiveSub = runtime.receive(this.onEvent);
    const readySub = this.readyState.onReady(this.flush);
    return {
      dispose: () => {
        receiveSub.dispose();
        readySub.dispose();
      }
    };
  }
  onEvent = (id, message) => {
    if (!this.filter(id)) return;
    const typedId = id;
    if (this.readyState.isReady() && this.pendingMessages.length === 0) {
      this.handle(typedId, message);
      return;
    }
    if (!this.readyState.isReady()) {
      if (this.pendingMessages.length >= this.MAX_PENDING) {
        this.pendingMessages.shift();
      }
      this.pendingMessages.push({ id: typedId, message });
      return;
    }
    this.handle(typedId, message);
  };
  flush = () => {
    const messages = this.pendingMessages;
    this.pendingMessages = [];
    for (const { id, message } of messages) {
      this.handle(id, message);
    }
  };
};

// src/router/activation/ActivationRequestListener.ts
var ActivationRequestListener = class extends ReadyBufferedListener {
  constructor(readyState, handlers) {
    super(readyState);
    this.handlers = handlers;
  }
  filter(id) {
    return Object.hasOwn(this.handlers, id);
  }
  handle(id, message) {
    this.handlers?.[id]?.(message);
  }
};

// src/router/activation/ActivationResponder.ts
import { toError } from "@kairo-js/utils";

// src/router/activation/response/errors.ts
var ActivationResponseError = class extends Error {
  reason;
  cause;
  constructor(reason, options) {
    super(DEFAULT_MESSAGES4[reason], { cause: options.cause });
    this.name = "ActivationResponseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES4 = {
  ["StringifyFailed" /* StringifyFailed */]: "Failed to stringify activation response."
};

// src/router/activation/response/stringify.ts
import fastJson from "fast-json-stringify";

// src/router/activation/response/schema.ts
import { Type as Type2 } from "@sinclair/typebox";
var ActivationResponseSchema = Type2.Object(
  {
    timestamp: Type2.Integer({ minimum: 0 }),
    kairoId: Type2.String(),
    status: Type2.Union([Type2.Literal("success"), Type2.Literal("failure")]),
    action: Type2.Union([Type2.Literal("activate"), Type2.Literal("deactivate")]),
    reason: Type2.Optional(Type2.String())
  },
  { additionalProperties: false }
);

// src/router/activation/response/stringify.ts
var stringifyActivationResponse = fastJson(ActivationResponseSchema);

// src/router/activation/ActivationResponder.ts
var ActivationResponder = class {
  constructor() {
  }
  respond(result, runtime) {
    const response = {
      kairoId: result.kairoId,
      status: result.status,
      action: result.action,
      reason: result.reason,
      timestamp: runtime.currentTick()
    };
    try {
      const responseStr = stringifyActivationResponse(response);
      runtime.send("kairo:activetion_response" /* ActivationResponse */, responseStr);
    } catch (e) {
      throw new ActivationResponseError("StringifyFailed" /* StringifyFailed */, {
        cause: toError(e)
      });
    }
  }
};

// src/router/activation/ActivationRequestParser.ts
import { safeJsonParse as safeJsonParse3, toError as toError2 } from "@kairo-js/utils";

// src/router/activation/request/errors.ts
var ActivationRequestParseError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(REQUEST_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "ActivationRequestParseError";
    this.reason = reason;
  }
};
var REQUEST_PARSE_DEFAULT_MESSAGES = {
  ["InvalidJSON" /* InvalidJSON */]: "Failed to parse ActivationRequest JSON.",
  ["InvalidStructure" /* InvalidStructure */]: "Invalid ActivationRequest structure."
};
var ActivationRequestError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(REQUEST_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "ActivationRequestError";
    this.reason = reason;
  }
};
var REQUEST_DEFAULT_MESSAGES = {
  ["Timeout" /* Timeout */]: "ActivationRequest has timed out.",
  ["FutureTimestamp" /* FutureTimestamp */]: "ActivationRequest timestamp is in the future.",
  ["AlreadyActivated" /* AlreadyActivated */]: "Addon is already activated.",
  ["AlreadyDeactivated" /* AlreadyDeactivated */]: "Addon is already deactivated."
};

// src/router/activation/request/validate.ts
import { compile as compile3 } from "@kairo-js/utils";

// src/router/activation/request/schema.ts
import { Type as Type3 } from "@sinclair/typebox";
var ActivationRequestSchema = Type3.Object({
  timestamp: Type3.Integer({ minimum: 0 }),
  action: Type3.Union([Type3.Literal("activate"), Type3.Literal("deactivate")])
});

// src/router/activation/request/validate.ts
var validateActivationRequest = compile3(ActivationRequestSchema);

// src/router/activation/ActivationRequestParser.ts
var ActivationRequestParser = class {
  parse(message) {
    const parsed = safeJsonParse3(
      message,
      () => new ActivationRequestParseError("InvalidJSON" /* InvalidJSON */)
    );
    if (!validateActivationRequest(parsed)) {
      throw new ActivationRequestParseError(
        "InvalidStructure" /* InvalidStructure */,
        {
          cause: toError2(validateActivationRequest.errors)
        }
      );
    }
    const request = parsed;
    return request;
  }
};

// src/router/activation/ActivationRequestValidator.ts
import { validateTimestamp } from "@kairo-js/utils";
var ActivationRequestValidator = class {
  TIMEOUT_TICKS = 10;
  validateRequest(request, currentTick, isActive) {
    this.validateTimestamp(request, currentTick);
    this.validateState(request, isActive);
  }
  validateTimestamp(request, currentTick) {
    validateTimestamp(
      currentTick,
      request.timestamp,
      this.TIMEOUT_TICKS,
      () => new ActivationRequestError("Timeout" /* Timeout */),
      () => new ActivationRequestError("FutureTimestamp" /* FutureTimestamp */)
    );
  }
  validateState(request, isActive) {
    if (request.action === "activate") {
      if (isActive) {
        throw new ActivationRequestError("AlreadyActivated" /* AlreadyActivated */);
      }
      return;
    }
    if (!isActive) {
      throw new ActivationRequestError("AlreadyDeactivated" /* AlreadyDeactivated */);
    }
  }
};

// src/router/activation/AddonActivationManager.ts
var AddonActivationManager = class {
  parser = new ActivationRequestParser();
  validator = new ActivationRequestValidator();
  resolveRequest(message, currentTick, context) {
    const request = this.parser.parse(message);
    this.validator.validateRequest(request, currentTick, context.isActive());
    return request;
  }
};

// src/router/activation/ActivationController.ts
var ActivationController = class {
  constructor(runtime, context, contextMutator, readyState, eventRegistry, lifecycle) {
    this.runtime = runtime;
    this.context = context;
    this.contextMutator = contextMutator;
    this.readyState = readyState;
    this.eventRegistry = eventRegistry;
    this.lifecycle = lifecycle;
    this.activationRequestListener = new ActivationRequestListener(readyState, {
      [this.context.kairoId + ":" + "activation_request" /* ActivationRequest */]: this.handleActivationRequest
    });
  }
  activationManager = new AddonActivationManager();
  activationRequestListener;
  activationResponder = new ActivationResponder();
  setup() {
    this.activationRequestListener.setup(this.runtime);
  }
  handleActivationRequest = (message) => {
    const currentTick = this.runtime.currentTick();
    const request = this.activationManager.resolveRequest(message, currentTick, this.context);
    const result = this.apply(request);
    this.activationResponder.respond(result, this.runtime);
  };
  apply(request) {
    const next = request.action === "activate" ? "active" : "inactive";
    if (next === "inactive") {
      this.eventRegistry.emit("before", "addonDeactivate", new AddonDeactivateBeforeEvent());
    }
    this.contextMutator.setActivationState(next);
    if (next === "active") {
      this.lifecycle.onActivate();
      this.eventRegistry.emit("after", "addonActivate", new AddonActivateAfterEvent());
    } else {
      this.lifecycle.onDeactivate();
      this.eventRegistry.clearActiveScopedListeners();
    }
    return {
      kairoId: this.context.kairoId,
      status: "success",
      action: request.action
    };
  }
};

// src/router/types/Subscribable.ts
function asSubscribable(event) {
  return {
    subscribe: (fn) => event.subscribe(fn),
    unsubscribe: (fn) => event.unsubscribe(fn)
  };
}

// src/router/events/KairoAfterEvents.ts
var KairoAfterEvents = class {
  constructor(registry) {
    this.registry = registry;
    this.addonActivate = asSubscribable(this.registry.getAfter("addonActivate"));
    this.blockExplode = asSubscribable(this.registry.getAfter("blockExplode"));
    this.buttonPush = asSubscribable(this.registry.getAfter("buttonPush"));
    this.dataDrivenEntityTrigger = asSubscribable(this.registry.getAfter("dataDrivenEntityTrigger"));
    this.effectAdd = asSubscribable(this.registry.getAfter("effectAdd"));
    this.entityDie = asSubscribable(this.registry.getAfter("entityDie"));
    this.entityHeal = asSubscribable(this.registry.getAfter("entityHeal"));
    this.entityHealthChanged = asSubscribable(this.registry.getAfter("entityHealthChanged"));
    this.entityHitBlock = asSubscribable(this.registry.getAfter("entityHitBlock"));
    this.entityHitEntity = asSubscribable(this.registry.getAfter("entityHitEntity"));
    this.entityHurt = asSubscribable(this.registry.getAfter("entityHurt"));
    this.entityItemDrop = asSubscribable(this.registry.getAfter("entityItemDrop"));
    this.entityItemPickup = asSubscribable(this.registry.getAfter("entityItemPickup"));
    this.entityLoad = asSubscribable(this.registry.getAfter("entityLoad"));
    this.entityRemove = asSubscribable(this.registry.getAfter("entityRemove"));
    this.entitySpawn = asSubscribable(this.registry.getAfter("entitySpawn"));
    this.explosion = asSubscribable(this.registry.getAfter("explosion"));
    this.gameRuleChange = asSubscribable(this.registry.getAfter("gameRuleChange"));
    this.itemCompleteUse = asSubscribable(this.registry.getAfter("itemCompleteUse"));
    this.itemReleaseUse = asSubscribable(this.registry.getAfter("itemReleaseUse"));
    this.itemStartUse = asSubscribable(this.registry.getAfter("itemStartUse"));
    this.itemStartUseOn = asSubscribable(this.registry.getAfter("itemStartUseOn"));
    this.itemStopUse = asSubscribable(this.registry.getAfter("itemStopUse"));
    this.itemStopUseOn = asSubscribable(this.registry.getAfter("itemStopUseOn"));
    this.itemUse = asSubscribable(this.registry.getAfter("itemUse"));
    this.leverAction = asSubscribable(this.registry.getAfter("leverAction"));
    this.pistonActivate = asSubscribable(this.registry.getAfter("pistonActivate"));
    this.playerBreakBlock = asSubscribable(this.registry.getAfter("playerBreakBlock"));
    this.playerButtonInput = asSubscribable(this.registry.getAfter("playerButtonInput"));
    this.playerDimensionChange = asSubscribable(this.registry.getAfter("playerDimensionChange"));
    this.playerEmote = asSubscribable(this.registry.getAfter("playerEmote"));
    this.playerGameModeChange = asSubscribable(this.registry.getAfter("playerGameModeChange"));
    this.playerHotbarSelectedSlotChange = asSubscribable(this.registry.getAfter("playerHotbarSelectedSlotChange"));
    this.playerInputModeChange = asSubscribable(this.registry.getAfter("playerInputModeChange"));
    this.playerInputPermissionCategoryChange = asSubscribable(this.registry.getAfter("playerInputPermissionCategoryChange"));
    this.playerInteractWithBlock = asSubscribable(this.registry.getAfter("playerInteractWithBlock"));
    this.playerInteractWithEntity = asSubscribable(this.registry.getAfter("playerInteractWithEntity"));
    this.playerInventoryItemChange = asSubscribable(this.registry.getAfter("playerInventoryItemChange"));
    this.playerJoin = asSubscribable(this.registry.getAfter("playerJoin"));
    this.playerLeave = asSubscribable(this.registry.getAfter("playerLeave"));
    this.playerPlaceBlock = asSubscribable(this.registry.getAfter("playerPlaceBlock"));
    this.playerSpawn = asSubscribable(this.registry.getAfter("playerSpawn"));
    this.playerSwingStart = asSubscribable(this.registry.getAfter("playerSwingStart"));
    this.pressurePlatePop = asSubscribable(this.registry.getAfter("pressurePlatePop"));
    this.pressurePlatePush = asSubscribable(this.registry.getAfter("pressurePlatePush"));
    this.projectileHitBlock = asSubscribable(this.registry.getAfter("projectileHitBlock"));
    this.projectileHitEntity = asSubscribable(this.registry.getAfter("projectileHitEntity"));
    this.scriptEventReceive = asSubscribable(this.registry.getAfter("scriptEventReceive"));
    this.targetBlockHit = asSubscribable(this.registry.getAfter("targetBlockHit"));
    this.tripWireTrip = asSubscribable(this.registry.getAfter("tripWireTrip"));
    this.weatherChange = asSubscribable(this.registry.getAfter("weatherChange"));
  }
  addonActivate;
  blockExplode;
  buttonPush;
  dataDrivenEntityTrigger;
  effectAdd;
  entityDie;
  entityHeal;
  entityHealthChanged;
  entityHitBlock;
  entityHitEntity;
  entityHurt;
  entityItemDrop;
  entityItemPickup;
  entityLoad;
  entityRemove;
  entitySpawn;
  explosion;
  gameRuleChange;
  itemCompleteUse;
  itemReleaseUse;
  itemStartUse;
  itemStartUseOn;
  itemStopUse;
  itemStopUseOn;
  itemUse;
  leverAction;
  pistonActivate;
  playerBreakBlock;
  playerButtonInput;
  playerDimensionChange;
  playerEmote;
  playerGameModeChange;
  playerHotbarSelectedSlotChange;
  playerInputModeChange;
  playerInputPermissionCategoryChange;
  playerInteractWithBlock;
  playerInteractWithEntity;
  playerInventoryItemChange;
  playerJoin;
  playerLeave;
  playerPlaceBlock;
  playerSpawn;
  playerSwingStart;
  pressurePlatePop;
  pressurePlatePush;
  projectileHitBlock;
  projectileHitEntity;
  scriptEventReceive;
  targetBlockHit;
  tripWireTrip;
  weatherChange;
};

// src/router/events/KairoBeforeEvents.ts
var KairoBeforeEvents = class {
  constructor(registry, startupEvent) {
    this.registry = registry;
    this.startup = asSubscribable(startupEvent);
    this.addonDeactivate = asSubscribable(this.registry.getBefore("addonDeactivate"));
    this.effectAdd = asSubscribable(this.registry.getBefore("effectAdd"));
    this.entityHeal = asSubscribable(this.registry.getBefore("entityHeal"));
    this.entityItemPickup = asSubscribable(this.registry.getBefore("entityItemPickup"));
    this.entityRemove = asSubscribable(this.registry.getBefore("entityRemove"));
    this.explosion = asSubscribable(this.registry.getBefore("explosion"));
    this.itemUse = asSubscribable(this.registry.getBefore("itemUse"));
    this.playerBreakBlock = asSubscribable(this.registry.getBefore("playerBreakBlock"));
    this.playerGameModeChange = asSubscribable(this.registry.getBefore("playerGameModeChange"));
    this.playerInteractWithBlock = asSubscribable(this.registry.getBefore("playerInteractWithBlock"));
    this.playerInteractWithEntity = asSubscribable(this.registry.getBefore("playerInteractWithEntity"));
    this.playerLeave = asSubscribable(this.registry.getBefore("playerLeave"));
    this.shutdown = asSubscribable(this.registry.getBefore("shutdown"));
    this.weatherChange = asSubscribable(this.registry.getBefore("weatherChange"));
  }
  startup;
  addonDeactivate;
  effectAdd;
  entityHeal;
  entityItemPickup;
  entityRemove;
  explosion;
  itemUse;
  playerBreakBlock;
  playerGameModeChange;
  playerInteractWithBlock;
  playerInteractWithEntity;
  playerLeave;
  shutdown;
  weatherChange;
};

// src/router/events/classes/KairoCustomCommandRegistry.ts
import { CustomCommandStatus } from "@minecraft/server";
var KairoCustomCommandRegistry = class {
  constructor(registry, isActive, getAddonName) {
    this.registry = registry;
    this.isActive = isActive;
    this.getAddonName = getAddonName;
  }
  registerCommand(customCommand, callback) {
    this.registry.registerCommand(customCommand, (origin, ...args) => {
      if (!this.isActive()) {
        const name = this.getAddonName?.() ?? "Addon";
        return { status: CustomCommandStatus.Failure, message: `${name} is inactive.` };
      }
      return callback(origin, ...args);
    });
  }
  registerEnum(name, values) {
    this.registry.registerEnum(name, values);
  }
};

// src/router/events/classes/KairoStartupBeforeEvent.ts
var KairoStartupBeforeEvent = class {
  customCommandRegistry;
  api;
  constructor(ev, isActive, apiRegistry, getAddonName) {
    this.customCommandRegistry = new KairoCustomCommandRegistry(ev.customCommandRegistry, isActive, getAddonName);
    this.api = apiRegistry;
  }
};

// src/router/init/errors.ts
var KairoRouterInitError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES5[reason], { cause: options.cause });
    this.name = "KairoRouterInitError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES5 = {
  ["NotInitialized" /* NotInitialized */]: "Kairo router is not initialized. Call init() first.",
  ["AlreadyInitialized" /* AlreadyInitialized */]: "Kairo router has already been initialized.",
  ["AlreadyDisposed" /* AlreadyDisposed */]: "Kairo router is already disposed.",
  ["InvalidPhase" /* InvalidPhase */]: "Invalid phase for the requested operation.",
  ["RegistrationRejected" /* RegistrationRejected */]: "Addon registration was rejected.",
  ["RegistrationRequestNotFound" /* RegistrationRequestNotFound */]: "Registration request not found."
};

// src/router/init/KairoInitializer.ts
import "@kairo-js/utils";

// src/router/ReadyState.ts
var ReadyState = class {
  ready = false;
  listeners = [];
  isReady() {
    return this.ready;
  }
  markReady() {
    if (this.ready) return;
    this.ready = true;
    for (const l of this.listeners) l();
    this.listeners = [];
  }
  onReady(listener) {
    if (this.ready) {
      listener();
      return { dispose() {
      } };
    }
    this.listeners.push(listener);
    return {
      dispose: () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      }
    };
  }
  wait() {
    if (this.ready) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.onReady(resolve);
    });
  }
};

// src/router/init/constants/KairoInitEventId.ts
var KairoInitEventId = /* @__PURE__ */ ((KairoInitEventId2) => {
  KairoInitEventId2["DiscoveryQuery"] = "kairo:discovery_query";
  KairoInitEventId2["DiscoveryResponse"] = "kairo:discovery_response";
  KairoInitEventId2["RegistrationRequest"] = "kairo:registration_request";
  KairoInitEventId2["RegistrationResponse"] = "kairo:registration_response";
  KairoInitEventId2["RegistrationResult"] = "kairo:registration_result";
  return KairoInitEventId2;
})(KairoInitEventId || {});

// src/router/init/discovery/idProvider/errors.ts
var ProvideKairoIdError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES6[reason], { cause: options.cause });
    this.name = "ProvideKairoIdError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES6 = {
  ["IdGenerationFailed" /* IdGenerationFailed */]: "Failed to generate a unique addon ID."
};

// src/router/init/KairoIdProvider.ts
var KairoIdProvider = class {
  constructor(random) {
    this.random = random;
  }
  CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?_-().";
  PREFIX_LENGTH = 8;
  ID_LENGTH = 16;
  provideId(idRegistry, addonId) {
    const prefix = this.hash(addonId);
    let kairoId;
    let attempts = 0;
    do {
      kairoId = `${prefix}-${this.generateId()}`;
      attempts++;
      if (attempts > 100) {
        throw new ProvideKairoIdError("IdGenerationFailed" /* IdGenerationFailed */);
      }
    } while (idRegistry.has(kairoId));
    idRegistry.register(kairoId);
    return kairoId;
  }
  generateId(length = this.ID_LENGTH) {
    const chars = this.CHARSET;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[this.random.next() * chars.length | 0];
    }
    return result;
  }
  hash(input) {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(36).padStart(this.PREFIX_LENGTH, "0");
  }
};

// src/router/init/discovery/DiscoveryQueryParser.ts
import { safeJsonParse as safeJsonParse4, toError as toError3 } from "@kairo-js/utils";

// src/router/init/discovery/query/errors.ts
var DiscoveryQueryParseError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(QUERY_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "DiscoveryQueryParseError";
    this.reason = reason;
  }
};
var QUERY_PARSE_DEFAULT_MESSAGES = {
  ["InvalidJSON" /* InvalidJSON */]: "Failed to parse DiscoveryQuery JSON.",
  ["InvalidStructure" /* InvalidStructure */]: "Invalid DiscoveryQuery structure."
};
var DiscoveryQueryError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(QUERY_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "DiscoveryQueryError";
    this.reason = reason;
  }
};
var QUERY_DEFAULT_MESSAGES = {
  ["Timeout" /* Timeout */]: "DiscoveryQuery has timed out.",
  ["FutureTimestamp" /* FutureTimestamp */]: "DiscoveryQuery timestamp is in the future."
};

// src/router/init/discovery/query/validate.ts
import { compile as compile4 } from "@kairo-js/utils";

// src/router/init/discovery/query/schema.ts
import { Type as Type4 } from "@sinclair/typebox";
var DiscoveryQuerySchema = Type4.Object(
  {
    timestamp: Type4.Integer({ minimum: 0 }),
    registryId: Type4.String()
  },
  {
    additionalProperties: false
  }
);

// src/router/init/discovery/query/validate.ts
var validateDiscoveryQuery = compile4(DiscoveryQuerySchema);

// src/router/init/discovery/DiscoveryQueryParser.ts
var DiscoveryQueryParser = class {
  constructor() {
  }
  parse(message) {
    const parsed = safeJsonParse4(
      message,
      () => new DiscoveryQueryParseError("InvalidJSON" /* InvalidJSON */)
    );
    if (!validateDiscoveryQuery(parsed)) {
      throw new DiscoveryQueryParseError("InvalidStructure" /* InvalidStructure */, {
        cause: toError3(validateDiscoveryQuery.errors)
      });
    }
    const query = parsed;
    return query;
  }
};

// src/router/init/discovery/DiscoveryQueryValidator.ts
import { validateTimestamp as validateTimestamp2 } from "@kairo-js/utils";
var DiscoveryQueryValidator = class {
  TIMEOUT_TICKS = 10;
  validateRequest(query, currentTick) {
    this.validateTimestamp(query, currentTick);
  }
  validateTimestamp(query, currentTick) {
    validateTimestamp2(
      currentTick,
      query.timestamp,
      this.TIMEOUT_TICKS,
      () => new DiscoveryQueryError("Timeout" /* Timeout */),
      () => new DiscoveryQueryError("FutureTimestamp" /* FutureTimestamp */)
    );
  }
};

// src/router/init/discovery/AddonDiscoveryManager.ts
var AddonDiscoveryManager = class {
  constructor(idProvider) {
    this.idProvider = idProvider;
  }
  parser = new DiscoveryQueryParser();
  validator = new DiscoveryQueryValidator();
  resolveKairoId(message, runtime, addonId) {
    const query = this.parser.parse(message);
    this.validator.validateRequest(query, runtime.currentTick());
    const idRegistry = runtime.createIdRegistry(query.registryId);
    return this.idProvider.provideId(idRegistry, addonId);
  }
};

// src/router/init/discovery/DiscoveryResponder.ts
import { toError as toError4 } from "@kairo-js/utils";

// src/router/init/discovery/response/errors.ts
var DiscoveryResponseError = class extends Error {
  reason;
  cause;
  constructor(reason, options) {
    super(DEFAULT_MESSAGES7[reason], { cause: options.cause });
    this.name = "DiscoveryResponseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES7 = {
  ["StringifyFailed" /* StringifyFailed */]: "Failed to stringify discovery response."
};

// src/router/init/discovery/response/stringify.ts
import fastJson2 from "fast-json-stringify";

// src/router/init/discovery/response/schema.ts
import { Type as Type5 } from "@sinclair/typebox";
var DiscoveryResponseSchema = Type5.Object(
  {
    kairoId: Type5.String(),
    timestamp: Type5.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);

// src/router/init/discovery/response/stringify.ts
var stringifyDiscoveryResponse = fastJson2(DiscoveryResponseSchema);

// src/router/init/discovery/DiscoveryResponder.ts
var DiscoveryResponder = class {
  constructor() {
  }
  respond(runtime, kairoId) {
    const response = {
      kairoId,
      timestamp: runtime.currentTick()
    };
    try {
      const responseStr = stringifyDiscoveryResponse(response);
      runtime.send("kairo:discovery_response" /* DiscoveryResponse */, responseStr);
    } catch (e) {
      throw new DiscoveryResponseError("StringifyFailed" /* StringifyFailed */, {
        cause: toError4(e)
      });
    }
  }
};

// src/router/init/discovery/DiscoveryController.ts
var DiscoveryController = class {
  constructor(idProvider) {
    this.idProvider = idProvider;
    this.discoveryManager = new AddonDiscoveryManager(this.idProvider);
    this.discoveryResponder = new DiscoveryResponder();
  }
  discoveryManager;
  discoveryResponder;
  handleDiscoveryQuery = (message, deps) => {
    const kairoId = this.discoveryManager.resolveKairoId(
      message,
      deps.runtime,
      deps.context.addonProperties.id
    );
    this.discoveryResponder.respond(deps.runtime, kairoId);
    deps.contextMutator.setKairoId(kairoId);
  };
};

// src/router/init/KairoInitListener.ts
var KAIRO_INIT_EVENT_ID_SET = new Set(Object.values(KairoInitEventId));
var KairoInitListener = class extends ReadyBufferedListener {
  constructor(readyState, handlers) {
    super(readyState);
    this.handlers = handlers;
  }
  filter(id) {
    return KAIRO_INIT_EVENT_ID_SET.has(id);
  }
  handle(id, message) {
    this.handlers?.[id]?.(message);
  }
};

// src/router/init/KairoRegistryBuilder.ts
var KairoRegistryBuilder = class {
  build(kairoId, properties) {
    return {
      kairoId,
      addonId: properties.id,
      name: properties.header.name,
      description: properties.header.description,
      version: properties.header.version,
      metadata: {
        authors: properties.metadata?.authors ?? [],
        url: properties.metadata?.url,
        license: properties.metadata?.license
      },
      dependencies: properties.dependencies ?? {},
      optionalDependencies: properties.optionalDependencies ?? {},
      tags: properties.tags ?? []
    };
  }
};

// src/router/init/registration/RegistrationRequestParser.ts
import { safeJsonParse as safeJsonParse5, toError as toError5 } from "@kairo-js/utils";

// src/router/init/registration/request/errors.ts
var RegistrationRequestParseError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(REQUEST_PARSE_DEFAULT_MESSAGES2[reason], { cause: options.cause });
    this.name = "RegistrationRequestParseError";
    this.reason = reason;
  }
};
var REQUEST_PARSE_DEFAULT_MESSAGES2 = {
  ["InvalidJSON" /* InvalidJSON */]: "Failed to parse RegistrationRequest JSON.",
  ["InvalidStructure" /* InvalidStructure */]: "Invalid RegistrationRequest structure."
};
var RegistrationRequestError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(REQUEST_DEFAULT_MESSAGES2[reason], { cause: options.cause });
    this.name = "RegistrationRequestError";
    this.reason = reason;
  }
};
var REQUEST_DEFAULT_MESSAGES2 = {
  ["Timeout" /* Timeout */]: "RegistrationRequest has timed out.",
  ["FutureTimestamp" /* FutureTimestamp */]: "RegistrationRequest timestamp is in the future."
};

// src/router/init/registration/request/validate.ts
import { compile as compile5 } from "@kairo-js/utils";

// src/router/init/registration/request/schema.ts
import { Type as Type6 } from "@sinclair/typebox";
var RegistrationRequestSchema = Type6.Object(
  {
    approvals: Type6.Array(Type6.String()),
    rejects: Type6.Array(Type6.String()),
    timestamp: Type6.Integer({ minimum: 0 })
  },
  {
    additionalProperties: false
  }
);

// src/router/init/registration/request/validate.ts
var validateRegistrationRequest = compile5(RegistrationRequestSchema);

// src/router/init/registration/RegistrationRequestParser.ts
var RegistrationRequestParser = class {
  parse(message) {
    const parsed = safeJsonParse5(
      message,
      () => new RegistrationRequestParseError("InvalidJSON" /* InvalidJSON */)
    );
    if (!validateRegistrationRequest(parsed)) {
      throw new RegistrationRequestParseError(
        "InvalidStructure" /* InvalidStructure */,
        { cause: toError5(validateRegistrationRequest.errors) }
      );
    }
    const request = parsed;
    return request;
  }
};

// src/router/init/registration/RegistrationRequestValidator.ts
import { validateTimestamp as validateTimestamp3 } from "@kairo-js/utils";
var RegistrationRequestValidator = class {
  TIMEOUT_TICKS = 10;
  validateRequest(request, currentTick) {
    this.validateTimestamp(request, currentTick);
  }
  validateTimestamp(request, currentTick) {
    validateTimestamp3(
      currentTick,
      request.timestamp,
      this.TIMEOUT_TICKS,
      () => new RegistrationRequestError("Timeout" /* Timeout */),
      () => new RegistrationRequestError("FutureTimestamp" /* FutureTimestamp */)
    );
  }
};

// src/router/init/registration/RegistrationResultParser.ts
import { safeJsonParse as safeJsonParse6, toError as toError6 } from "@kairo-js/utils";

// src/router/init/registration/result/errors.ts
var RegistrationResultParseError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(RESULT_PARSE_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "RegistrationResultParseError";
    this.reason = reason;
  }
};
var RESULT_PARSE_DEFAULT_MESSAGES = {
  ["InvalidJSON" /* InvalidJSON */]: "Failed to parse RegistrationResult JSON.",
  ["InvalidStructure" /* InvalidStructure */]: "Invalid RegistrationResult structure."
};
var RegistrationResultError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(RESULT_DEFAULT_MESSAGES[reason], { cause: options.cause });
    this.name = "RegistrationResultError";
    this.reason = reason;
  }
};
var RESULT_DEFAULT_MESSAGES = {
  ["Timeout" /* Timeout */]: "RegistrationResult has timed out.",
  ["FutureTimestamp" /* FutureTimestamp */]: "RegistrationResult timestamp is in the future."
};

// src/router/init/registration/result/validate.ts
import { compile as compile6 } from "@kairo-js/utils";

// src/router/init/registration/result/schema.ts
import { Type as Type7 } from "@sinclair/typebox";
var RegistrationResultSchema = Type7.Object(
  {
    kairoId: Type7.String(),
    success: Type7.Boolean(),
    reason: Type7.Optional(Type7.String()),
    timestamp: Type7.Integer({ minimum: 0 })
  },
  {
    additionalProperties: false
  }
);

// src/router/init/registration/result/validate.ts
var validateRegistrationResult = compile6(RegistrationResultSchema);

// src/router/init/registration/RegistrationResultParser.ts
var RegistrationResultParser = class {
  parse(message) {
    const parsed = safeJsonParse6(
      message,
      () => new RegistrationResultParseError("InvalidJSON" /* InvalidJSON */)
    );
    if (!validateRegistrationResult(parsed)) {
      throw new RegistrationResultParseError(
        "InvalidStructure" /* InvalidStructure */,
        { cause: toError6(validateRegistrationResult.errors) }
      );
    }
    const result = parsed;
    return result;
  }
};

// src/router/init/registration/RegistrationResultValidator.ts
import { validateTimestamp as validateTimestamp4 } from "@kairo-js/utils";
var RegistrationResultValidator = class {
  TIMEOUT_TICKS = 10;
  validateRequest(result, currentTick) {
    this.validateTimestamp(result, currentTick);
  }
  validateTimestamp(result, currentTick) {
    validateTimestamp4(
      currentTick,
      result.timestamp,
      this.TIMEOUT_TICKS,
      () => new RegistrationResultError("Timeout" /* Timeout */),
      () => new RegistrationResultError("FutureTimestamp" /* FutureTimestamp */)
    );
  }
};

// src/router/init/registration/AddonRegistrationManager.ts
var AddonRegistrationManager = class {
  constructor(registryBuilder) {
    this.registryBuilder = registryBuilder;
  }
  requestParser = new RegistrationRequestParser();
  requestValidator = new RegistrationRequestValidator();
  resultParser = new RegistrationResultParser();
  resultValidator = new RegistrationResultValidator();
  resolveRegistry(message, currentTick, kairoId, addonProperties) {
    const request = this.requestParser.parse(message);
    this.requestValidator.validateRequest(request, currentTick);
    if (request.rejects.includes(kairoId)) {
      throw new KairoRouterInitError("RegistrationRejected" /* RegistrationRejected */);
    }
    if (!request.approvals.includes(kairoId)) {
      return;
    }
    const registry = this.registryBuilder.build(kairoId, addonProperties);
    return registry;
  }
  resolveResult(message, currentTick) {
    const result = this.resultParser.parse(message);
    this.resultValidator.validateRequest(result, currentTick);
    return result.success;
  }
};

// src/router/init/registration/RegistrationResponder.ts
import { toError as toError7 } from "@kairo-js/utils";

// src/router/api/ApiManifestBuilder.ts
var ApiManifestBuilder = class {
  build(registry) {
    const apis = registry.getApiNames().map((name) => ({ name }));
    const hooks = registry.getHookDeclarations().map((decl) => {
      const phases = [];
      if (decl.before) phases.push("before");
      if (decl.after) phases.push("after");
      return {
        targetAddonId: decl.targetAddonId,
        apiName: decl.apiName,
        priority: decl.priority,
        phases
      };
    });
    return { apis, hooks };
  }
};

// src/router/init/registration/response/errors.ts
var RegistrationResponseError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES8[reason], { cause: options.cause });
    this.name = "RegistrationResponseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES8 = {
  ["StringifyFailed" /* StringifyFailed */]: "Failed to stringify registration response."
};

// src/router/init/registration/response/stringify.ts
import fastJson3 from "fast-json-stringify";

// src/router/init/registration/response/schema.ts
import { Type as Type8 } from "@sinclair/typebox";
var RegistrationResponseSchema = Type8.Object(
  {
    kairoRegistry: Type8.Object({
      kairoId: Type8.Readonly(Type8.String()),
      addonId: Type8.Readonly(Type8.String()),
      name: Type8.Readonly(Type8.String()),
      description: Type8.Readonly(Type8.String()),
      version: Type8.Readonly(
        Type8.Object({
          major: Type8.Number(),
          minor: Type8.Number(),
          patch: Type8.Number(),
          prerelease: Type8.Optional(Type8.String()),
          build: Type8.Optional(Type8.String())
        })
      ),
      metadata: Type8.Readonly(
        Type8.Object({
          authors: Type8.Readonly(Type8.Array(Type8.String())),
          url: Type8.Optional(Type8.String()),
          license: Type8.Optional(Type8.String())
        })
      ),
      dependencies: Type8.Readonly(Type8.Record(Type8.String(), Type8.String())),
      optionalDependencies: Type8.Readonly(Type8.Record(Type8.String(), Type8.String())),
      tags: Type8.Readonly(Type8.Array(Type8.String()))
    }),
    apiManifest: Type8.Object({
      apis: Type8.Array(Type8.Object({ name: Type8.String() })),
      hooks: Type8.Array(
        Type8.Object({
          targetAddonId: Type8.String(),
          apiName: Type8.String(),
          priority: Type8.Integer({ minimum: -2147483648, maximum: 2147483647 }),
          phases: Type8.Array(
            Type8.Union([Type8.Literal("before"), Type8.Literal("after")])
          )
        })
      )
    }),
    timestamp: Type8.Integer({ minimum: 0 })
  },
  {
    additionalProperties: false
  }
);

// src/router/init/registration/response/stringify.ts
var stringifyRegistrationResponse = fastJson3(
  RegistrationResponseSchema
);

// src/router/init/registration/RegistrationResponder.ts
var RegistrationResponder = class {
  manifestBuilder = new ApiManifestBuilder();
  respond(runtime, kairoRegistry, apiRegistry) {
    const apiManifest = this.manifestBuilder.build(apiRegistry);
    const response = {
      kairoRegistry,
      apiManifest,
      timestamp: runtime.currentTick()
    };
    try {
      const responseStr = stringifyRegistrationResponse(response);
      runtime.send("kairo:registration_response" /* RegistrationResponse */, responseStr);
    } catch (e) {
      throw new RegistrationResponseError("StringifyFailed" /* StringifyFailed */, {
        cause: toError7(e)
      });
    }
  }
};

// src/router/init/registration/RegistrationController.ts
var RegistrationController = class {
  constructor(registryBuilder, apiRegistry) {
    this.registryBuilder = registryBuilder;
    this.apiRegistry = apiRegistry;
    this.registrationManager = new AddonRegistrationManager(this.registryBuilder);
    this.registrationResponder = new RegistrationResponder();
  }
  registrationManager;
  registrationResponder;
  handleRegistrationRequest = (message, deps) => {
    const registry = this.registrationManager.resolveRegistry(
      message,
      deps.runtime.currentTick(),
      deps.context.kairoId,
      deps.context.addonProperties
    );
    if (!registry) return;
    this.registrationResponder.respond(deps.runtime, registry, this.apiRegistry);
    deps.contextMutator.setKairoRegistry(registry);
    this.apiRegistry.setDeclaringAddonId(registry.addonId);
    return registry;
  };
  handleRegistrationResult = (message, deps) => {
    return this.registrationManager.resolveResult(message, deps.runtime.currentTick());
  };
};

// src/router/init/KairoInitializer.ts
var KairoInitializer = class {
  constructor(runtime, context, contextMutator, random, readyState, apiRegistry, onCompleted, onDisposed) {
    this.runtime = runtime;
    this.context = context;
    this.contextMutator = contextMutator;
    this.random = random;
    this.readyState = readyState;
    this.apiRegistry = apiRegistry;
    this.onCompleted = onCompleted;
    this.onDisposed = onDisposed;
    this.idProvider = new KairoIdProvider(this.random);
    this.registryBuilder = new KairoRegistryBuilder();
    this.discoveryController = new DiscoveryController(this.idProvider);
    this.registrationController = new RegistrationController(this.registryBuilder, this.apiRegistry);
    this.initListener = new KairoInitListener(this.readyState, {
      ["kairo:discovery_query" /* DiscoveryQuery */]: this.handleDiscoveryQuery,
      ["kairo:registration_request" /* RegistrationRequest */]: this.handleRegistrationRequest,
      ["kairo:registration_result" /* RegistrationResult */]: this.handleRegistrationResult
    });
  }
  subscription;
  phase = 0 /* Discovery */;
  idProvider;
  registryBuilder;
  initListener;
  discoveryController;
  registrationController;
  setup() {
    this.assertNotDisposed();
    this.subscription = this.initListener.setup(this.runtime);
  }
  dispose() {
    if (this.phase === 3 /* Disposed */) return;
    if (this.phase === 2 /* Completed */) {
      this.disposeSubscription();
      return;
    }
    this.phase = 3 /* Disposed */;
    this.disposeSubscription();
    this.onDisposed?.();
  }
  complete() {
    this.phase = 2 /* Completed */;
    this.disposeSubscription();
    this.onCompleted?.();
  }
  disposeSubscription() {
    this.subscription?.dispose();
    this.subscription = void 0;
  }
  handleDiscoveryQuery = (message) => {
    this.assertPhase(0 /* Discovery */);
    try {
      this.discoveryController.handleDiscoveryQuery(message, {
        runtime: this.runtime,
        context: this.context,
        contextMutator: this.contextMutator
      });
      this.phase = 1 /* Registration */;
    } catch (error) {
      this.dispose();
      throw error;
    }
  };
  handleRegistrationRequest = (message) => {
    this.assertPhase(1 /* Registration */);
    try {
      const registry = this.registrationController.handleRegistrationRequest(message, {
        runtime: this.runtime,
        context: this.context,
        contextMutator: this.contextMutator
      });
      if (!registry) {
        this.dispose();
        return;
      }
    } catch (error) {
      this.dispose();
      throw error;
    }
  };
  handleRegistrationResult = (message) => {
    this.assertPhase(1 /* Registration */);
    try {
      const isSuccess = this.registrationController.handleRegistrationResult(message, {
        runtime: this.runtime
      });
      if (!isSuccess) {
        this.dispose();
        return;
      }
      this.complete();
    } catch (error) {
      this.dispose();
      throw error;
    }
  };
  assertNotDisposed() {
    if (this.phase === 3 /* Disposed */) {
      throw new KairoRouterInitError("AlreadyDisposed" /* AlreadyDisposed */);
    }
  }
  assertPhase(expected) {
    if (this.phase !== expected) {
      throw new KairoRouterInitError("InvalidPhase" /* InvalidPhase */);
    }
  }
};

// src/router/KairoScheduler.ts
var KairoScheduler = class {
  constructor(runtime) {
    this.runtime = runtime;
  }
  active = false;
  tasks = /* @__PURE__ */ new Map();
  setActive(state) {
    this.active = state;
    if (!state) {
      this.tasks.forEach((_, id) => {
        this.runtime.clearRun(id);
      });
      this.tasks.clear();
    }
  }
  runInterval(cb, tick) {
    if (!this.active) {
      throw new Error("Scheduler is inactive");
    }
    const id = this.runtime.runInterval(cb, tick);
    this.tasks.set(id, "interval");
    return id;
  }
  runTimeout(cb, tick) {
    if (!this.active) {
      throw new Error("Scheduler is inactive");
    }
    const id = this.runtime.runTimeout(cb, tick);
    this.tasks.set(id, "timeout");
    return id;
  }
  clearRun(id) {
    this.runtime.clearRun(id);
    this.tasks.delete(id);
  }
};

// src/router/KairoRouter.ts
var KairoRouter = class {
  kairoContext;
  kairoContextMutator;
  runtime;
  scheduler;
  activationCurrentTick = 0;
  activationTickIntervalId;
  readyState = new ReadyState();
  routerListener;
  runtimeInjectedEventListener;
  worldLoadListener;
  initializer;
  disposed = false;
  startupSubscription;
  apiCallSender;
  invokeHandler;
  apiRegistry = new KairoApiRegistry();
  startupEvent = new InternalEvent(
    () => this.kairoContext?.isActive() ?? false,
    { requireActiveOnSubscribe: false, clearOnDeactivate: false }
  );
  eventRegistry = new EventRegistry(() => {
    if (!this.kairoContext) return false;
    return this.kairoContext.isActive();
  });
  afterEvents = new KairoAfterEvents(this.eventRegistry);
  beforeEvents = new KairoBeforeEvents(this.eventRegistry, this.startupEvent);
  constructor() {
    this.startupSubscription = KairoRuntime.onStartup((ev) => {
      const isActive = () => this.kairoContext?.isActive() ?? false;
      const getAddonName = () => this.kairoContext?.isRegistered() ? this.kairoContext.kairoRegistry.name : void 0;
      this.startupEvent.emit(new KairoStartupBeforeEvent(ev, isActive, this.apiRegistry, getAddonName));
      this.apiRegistry.seal();
    });
  }
  get currentTick() {
    this.assertNotDisposed();
    if (!this.runtime) {
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    }
    if (this.activationTickIntervalId === void 0) {
      return 0;
    }
    return this.activationCurrentTick;
  }
  get systemInfo() {
    this.assertRunnable();
    return this.kairoContext;
  }
  clearRun(runId) {
    this.assertRunnable();
    this.scheduler.clearRun(runId);
  }
  getAddonId() {
    return this.kairoContext?.addonProperties.id;
  }
  getHookDeclarations() {
    return this.apiRegistry.getHookDeclarations();
  }
  send(targetAddonId, apiName, args) {
    this.assertRunnable();
    this.apiCallSender.send(targetAddonId, apiName, args);
  }
  request(targetAddonId, apiName, args, options) {
    this.assertRunnable();
    return this.apiCallSender.request(targetAddonId, apiName, args, options);
  }
  init(properties) {
    this.assertNotDisposed();
    if (this.kairoContext) {
      throw new KairoRouterInitError("AlreadyInitialized" /* AlreadyInitialized */);
    }
    this.runtime = new KairoRuntime();
    this.scheduler = new KairoScheduler(this.runtime.scheduler);
    const { context, mutator } = createKairoContext(properties);
    this.kairoContext = context;
    this.kairoContextMutator = mutator;
    this.startWorldLoadListener(this.runtime);
    const initializer = new KairoInitializer(
      this.runtime,
      context,
      mutator,
      new SeedRandom2(),
      this.readyState,
      this.apiRegistry,
      () => {
        this.initializer = void 0;
        this.startRouterListener();
      },
      () => {
        this.initializer = void 0;
        this.dispose();
      }
    );
    this.initializer = initializer;
    initializer.setup();
  }
  waitForWorldLoad() {
    this.assertNotDisposed();
    this.startWorldLoadListener(this.runtime ?? new KairoRuntime());
    return this.readyState.wait();
  }
  runInterval(callback, tickInterval) {
    this.assertRunnable();
    return this.scheduler.runInterval(callback, tickInterval);
  }
  runTimeout(callback, tickDelay) {
    this.assertRunnable();
    return this.scheduler.runTimeout(callback, tickDelay);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.startupSubscription?.dispose();
    this.startupSubscription = void 0;
    this.apiRegistry.dispose();
    this.initializer?.dispose();
    this.initializer = void 0;
    this.stopActivationTickCounter();
    this.detachRuntimeEvents();
    this.routerListener?.dispose();
    this.routerListener = void 0;
    this.worldLoadListener?.dispose();
    this.worldLoadListener = void 0;
    this.apiCallSender?.dispose();
    this.apiCallSender = void 0;
    this.invokeHandler?.dispose();
    this.invokeHandler = void 0;
    this.eventRegistry.clearActiveScopedListeners();
    this.kairoContextMutator?.setActivationState("inactive");
    this.scheduler?.setActive(false);
    this.kairoContext = void 0;
    this.kairoContextMutator = void 0;
    this.scheduler = void 0;
    this.runtime = void 0;
  }
  startWorldLoadListener(runtime) {
    if (this.readyState.isReady() || this.worldLoadListener) return;
    this.worldLoadListener = runtime.onReady(() => {
      this.worldLoadListener?.dispose();
      this.worldLoadListener = void 0;
      runtime.scheduler.runTimeout(() => {
        this.readyState.markReady();
      }, 1);
    });
  }
  startRouterListener() {
    if (!this.runtime || !this.kairoContext || !this.kairoContextMutator) {
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    }
    if (this.routerListener) {
      throw new KairoRouterInitError("AlreadyInitialized" /* AlreadyInitialized */);
    }
    const runtime = this.runtime;
    const context = this.kairoContext;
    this.apiCallSender = new ApiCallSender(runtime, () => context.kairoId);
    this.apiCallSender.setup();
    this.invokeHandler = new InvokeHandler(
      runtime,
      this.apiRegistry,
      () => "kairo",
      () => context.kairoId
    );
    const activationController = new ActivationController(
      this.runtime,
      this.kairoContext,
      this.kairoContextMutator,
      this.readyState,
      this.eventRegistry,
      {
        onActivate: () => {
          this.startActivationTickCounter();
          this.attachRuntimeEvents();
          this.scheduler?.setActive(true);
          this.invokeHandler.setup();
        },
        onDeactivate: () => {
          this.stopActivationTickCounter();
          this.eventRegistry.clearActiveScopedListeners();
          this.detachRuntimeEvents();
          this.scheduler?.setActive(false);
          this.invokeHandler?.dispose();
          this.invokeHandler = new InvokeHandler(
            runtime,
            this.apiRegistry,
            () => "kairo",
            () => context.kairoId
          );
        }
      }
    );
    activationController.setup();
  }
  attachRuntimeEvents() {
    if (!this.runtime)
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    if (this.runtimeInjectedEventListener) return;
    this.runtimeInjectedEventListener = this.runtime.bindEvents((ev) => {
      try {
        if (ev.phase === "after") {
          this.eventRegistry.emit("after", ev.name, ev.payload);
        } else if (ev.phase === "before") {
          this.eventRegistry.emit("before", ev.name, ev.payload);
        }
      } catch {
      }
    });
  }
  detachRuntimeEvents() {
    this.runtimeInjectedEventListener?.dispose();
    this.runtimeInjectedEventListener = void 0;
  }
  startActivationTickCounter() {
    if (!this.runtime) {
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    }
    this.stopActivationTickCounter();
    this.activationCurrentTick = 0;
    this.activationTickIntervalId = this.runtime.scheduler.runInterval(() => {
      this.activationCurrentTick++;
    }, 1);
  }
  stopActivationTickCounter() {
    if (!this.runtime) return;
    if (this.activationTickIntervalId !== void 0) {
      this.runtime.scheduler.clearRun(this.activationTickIntervalId);
      this.activationTickIntervalId = void 0;
    }
    this.activationCurrentTick = 0;
  }
  assertRunnable() {
    this.assertNotDisposed();
    if (!this.kairoContext || !this.runtime || !this.scheduler) {
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    }
    if (!this.kairoContext.isActive()) {
      throw new KairoRouterError("Inactive" /* Inactive */);
    }
  }
  assertNotDisposed() {
    if (this.disposed) {
      throw new KairoRouterInitError("AlreadyDisposed" /* AlreadyDisposed */);
    }
  }
};

// src/index.ts
var router = new KairoRouter();
export {
  AddonActivateAfterEvent,
  AddonDeactivateBeforeEvent,
  AfterHookExecutionError,
  ApiNotFoundError,
  BeforeHookExecutionError,
  HandlerExecutionError,
  KairoContext,
  KairoCustomCommandRegistry,
  KairoRouter,
  KairoStartupBeforeEvent,
  ProtocolError,
  RequestTimeoutError,
  router
};
