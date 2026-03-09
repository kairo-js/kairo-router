// src/internal/addons/init/AddonInitializer.ts
var AddonInitializer = class {
  constructor(addonManager) {
  }
};

// src/internal/addons/AddonManager.ts
var AddonManager = class {
  constructor(kairoRouter) {
    this.addonInitializer = new AddonInitializer(this);
  }
  initializeAddon() {
  }
};

// src/internal/KairoRouter.ts
var KairoRouter = class {
  constructor() {
    this.addonManager = new AddonManager(this);
  }
  // kjs-router-init-Fc (0002): init hooks for addons to register with kairo
  init(properties) {
    this.addonManager.initializeAddon();
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
