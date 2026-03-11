// src/router/registration/RegistrationListener.ts
import { ScriptEventSource, system } from "@minecraft/server";
var RegistrationListener = class {
  constructor(registrationManager) {
    this.onRegistrationQuery = (ev) => {
      const { id, message, sourceType } = ev;
      if (sourceType !== ScriptEventSource.Server) return;
    };
  }
  setup() {
    system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
  }
};

// src/router/registration/RegistrationResponder.ts
var RegistrationResponder = class {
  constructor(registrationManager) {
  }
};

// src/router/registration/RegistrationManager.ts
var RegistrationManager = class {
  constructor(kairoRegister) {
    this.registrationListener = new RegistrationListener(this);
    this.registrationResponder = new RegistrationResponder(this);
  }
  setup(properties) {
    this.registrationListener.setup();
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
  MinecraftModule,
  SupportedTag,
  router
};
