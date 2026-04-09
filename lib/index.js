// src/router/errors/KairoRouterInitError.ts
var KairoRouterInitError = class extends Error {
  constructor(reason) {
    super(DEFAULT_MESSAGES[reason]);
    this.name = "KairoRouterInitError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES = {
  ["AlreadyInitialized" /* AlreadyInitialized */]: "Kairo router has already been initialized."
};

// src/router/init/discovery/AddonIdProvider.ts
import { world } from "@minecraft/server";

// src/router/errors/DiscoveryProvideIdError.ts
var DiscoveryProvideIdError = class extends Error {
  constructor(reason) {
    super(DEFAULT_MESSAGES2[reason]);
    this.name = "DiscoveryProvideIdError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES2 = {
  ["ObjectiveNotFound" /* ObjectiveNotFound */]: "Scoreboard objective not found.",
  ["IdGenerationFailed" /* IdGenerationFailed */]: "Failed to generate a unique addon ID."
};

// src/router/init/discovery/AddonIdProvider.ts
var AddonIdProvider = class {
  constructor(manager) {
    this.CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?_-().";
    this.PREFIX_LENGTH = 8;
    this.ID_LENGTH = 16;
  }
  provideId(properties, query) {
    const objective = world.scoreboard.getObjective(query.scoreboard.objective.id);
    if (!objective) {
      throw new DiscoveryProvideIdError("ObjectiveNotFound" /* ObjectiveNotFound */);
    }
    const prefix = this.hash(properties.id);
    let addonId;
    let attempts = 0;
    do {
      addonId = `${prefix}-${this.generateId()}`;
      attempts++;
      if (attempts > 100) {
        throw new DiscoveryProvideIdError("IdGenerationFailed" /* IdGenerationFailed */);
      }
    } while (objective.hasParticipant(addonId));
    objective.setScore(addonId, 0);
    return addonId;
  }
  generateId(length = this.ID_LENGTH) {
    const chars = this.CHARSET;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.random() * chars.length | 0];
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

// src/router/init/discovery/DiscoveryQueryListener.ts
import { ScriptEventSource, system } from "@minecraft/server";
var DiscoveryQueryListener = class {
  constructor(manager) {
    this.manager = manager;
    this.onRegistrationQuery = (ev) => {
      const { id, message, sourceType } = ev;
      if (sourceType !== ScriptEventSource.Server) return;
      if (id === "kairo:discovery_query" /* Query */) {
        this.manager.handleRegistrationQuery(message);
      }
    };
  }
  setup() {
    system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
  }
};

// src/router/init/discovery/DiscoveryQueryParser.ts
import { system as system2 } from "@minecraft/server";

// src/router/errors/DiscoveryQueryParserError.ts
var DiscoveryQueryParseError = class extends Error {
  constructor(reason) {
    super(DEFAULT_MESSAGES3[reason]);
    this.name = "DiscoveryQueryParseError";
    this.reason = reason;
  }
};
var DEFAULT_MESSAGES3 = {
  ["InvalidJSON" /* InvalidJSON */]: "Failed to parse DiscoveryQuery JSON.",
  ["InvalidStructure" /* InvalidStructure */]: "Invalid DiscoveryQuery structure.",
  ["Timeout" /* Timeout */]: "DiscoveryQuery has timed out."
};

// src/utils/ajv.ts
import Ajv from "ajv";
var ajv = new Ajv();
function compile(schema) {
  return ajv.compile(schema);
}

// src/router/init/discovery/query/schema.ts
var discoveryQuerySchema = {
  type: "object",
  required: ["timestamp", "scoreboard"],
  properties: {
    timestamp: { type: "number" },
    scoreboard: {
      type: "object",
      required: ["objective"],
      properties: {
        objective: {
          type: "object",
          required: ["id", "displayName"],
          properties: {
            id: { type: "string" },
            displayName: {
              type: "string",
              const: "kairo:id_checker"
            }
          }
        }
      }
    }
  },
  additionalProperties: false
};

// src/router/init/discovery/query/validate.ts
var validateDiscoveryQuery = compile(discoveryQuerySchema);

// src/router/init/discovery/DiscoveryQueryParser.ts
var _DiscoveryQueryParser = class _DiscoveryQueryParser {
  constructor(manager) {
  }
  parse(message) {
    const parsed = this.parseJson(message);
    if (!validateDiscoveryQuery(parsed)) {
      throw new DiscoveryQueryParseError("InvalidStructure" /* InvalidStructure */);
    }
    const query = parsed;
    this.validateTimestamp(query);
    return query;
  }
  parseJson(message) {
    try {
      return JSON.parse(message);
    } catch {
      throw new DiscoveryQueryParseError("InvalidJSON" /* InvalidJSON */);
    }
  }
  validateTimestamp(query) {
    const diff = system2.currentTick - query.timestamp;
    if (diff < 0 || diff > _DiscoveryQueryParser.TIMEOUT_TICKS) {
      throw new DiscoveryQueryParseError("Timeout" /* Timeout */);
    }
  }
};
_DiscoveryQueryParser.TIMEOUT_TICKS = 10;
var DiscoveryQueryParser = _DiscoveryQueryParser;

// src/router/init/discovery/DiscoveryResponder.ts
import { system as system3 } from "@minecraft/server";

// src/router/init/discovery/response/stringify.ts
import fastJson from "fast-json-stringify";

// src/router/init/discovery/response/schema.ts
var discoveryResponseSchema = {
  type: "object",
  properties: {
    addonId: { type: "string" },
    timestamp: { type: "number" }
  },
  required: ["addonId", "timestamp"],
  additionalProperties: false
};

// src/router/init/discovery/response/stringify.ts
var stringifyDiscoveryResponse = fastJson(discoveryResponseSchema);

// src/router/init/discovery/DiscoveryResponder.ts
var DiscoveryResponder = class {
  constructor(manager) {
  }
  respond(addonId) {
    const response = {
      addonId,
      timestamp: system3.currentTick
    };
    system3.sendScriptEvent("kairo:discovery_response" /* Response */, stringifyDiscoveryResponse(response));
  }
};

// src/router/init/discovery/AddonDiscoveryManager.ts
var AddonDiscoveryManager = class {
  constructor(kairoInitializer) {
    this.listener = new DiscoveryQueryListener(this);
    this.queryParser = new DiscoveryQueryParser(this);
    this.responder = new DiscoveryResponder(this);
    this.idProvider = new AddonIdProvider(this);
  }
  setup(properties) {
    this.properties = properties;
    this.listener.setup();
  }
  handleRegistrationQuery(message) {
    const query = this.queryParser.parse(message);
    const addonId = this.idProvider.provideId(this.properties, query);
    this.responder.respond(addonId);
  }
};

// src/router/init/KairoInitializer.ts
var KairoInitializer = class {
  constructor(kairoRouter) {
    this.discoveryManager = new AddonDiscoveryManager(this);
  }
  setupInitializationEndpoint(properties) {
    this.discoveryManager.setup(properties);
  }
};

// src/router/KairoRouter.ts
var KairoRouter = class {
  constructor() {
    this.isInitialized = false;
    this.initializer = new KairoInitializer(this);
  }
  // kjs-router-init-Fc (002): init hooks for addons to register with kairo
  init(properties) {
    if (this.isInitialized) {
      throw new KairoRouterInitError("AlreadyInitialized" /* AlreadyInitialized */);
    }
    this.initializer?.setupInitializationEndpoint(properties);
    this.isInitialized = true;
  }
};

// src/types/AddonProperties.ts
var MinecraftModule = /* @__PURE__ */ ((MinecraftModule2) => {
  MinecraftModule2["Server"] = "@minecraft/server";
  MinecraftModule2["ServerUi"] = "@minecraft/server-ui";
  MinecraftModule2["ServerGameTest"] = "@minecraft/server-gametest";
  MinecraftModule2["ServerEditor"] = "@minecraft/server-editor";
  MinecraftModule2["ServerEditorPrivateBindings"] = "@minecraft/server-editor-private-bindings";
  MinecraftModule2["ServerNet"] = "@minecraft/server-net";
  MinecraftModule2["ServerAdmin"] = "@minecraft/server-admin";
  MinecraftModule2["DebugUtilities"] = "@minecraft/debug-utilities";
  MinecraftModule2["Diagnostics"] = "@minecraft/diagnostics";
  MinecraftModule2["ServerGraphics"] = "@minecraft/server-graphics";
  return MinecraftModule2;
})(MinecraftModule || {});
var SupportedTag = /* @__PURE__ */ ((SupportedTag2) => {
  SupportedTag2["Official"] = "official";
  SupportedTag2["Approved"] = "approved";
  SupportedTag2["Stable"] = "stable";
  SupportedTag2["Experimental"] = "experimental";
  return SupportedTag2;
})(SupportedTag || {});

// src/index.ts
var router = new KairoRouter();
export {
  KairoRouter,
  MinecraftModule,
  SupportedTag,
  router
};
