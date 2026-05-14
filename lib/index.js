// src/minecraft/KairoRuntime.ts
import { SeedRandom } from "@kairo-js/utils";
import {
  ScriptEventSource,
  system,
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
var minecraftEventBinding = {
  after: {
    addonActivate: (_world, _handler) => ({ dispose: () => {
    } }),
    playerJoin: (world3, handler) => world3.afterEvents.playerJoin.subscribe(handler)
  },
  before: {
    addonDeactivate: (_world, _handler) => ({ dispose: () => {
    } })
  }
};

// src/minecraft/KairoRuntime.ts
var KairoRuntime = class {
  constructor(options = {}) {
    this.options = options;
  }
  currentTick() {
    return system.currentTick;
  }
  send(id, message) {
    system.sendScriptEvent(id, message);
  }
  receive(handler) {
    const listener = (ev) => {
      if (ev.sourceType !== ScriptEventSource.Server) return;
      handler(ev.id, ev.message);
    };
    system.afterEvents.scriptEventReceive.subscribe(listener);
    return {
      dispose: () => system.afterEvents.scriptEventReceive.unsubscribe(listener)
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
    runInterval: (cb, tick) => system.runInterval(cb, tick),
    runTimeout: (cb, tick) => system.runTimeout(cb, tick),
    clearRun: (id) => system.clearRun(id)
  };
};

// src/router/KairoRouter.ts
import { SeedRandom as SeedRandom2 } from "@kairo-js/utils";

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

// src/router/activation/ActivationResponder.ts
import { toError } from "@kairo-js/utils";

// src/router/KairoEventId.ts
var KairoEventId = /* @__PURE__ */ ((KairoEventId2) => {
  KairoEventId2["ActivationRequest"] = "activation_request";
  KairoEventId2["ActivationResponse"] = "kairo:activetion_response";
  return KairoEventId2;
})(KairoEventId || {});

// src/router/activation/response/errors.ts
var ActivationResponseError = class extends Error {
  reason;
  cause;
  constructor(reason, options) {
    super(DEFAULT_MESSAGES3[reason], { cause: options.cause });
    this.name = "ActivationResponseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES3 = {
  ["StringifyFailed" /* StringifyFailed */]: "Failed to stringify activation response."
};

// src/router/activation/response/stringify.ts
import fastJson from "fast-json-stringify";

// src/router/activation/response/schema.ts
import { Type } from "@sinclair/typebox";
var ActivationResponseSchema = Type.Object(
  {
    timestamp: Type.Integer({ minimum: 0 }),
    kairoId: Type.String(),
    status: Type.Union([Type.Literal("success"), Type.Literal("failure")]),
    action: Type.Union([Type.Literal("activate"), Type.Literal("deactivate")]),
    reason: Type.Optional(Type.String())
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
import { safeJsonParse, toError as toError2 } from "@kairo-js/utils";

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
import { compile } from "@kairo-js/utils";

// src/router/activation/request/schema.ts
import { Type as Type2 } from "@sinclair/typebox";
var ActivationRequestSchema = Type2.Object({
  timestamp: Type2.Integer({ minimum: 0 }),
  action: Type2.Union([Type2.Literal("activate"), Type2.Literal("deactivate")])
});

// src/router/activation/request/validate.ts
var validateActivationRequest = compile(ActivationRequestSchema);

// src/router/activation/ActivationRequestParser.ts
var ActivationRequestParser = class {
  parse(message) {
    const parsed = safeJsonParse(
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
  constructor(context, contextMutator, eventRegistry, lifecycle) {
    this.context = context;
    this.contextMutator = contextMutator;
    this.eventRegistry = eventRegistry;
    this.lifecycle = lifecycle;
  }
  activationManager = new AddonActivationManager();
  activationResponder = new ActivationResponder();
  handleActivationRequest = (message, deps) => {
    const currentTick = deps.runtime.currentTick();
    const request = this.activationManager.resolveRequest(message, currentTick, this.context);
    const result = this.apply(request);
    this.activationResponder.respond(result, deps.runtime);
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
    this.playerJoin = asSubscribable(this.registry.getAfter("playerJoin"));
  }
  addonActivate;
  playerJoin;
};

// src/router/events/KairoBeforeEvents.ts
var KairoBeforeEvents = class {
  constructor(registry) {
    this.registry = registry;
    this.addonDeactivate = asSubscribable(this.registry.getBefore("addonDeactivate"));
  }
  addonDeactivate;
};

// src/router/init/errors.ts
var KairoRouterInitError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES4[reason], { cause: options.cause });
    this.name = "KairoRouterInitError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES4 = {
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
    super(DEFAULT_MESSAGES5[reason], { cause: options.cause });
    this.name = "ProvideKairoIdError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES5 = {
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
import { safeJsonParse as safeJsonParse2, toError as toError3 } from "@kairo-js/utils";

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
import { compile as compile2 } from "@kairo-js/utils";

// src/router/init/discovery/query/schema.ts
import { Type as Type3 } from "@sinclair/typebox";
var DiscoveryQuerySchema = Type3.Object(
  {
    timestamp: Type3.Integer({ minimum: 0 }),
    registryId: Type3.String()
  },
  {
    additionalProperties: false
  }
);

// src/router/init/discovery/query/validate.ts
var validateDiscoveryQuery = compile2(DiscoveryQuerySchema);

// src/router/init/discovery/DiscoveryQueryParser.ts
var DiscoveryQueryParser = class {
  constructor() {
  }
  parse(message) {
    const parsed = safeJsonParse2(
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
    super(DEFAULT_MESSAGES6[reason], { cause: options.cause });
    this.name = "DiscoveryResponseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES6 = {
  ["StringifyFailed" /* StringifyFailed */]: "Failed to stringify discovery response."
};

// src/router/init/discovery/response/stringify.ts
import fastJson2 from "fast-json-stringify";

// src/router/init/discovery/response/schema.ts
import { Type as Type4 } from "@sinclair/typebox";
var DiscoveryResponseSchema = Type4.Object(
  {
    kairoId: Type4.String(),
    timestamp: Type4.Integer({ minimum: 0 })
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

// src/router/errors/KairoListenerError.ts
var KairoListenerError = class extends Error {
  reason;
  cause;
  constructor(reason, options = {}) {
    super(DEFAULT_MESSAGES7[reason], { cause: options.cause });
    this.name = "KairoListenerError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES7 = {
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
      peerDependencies: properties.peerDependencies ?? {},
      tags: properties.tags ?? []
    };
  }
};

// src/router/init/registration/RegistrationRequestParser.ts
import { safeJsonParse as safeJsonParse3, toError as toError5 } from "@kairo-js/utils";

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
import { compile as compile3 } from "@kairo-js/utils";

// src/router/init/registration/request/schema.ts
import { Type as Type5 } from "@sinclair/typebox";
var RegistrationRequestSchema = Type5.Object(
  {
    approvals: Type5.Array(Type5.String()),
    rejects: Type5.Array(Type5.String()),
    timestamp: Type5.Integer({ minimum: 0 })
  },
  {
    additionalProperties: false
  }
);

// src/router/init/registration/request/validate.ts
var validateRegistrationRequest = compile3(RegistrationRequestSchema);

// src/router/init/registration/RegistrationRequestParser.ts
var RegistrationRequestParser = class {
  parse(message) {
    const parsed = safeJsonParse3(
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
import { safeJsonParse as safeJsonParse4, toError as toError6 } from "@kairo-js/utils";

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
import { compile as compile4 } from "@kairo-js/utils";

// src/router/init/registration/result/schema.ts
import { Type as Type6 } from "@sinclair/typebox";
var RegistrationResultSchema = Type6.Object(
  {
    kairoId: Type6.String(),
    success: Type6.Boolean(),
    reason: Type6.Optional(Type6.String()),
    timestamp: Type6.Integer({ minimum: 0 })
  },
  {
    additionalProperties: false
  }
);

// src/router/init/registration/result/validate.ts
var validateRegistrationResult = compile4(RegistrationResultSchema);

// src/router/init/registration/RegistrationResultParser.ts
var RegistrationResultParser = class {
  parse(message) {
    const parsed = safeJsonParse4(
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
import { Type as Type7 } from "@sinclair/typebox";
var RegistrationResponseSchema = Type7.Object(
  {
    kairoRegistry: Type7.Object({
      kairoId: Type7.Readonly(Type7.String()),
      addonId: Type7.Readonly(Type7.String()),
      name: Type7.Readonly(Type7.String()),
      description: Type7.Readonly(Type7.String()),
      version: Type7.Readonly(
        Type7.Object({
          major: Type7.Number(),
          minor: Type7.Number(),
          patch: Type7.Number(),
          prerelease: Type7.Optional(Type7.String()),
          build: Type7.Optional(Type7.String())
        })
      ),
      metadata: Type7.Readonly(
        Type7.Object({
          authors: Type7.Readonly(Type7.Array(Type7.String())),
          url: Type7.Optional(Type7.String()),
          license: Type7.Optional(Type7.String())
        })
      ),
      dependencies: Type7.Readonly(Type7.Record(Type7.String(), Type7.String())),
      optionalDependencies: Type7.Readonly(Type7.Record(Type7.String(), Type7.String())),
      peerDependencies: Type7.Readonly(Type7.Record(Type7.String(), Type7.String())),
      tags: Type7.Readonly(Type7.Array(Type7.String()))
    }),
    timestamp: Type7.Integer({ minimum: 0 })
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
  constructor() {
  }
  respond(runtime, kairoRegistry) {
    const response = {
      kairoRegistry,
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
  constructor(registryBuilder) {
    this.registryBuilder = registryBuilder;
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
    this.registrationResponder.respond(deps.runtime, registry);
    deps.contextMutator.setKairoRegistry(registry);
    return registry;
  };
  handleRegistrationResult = (message, deps) => {
    return this.registrationManager.resolveResult(message, deps.runtime.currentTick());
  };
};

// src/router/init/KairoInitializer.ts
var KairoInitializer = class {
  constructor(runtime, context, contextMutator, random, readyState, onCompleted, onDisposed) {
    this.runtime = runtime;
    this.context = context;
    this.contextMutator = contextMutator;
    this.random = random;
    this.readyState = readyState;
    this.onCompleted = onCompleted;
    this.onDisposed = onDisposed;
    this.idProvider = new KairoIdProvider(this.random);
    this.registryBuilder = new KairoRegistryBuilder();
    this.discoveryController = new DiscoveryController(this.idProvider);
    this.registrationController = new RegistrationController(this.registryBuilder);
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

// src/router/KairoRouterListener.ts
var KAIRO_EVENT_ID_SET = new Set(Object.values(KairoEventId));
var KairoRouterListener = class extends ReadyBufferedListener {
  constructor(readyState, handlers) {
    super(readyState);
    this.handlers = handlers;
  }
  filter(id) {
    return KAIRO_EVENT_ID_SET.has(id);
  }
  handle(id, message) {
    this.handlers?.[id]?.(message);
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
  eventRegistry = new EventRegistry(() => {
    if (!this.kairoContext) return false;
    return this.kairoContext.isActive();
  });
  afterEvents = new KairoAfterEvents(this.eventRegistry);
  beforeEvents = new KairoBeforeEvents(this.eventRegistry);
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
  register(targetId, eventId, returnTypes, ...argsTypes) {
  }
  async request(targetId, eventId, ...args) {
  }
  runInterval(callback, tickInterval) {
    this.assertRunnable();
    return this.scheduler.runInterval(callback, tickInterval);
  }
  runTimeout(callback, tickDelay) {
    this.assertRunnable();
    return this.scheduler.runTimeout(callback, tickDelay);
  }
  send(targetId, eventId, ...args) {
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.initializer?.dispose();
    this.initializer = void 0;
    this.stopActivationTickCounter();
    this.detachRuntimeEvents();
    this.routerListener?.dispose();
    this.routerListener = void 0;
    this.worldLoadListener?.dispose();
    this.worldLoadListener = void 0;
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
    const activationController = new ActivationController(
      this.kairoContext,
      this.kairoContextMutator,
      this.eventRegistry,
      {
        onActivate: () => {
          this.startActivationTickCounter();
          this.attachRuntimeEvents();
          this.scheduler?.setActive(true);
        },
        onDeactivate: () => {
          this.stopActivationTickCounter();
          this.eventRegistry.clearActiveScopedListeners();
          this.detachRuntimeEvents();
          this.scheduler?.setActive(false);
        }
      }
    );
    const handlers = this.buildHandlers(activationController);
    const listener = new KairoRouterListener(this.readyState, handlers);
    this.routerListener = listener.setup(this.runtime);
  }
  buildHandlers(controller) {
    return {
      [this.kairoContext?.kairoId + ":" + "activation_request" /* ActivationRequest */]: (message) => this.handleActivationRequest(controller, message)
    };
  }
  handleActivationRequest(controller, message) {
    if (!this.runtime) {
      throw new KairoRouterInitError("NotInitialized" /* NotInitialized */);
    }
    controller.handleActivationRequest(message, {
      runtime: this.runtime
    });
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
  KairoContext,
  KairoRouter,
  router
};
