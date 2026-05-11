// src/properties/AddonProperties.ts
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
export {
  MinecraftModule,
  SupportedTag
};
