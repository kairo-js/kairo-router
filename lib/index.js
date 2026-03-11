// src/router/registration/RegistrationIdProvider.ts
var RegistrationIdProvider = class {
  constructor(manager) {
  }
};

// src/router/registration/RegistrationQueryListener.ts
import { ScriptEventSource, system } from "@minecraft/server";
var RegistrationQueryListener = class {
  constructor(manager) {
    this.manager = manager;
    this.onRegistrationQuery = (ev) => {
      const { id, message, sourceType } = ev;
      if (sourceType !== ScriptEventSource.Server) return;
      if (id === "kairo:registration_query" /* Query */) {
        this.manager.handleRegistrationQuery(message);
      }
    };
  }
  setup() {
    system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
  }
};

// src/router/registration/RegistrationQueryParser.ts
var RegistrationQueryParser = class {
  constructor(manager) {
  }
  parse(message) {
  }
};

// src/router/registration/RegistrationResponder.ts
var RegistrationResponder = class {
  constructor(manager) {
  }
  respond(query) {
  }
};

// src/router/registration/RegistrationManager.ts
var RegistrationManager = class {
  constructor(kairoRegister) {
    this.listener = new RegistrationQueryListener(this);
    this.queryParser = new RegistrationQueryParser(this);
    this.responder = new RegistrationResponder(this);
    this.idProvider = new RegistrationIdProvider(this);
  }
  setup(properties) {
    this.listener.setup();
  }
  handleRegistrationQuery(message) {
    const query = this.queryParser.parse(message);
    this.responder.respond(query);
  }
};

// src/router/registration/KairoRegister.ts
var KairoRegister = class {
  constructor(kairoRouter) {
    this.registrationManager = new RegistrationManager(this);
  }
  setupRegistrationEndpoint(properties) {
    this.registrationManager.setup(properties);
  }
};

// src/router/KairoRouter.ts
var KairoRouter = class {
  constructor() {
    this.register = new KairoRegister(this);
  }
  // kjs-router-init-Fc (002): init hooks for addons to register with kairo
  init(properties) {
    this.register.setupRegistrationEndpoint(properties);
  }
};

// src/types/properties.ts
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
