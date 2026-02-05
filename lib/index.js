// src/addons/Kairo.ts
import { system as system6 } from "@minecraft/server";

// src/constants/scriptevent.ts
var SCRIPT_EVENT_ID_PREFIX = {
  KAIRO: "kairo"
};
var SCRIPT_EVENT_IDS = {
  BEHAVIOR_REGISTRATION_REQUEST: "kairo:registrationRequest",
  BEHAVIOR_REGISTRATION_RESPONSE: "kairo:registrationResponse",
  BEHAVIOR_INITIALIZE_REQUEST: "kairo:initializeRequest",
  BEHAVIOR_INITIALIZATION_COMPLETE_RESPONSE: "kairo:initializationCompleteResponse",
  UNSUBSCRIBE_INITIALIZE: "kairo:unsubscribeInitialize",
  REQUEST_RESEED_SESSION_ID: "kairo:reseedSessionId",
  SHOW_ADDON_LIST: "kairo:showAddonList"
};
var SCRIPT_EVENT_MESSAGES = {
  NONE: "",
  ACTIVATE_REQUEST: "activate request",
  DEACTIVATE_REQUEST: "deactivate request"
};
var SCRIPT_EVENT_COMMAND_TYPES = {
  KAIRO_ACK: "kairo_ack",
  KAIRO_RESPONSE: "kairo_response",
  SAVE_DATA: "save_data",
  LOAD_DATA: "load_data",
  DATA_LOADED: "data_loaded",
  GET_PLAYER_KAIRO_DATA: "getPlayerKairoData",
  GET_PLAYERS_KAIRO_DATA: "getPlayersKairoData"
};

// src/constants/system.ts
var KAIRO_COMMAND_TARGET_ADDON_IDS = {
  BROADCAST: "_kBroadcast",
  KAIRO: "kairo",
  KAIRO_DATAVAULT: "kairo-datavault"
};

// src/utils/KairoUtils.ts
import { system } from "@minecraft/server";
var KairoUtils = class _KairoUtils {
  static {
    this.properties = null;
  }
  static {
    this.pendingRequests = /* @__PURE__ */ new Map();
  }
  static init(properties) {
    if (this.properties) {
      throw new Error("[KairoUtils] Already initialized.");
    }
    console.log("KairoUtils init:" + properties.id);
    this.properties = properties;
  }
  static requireInitialized() {
    if (!this.properties) {
      throw new Error(
        "[KairoUtils] KairoUtils is not initialized. Call KairoUtils.init({ addonId }) first."
      );
    }
    return this.properties;
  }
  static async sendKairoCommand(targetAddonId, commandType, data = {}, timeoutTicks = 20) {
    return this.sendInternal(
      targetAddonId,
      commandType,
      data,
      timeoutTicks,
      false
    );
  }
  static async sendKairoCommandAndWaitResponse(targetAddonId, commandType, data = {}, timeoutTicks = 20) {
    return this.sendInternal(
      targetAddonId,
      commandType,
      data,
      timeoutTicks,
      true
    );
  }
  static buildKairoResponse(data = {}, success = true, errorMessage) {
    return {
      sourceAddonId: this.requireInitialized().id,
      commandId: this.generateRandomId(16),
      commandType: SCRIPT_EVENT_COMMAND_TYPES.KAIRO_RESPONSE,
      data,
      success,
      ...errorMessage !== void 0 ? { errorMessage } : {}
    };
  }
  static {
    this.charset = [
      ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ];
  }
  static generateRandomId(length = 8) {
    return Array.from(
      { length },
      () => this.charset[Math.floor(Math.random() * this.charset.length)]
    ).join("");
  }
  static async getPlayerKairoData(playerId) {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO,
      SCRIPT_EVENT_COMMAND_TYPES.GET_PLAYER_KAIRO_DATA,
      {
        playerId
      }
    );
    return kairoResponse.data.playerKairoData;
  }
  static async getPlayersKairoData() {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO,
      SCRIPT_EVENT_COMMAND_TYPES.GET_PLAYERS_KAIRO_DATA
    );
    return kairoResponse.data.playersKairoData;
  }
  static async saveToDataVault(key, value) {
    const type = value === null ? "null" : typeof value;
    if (type === "object" && !this.isVector3(value)) {
      throw new Error(
        `Invalid value type for saveToDataVault: expected Vector3 for object, got ${JSON.stringify(value)}`
      );
    }
    return _KairoUtils.sendKairoCommand(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO_DATAVAULT,
      SCRIPT_EVENT_COMMAND_TYPES.SAVE_DATA,
      {
        type,
        key,
        value: JSON.stringify(value)
      }
    );
  }
  static async loadFromDataVault(key) {
    const kairoResponse = await _KairoUtils.sendKairoCommandAndWaitResponse(
      KAIRO_COMMAND_TARGET_ADDON_IDS.KAIRO_DATAVAULT,
      SCRIPT_EVENT_COMMAND_TYPES.LOAD_DATA,
      {
        key
      }
    );
    const { type, value } = kairoResponse.data.dataLoaded;
    if (value === null)
      return null;
    switch (type) {
      case "string":
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      case "number":
      case "boolean":
        return JSON.parse(value);
      case "object":
        return JSON.parse(value);
      case "null":
        return null;
      default:
        throw new Error(`Unsupported DataVault value type: ${type}`);
    }
  }
  static resolvePendingRequest(commandId, response) {
    const pending = this.pendingRequests.get(commandId);
    if (!pending)
      return;
    this.pendingRequests.delete(commandId);
    if (pending.expectResponse && response === void 0) {
      pending.reject(
        new Error(
          `Kairo response expected but none received (commandId=${commandId})`
        )
      );
      return;
    }
    pending.resolve(response);
  }
  static rejectPendingRequest(commandId, error) {
    const pending = this.pendingRequests.get(commandId);
    if (!pending)
      return;
    this.pendingRequests.delete(commandId);
    pending.reject(error ?? new Error("Kairo request rejected"));
  }
  static async sendInternal(targetAddonId, commandType, data, timeoutTicks, expectResponse) {
    const kairoCommand = {
      sourceAddonId: this.requireInitialized().id,
      commandId: this.generateRandomId(16),
      commandType,
      data
    };
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(kairoCommand.commandId, {
        expectResponse,
        resolve,
        reject,
        timeoutTick: system.currentTick + timeoutTicks
      });
      system.sendScriptEvent(
        `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${targetAddonId}`,
        JSON.stringify(kairoCommand)
      );
    });
  }
  static onTick() {
    this.requireInitialized();
    if (this.lastTick === system.currentTick)
      return;
    this.lastTick = system.currentTick;
    for (const [requestId, pending] of this.pendingRequests) {
      if (system.currentTick >= pending.timeoutTick) {
        this.pendingRequests.delete(requestId);
        pending.reject(new Error("Kairo command timeout"));
      }
    }
  }
  static isRawMessage(value) {
    if (value === null || typeof value !== "object")
      return false;
    const v = value;
    if (v.rawtext !== void 0) {
      if (!Array.isArray(v.rawtext))
        return false;
      for (const item of v.rawtext) {
        if (!this.isRawMessage(item))
          return false;
      }
    }
    if (v.score !== void 0) {
      const s = v.score;
      if (s === null || typeof s !== "object")
        return false;
      if (s.name !== void 0 && typeof s.name !== "string")
        return false;
      if (s.objective !== void 0 && typeof s.objective !== "string")
        return false;
    }
    if (v.text !== void 0 && typeof v.text !== "string") {
      return false;
    }
    if (v.translate !== void 0 && typeof v.translate !== "string") {
      return false;
    }
    if (v.with !== void 0) {
      const w = v.with;
      if (Array.isArray(w)) {
        if (!w.every((item) => typeof item === "string"))
          return false;
      } else if (!this.isRawMessage(w)) {
        return false;
      }
    }
    return true;
  }
  static isVector3(value) {
    return typeof value === "object" && value !== null && typeof value.x === "number" && typeof value.y === "number" && typeof value.z === "number" && Object.keys(value).length === 3;
  }
};

// src/addons/AddonPropertyManager.ts
var AddonPropertyManager = class _AddonPropertyManager {
  constructor(kairo, properties) {
    this.kairo = kairo;
    this.charset = [
      ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ];
    this.self = {
      id: properties.id,
      name: properties.header.name,
      description: properties.header.description,
      sessionId: KairoUtils.generateRandomId(8),
      version: properties.header.version,
      dependencies: properties.dependencies,
      requiredAddons: properties.requiredAddons,
      tags: properties.tags
    };
  }
  static create(kairo, properties) {
    return new _AddonPropertyManager(kairo, properties);
  }
  getSelfAddonProperty() {
    return this.self;
  }
  refreshSessionId() {
    this.self.sessionId = KairoUtils.generateRandomId(8);
  }
};

// src/addons/router/init/AddonInitializer.ts
import { system as system3 } from "@minecraft/server";

// src/utils/ScoreboardManager.ts
import { world } from "@minecraft/server";
var ScoreboardManager = class {
  static ensureObjective(objectiveId) {
    return world.scoreboard.getObjective(objectiveId) ?? world.scoreboard.addObjective(objectiveId);
  }
};

// src/constants/scoreboard.ts
var SCOREBOARD_NAMES = {
  ADDON_COUNTER: "AddonCounter"
};

// src/addons/router/init/AddonInitializeReceive.ts
var AddonInitializeReceive = class _AddonInitializeReceive {
  constructor(addonInitializer) {
    this.addonInitializer = addonInitializer;
    this.handleScriptEvent = (ev) => {
      const { id, message } = ev;
      const registrationNum = this.addonInitializer.getRegistrationNum();
      const isOwnMessage = message === registrationNum.toString();
      switch (id) {
        case SCRIPT_EVENT_IDS.BEHAVIOR_REGISTRATION_REQUEST:
          this.handleRegistrationRequest();
          break;
        case SCRIPT_EVENT_IDS.REQUEST_RESEED_SESSION_ID:
          if (isOwnMessage) {
            this.handleRequestReseedId();
          }
          break;
        case SCRIPT_EVENT_IDS.BEHAVIOR_INITIALIZE_REQUEST:
          if (isOwnMessage) {
            this.subscribeReceiverHooks();
            this.addonInitializer.sendInitializationCompleteResponse();
          }
          break;
        case SCRIPT_EVENT_IDS.UNSUBSCRIBE_INITIALIZE:
          this.addonInitializer.unsubscribeClientHooks();
          break;
      }
    };
  }
  static create(addonInitializer) {
    return new _AddonInitializeReceive(addonInitializer);
  }
  handleRegistrationRequest() {
    const addonCounter = ScoreboardManager.ensureObjective(SCOREBOARD_NAMES.ADDON_COUNTER);
    addonCounter.addScore(SCOREBOARD_NAMES.ADDON_COUNTER, 1);
    this.addonInitializer.setRegistrationNum(
      addonCounter.getScore(SCOREBOARD_NAMES.ADDON_COUNTER) ?? 0
    );
    this.addonInitializer.sendResponse();
  }
  handleRequestReseedId() {
    this.addonInitializer.refreshSessionId();
    this.addonInitializer.sendResponse();
  }
  subscribeReceiverHooks() {
    this.addonInitializer.subscribeReceiverHooks();
  }
};

// src/addons/router/init/AddonInitializeResponse.ts
import { system as system2, world as world2 } from "@minecraft/server";
var AddonInitializeResponse = class _AddonInitializeResponse {
  constructor(addonInitializer) {
    this.addonInitializer = addonInitializer;
  }
  static create(addonInitializer) {
    return new _AddonInitializeResponse(addonInitializer);
  }
  /**
   * scoreboard を使って登録用の識別番号も送信しておく
   * Also send the registration ID using the scoreboard
   */
  sendResponse(addonProperty) {
    system2.sendScriptEvent(
      SCRIPT_EVENT_IDS.BEHAVIOR_REGISTRATION_RESPONSE,
      JSON.stringify([
        addonProperty,
        world2.scoreboard.getObjective(SCOREBOARD_NAMES.ADDON_COUNTER)?.getScore(SCOREBOARD_NAMES.ADDON_COUNTER) ?? 0
      ])
    );
  }
  sendInitializationCompleteResponse() {
    system2.sendScriptEvent(
      SCRIPT_EVENT_IDS.BEHAVIOR_INITIALIZATION_COMPLETE_RESPONSE,
      SCRIPT_EVENT_MESSAGES.NONE
    );
  }
};

// src/addons/router/init/AddonInitializer.ts
var AddonInitializer = class _AddonInitializer {
  constructor(kairo) {
    this.kairo = kairo;
    this.registrationNum = 0;
    this.receive = AddonInitializeReceive.create(this);
    this.response = AddonInitializeResponse.create(this);
  }
  static create(kairo) {
    return new _AddonInitializer(kairo);
  }
  subscribeClientHooks() {
    system3.afterEvents.scriptEventReceive.subscribe(
      this.receive.handleScriptEvent
    );
  }
  unsubscribeClientHooks() {
    system3.afterEvents.scriptEventReceive.unsubscribe(
      this.receive.handleScriptEvent
    );
  }
  getSelfAddonProperty() {
    return this.kairo.getSelfAddonProperty();
  }
  refreshSessionId() {
    return this.kairo.refreshSessionId();
  }
  sendResponse() {
    const selfAddonProperty = this.getSelfAddonProperty();
    this.response.sendResponse(selfAddonProperty);
  }
  setRegistrationNum(num) {
    this.registrationNum = num;
  }
  getRegistrationNum() {
    return this.registrationNum;
  }
  subscribeReceiverHooks() {
    this.kairo.subscribeReceiverHooks();
  }
  sendInitializationCompleteResponse() {
    this.response.sendInitializationCompleteResponse();
  }
};

// src/addons/AddonManager.ts
import { system as system5 } from "@minecraft/server";

// src/addons/router/AddonReceiver.ts
import {
  system as system4
} from "@minecraft/server";

// src/utils/ConsoleManager.ts
var ConsoleManager = class {
  static {
    this.JST_OFFSET_MS = 9 * 60 * 60 * 1e3;
  }
  static {
    this.properties = null;
  }
  static init(properties) {
    if (this.properties) {
      throw new Error(
        "[ConsoleManager] ConsoleManager is already initialized."
      );
    }
    console.log("ConsoleManager init:" + properties.id);
    this.properties = properties;
  }
  static requireInitialized() {
    if (!this.properties) {
      throw new Error(
        "[ConsoleManager] ConsoleManager is not initialized. Call ConsoleManager.init(properties) first."
      );
    }
    return this.properties;
  }
  static getJstDate() {
    return new Date(Date.now() + this.JST_OFFSET_MS);
  }
  static pad(value, length = 2) {
    return value.toString().padStart(length, "0");
  }
  static formatTime(format) {
    if (format === "none" /* None */)
      return "";
    const d = this.getJstDate();
    const date = `${d.getUTCFullYear()}/${this.pad(d.getUTCMonth() + 1)}/${this.pad(d.getUTCDate())}`;
    const time = `${this.pad(d.getUTCHours())}:${this.pad(d.getUTCMinutes())}:${this.pad(d.getUTCSeconds())}.${this.pad(d.getUTCMilliseconds(), 3)}`;
    switch (format) {
      case "datetime" /* DateTime */:
        return `${date} ${time}`;
      case "time" /* TimeOnly */:
      default:
        return time;
    }
  }
  static buildPrefix(level, timeFormat) {
    const properties = this.requireInitialized();
    const time = this.formatTime(timeFormat);
    return time ? `[${properties.header.name}][${time}][${level}]` : `[${properties.header.name}][${level}]`;
  }
  static log(message, timeFormat = "time" /* TimeOnly */) {
    console.log(`${this.buildPrefix("Log", timeFormat)} ${message}`);
  }
  static warn(message, timeFormat = "time" /* TimeOnly */) {
    console.warn(`${this.buildPrefix("Warning", timeFormat)} ${message}`);
  }
  static error(message, timeFormat = "time" /* TimeOnly */) {
    console.error(`${this.buildPrefix("Error", timeFormat)} ${message}`);
  }
};

// src/addons/router/AddonReceiver.ts
var AddonReceiver = class _AddonReceiver {
  constructor(addonManager) {
    this.addonManager = addonManager;
    this.handleScriptEvent = async (ev) => {
      const { id, message } = ev;
      const addonProperty = this.addonManager.getSelfAddonProperty();
      if (id !== `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${addonProperty.sessionId}`)
        return;
      if (this.addonManager.isActive === false) {
        if (message !== SCRIPT_EVENT_MESSAGES.ACTIVATE_REQUEST)
          return;
      }
      switch (message) {
        case SCRIPT_EVENT_MESSAGES.ACTIVATE_REQUEST:
          await this.addonManager._activateAddon();
          break;
        case SCRIPT_EVENT_MESSAGES.DEACTIVATE_REQUEST:
          await this.addonManager._deactivateAddon();
          break;
        default:
          let data;
          try {
            data = JSON.parse(message);
          } catch (e) {
            ConsoleManager.warn(`[ScriptEventReceiver] Invalid JSON: ${message}`);
            return;
          }
          if (typeof data.sourceAddonId !== "string")
            return;
          if (typeof data.commandType !== "string")
            return;
          if (data.ackFor && typeof data.ackFor === "string") {
            KairoUtils.resolvePendingRequest(data.ackFor, data.response);
            return;
          }
          if (typeof data.commandId !== "string")
            return;
          if (!data || typeof data !== "object")
            return;
          const command = data;
          const response = await this.addonManager._scriptEvent(command);
          system4.sendScriptEvent(
            `${SCRIPT_EVENT_ID_PREFIX.KAIRO}:${command.sourceAddonId}`,
            JSON.stringify({
              sourceAddonId: this.addonManager.getProperties().id,
              commandType: SCRIPT_EVENT_COMMAND_TYPES.KAIRO_ACK,
              ackFor: command.commandId,
              response
            })
          );
          break;
      }
    };
  }
  static create(addonManager) {
    return new _AddonReceiver(addonManager);
  }
};

// src/addons/AddonManager.ts
var AddonManager = class _AddonManager {
  constructor(kairo) {
    this.kairo = kairo;
    this._isActive = false;
    this.receiver = AddonReceiver.create(this);
  }
  static create(kairo) {
    return new _AddonManager(kairo);
  }
  getSelfAddonProperty() {
    return this.kairo.getSelfAddonProperty();
  }
  subscribeReceiverHooks() {
    system5.afterEvents.scriptEventReceive.subscribe(
      this.receiver.handleScriptEvent
    );
  }
  async _activateAddon() {
    await this.kairo._activateAddon();
  }
  async _deactivateAddon() {
    await this.kairo._deactivateAddon();
  }
  async _scriptEvent(data) {
    return this.kairo._scriptEvent(data);
  }
  get isActive() {
    return this._isActive;
  }
  setActiveState(state) {
    this._isActive = state;
  }
  getProperties() {
    return this.kairo.getProperties();
  }
};

// src/addons/Kairo.ts
var Kairo = class _Kairo {
  constructor(properties) {
    this.properties = properties;
    this.initialized = false;
    this.addonManager = AddonManager.create(this);
    this.addonPropertyManager = AddonPropertyManager.create(this, properties);
    this.addonInitializer = AddonInitializer.create(this);
  }
  static {
    this._initHooks = [];
  }
  static {
    this._deinitHooks = [];
  }
  static {
    this._seHooks = [];
  }
  static {
    this._tickHooks = [];
  }
  static {
    this._tickEnabled = false;
  }
  static getInstance(properties) {
    if (!this.instance && properties !== void 0) {
      this.instance = new _Kairo(properties);
    }
    return this.instance;
  }
  static init(properties) {
    const inst = this.getInstance(properties);
    if (inst.initialized)
      return;
    console.log("Kairo init:" + properties.id);
    KairoUtils.init(properties);
    ConsoleManager.init(properties);
    inst.initialized = true;
    inst.addonInitializer.subscribeClientHooks();
  }
  getProperties() {
    return this.properties;
  }
  getSelfAddonProperty() {
    return this.addonPropertyManager.getSelfAddonProperty();
  }
  refreshSessionId() {
    this.addonPropertyManager.refreshSessionId();
  }
  subscribeReceiverHooks() {
    this.addonManager.subscribeReceiverHooks();
  }
  static unsubscribeInitializeHooks() {
    this.getInstance().addonInitializer.unsubscribeClientHooks();
    system6.sendScriptEvent(SCRIPT_EVENT_IDS.UNSUBSCRIBE_INITIALIZE, "");
  }
  static set onActivate(val) {
    if (typeof val === "function")
      this._pushSorted(this._initHooks, val);
    else
      this._pushSorted(this._initHooks, val.run, val.options);
  }
  static set onDeactivate(val) {
    if (typeof val === "function")
      this._pushSorted(this._deinitHooks, val);
    else
      this._pushSorted(this._deinitHooks, val.run, val.options);
  }
  static set onScriptEvent(val) {
    if (this._commandHandler) {
      throw new Error("CommandHandler already registered");
    }
    this._commandHandler = val;
  }
  static set onTick(fn) {
    this.addTick(fn);
  }
  static addActivate(fn, opt) {
    this._pushSorted(this._initHooks, fn, opt);
  }
  static addDeactivate(fn, opt) {
    this._pushSorted(this._deinitHooks, fn, opt);
  }
  static addScriptEvent(fn, opt) {
    this._pushSorted(this._seHooks, fn, opt);
  }
  static addTick(fn, opt) {
    this._pushSorted(this._tickHooks, fn, opt);
  }
  async _scriptEvent(data) {
    return _Kairo._runScriptEvent(data);
  }
  async _activateAddon() {
    await _Kairo._runActivateHooks();
  }
  async _deactivateAddon() {
    await _Kairo._runDeactivateHooks();
  }
  static _pushSorted(arr, fn, opt) {
    arr.push({ fn, priority: opt?.priority ?? 0 });
    arr.sort((a, b) => b.priority - a.priority);
  }
  static async _runActivateHooks() {
    for (const { fn } of this._initHooks) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onActivate] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    this._enableTick();
    this.getInstance().addonManager.setActiveState(true);
  }
  static async _runDeactivateHooks() {
    for (const { fn } of [...this._deinitHooks].reverse()) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onDeactivate] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    this._disableTick();
    this.getInstance().addonManager.setActiveState(false);
  }
  static async _runScriptEvent(data) {
    let response = void 0;
    if (this._commandHandler) {
      try {
        response = await this._commandHandler(data);
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.CommandHandler] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    for (const { fn } of this._seHooks) {
      try {
        await fn(data);
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onScriptEvent] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
    return response;
  }
  static async _runTick() {
    if (!this._tickEnabled)
      return;
    for (const { fn } of this._tickHooks) {
      try {
        await fn();
      } catch (e) {
        system6.run(
          () => console.warn(
            `[Kairo.onTick] ${e instanceof Error ? e.stack ?? e.message : String(e)}`
          )
        );
      }
    }
  }
  static _enableTick() {
    if (this._tickIntervalId !== void 0)
      return;
    this._tickEnabled = true;
    this.addTick(
      () => {
        KairoUtils.onTick();
      },
      { priority: Number.MAX_SAFE_INTEGER }
    );
    this._tickIntervalId = system6.runInterval(() => {
      void this._runTick();
    }, 1);
  }
  static _disableTick() {
    if (this._tickIntervalId === void 0)
      return;
    system6.clearRun(this._tickIntervalId);
    this._tickIntervalId = void 0;
    this._tickEnabled = false;
  }
};

// src/constants/error.ts
var ErrorDetails = {
  kairo_error_not_found: {
    errorMessageId: "kairo.error.not.found.message",
    errorHintId: "kairo.error.not.found.hint",
    errorCode: "E000001"
  },
  kairo_resolve_for_activation_error: {
    errorMessageId: "kairo.error.resolve.for.activation.message",
    errorHintId: "kairo.error.resolve.for.activation.hint",
    errorCode: "E100001"
  },
  kairo_resolve_for_deactivation_error: {
    errorMessageId: "kairo.error.resolve.for.deactivation.message",
    errorHintId: "kairo.error.resolve.for.deactivation.hint",
    errorCode: "E100002"
  }
};

// src/constants/translate.ts
var KAIRO_TRANSLATE_IDS = {
  ADDON_ACTIVE: "kairo.addon.active",
  ADDON_DEACTIVE: "kairo.addon.deactive",
  ADDON_CHANGE_VERSION: "kairo.addon.changeVersion",
  ADDON_LIST_TITLE: "kairo.addonList.title",
  ADDON_LIST_ACTIVE: "kairo.addonList.active",
  ADDON_LIST_INACTIVE: "kairo.addonList.inactive",
  ADDON_SETTING_LATEST_VERSION: "kairo.addonSetting.latestVersion",
  ADDON_SETTING_REQUIRED: "kairo.addonSetting.required",
  ADDON_SETTING_NONE_REQUIRED: "kairo.addonSetting.noneRequired",
  ADDON_SETTING_ACTIVE: "kairo.addonSetting.active",
  ADDON_SETTING_SELECTED: "kairo.addonSetting.selected",
  ADDON_SETTING_UNINSTALLED: "kairo.addonSetting.uninstalled",
  ADDON_SETTING_MISSING_REQUIRED: "kairo.addonSetting.missing.required",
  ADDON_SETTING_REGISTERED_ADDON_LIST: "kairo.addonSetting.registeredAddonList",
  ADDON_SETTING_SELECT_VERSION: "kairo.addonSetting.selectVersion",
  ADDON_SETTING_ACTIVATE: "kairo.addonSetting.activate",
  ADDON_SETTING_SUBMIT: "kairo.addonSetting.submit",
  ADDON_SETTING_REQUIRED_TITLE: "kairo.addonSetting.required.title",
  ADDON_SETTING_REQUIRED_ACTIVATION_BODY: "kairo.addonSetting.required.activation.body",
  ADDON_SETTING_REQUIRED_DEACTIVATION_BODY: "kairo.addonSetting.required.deactivation.body",
  ADDON_SETTING_REQUIRED_ACTIVE_CONFIRM: "kairo.addonSetting.required.active.confirm",
  ADDON_SETTING_REQUIRED_DEACTIVE_CONFIRM: "kairo.addonSetting.required.deactive.confirm",
  ADDON_SETTING_REQUIRED_CANCEL: "kairo.addonSetting.required.cancel",
  ERROR_FORM_TITLE: "kairo.errorForm.title",
  ERROR_FORM_HEADER: "kairo.errorForm.header",
  ERROR_FORM_FOOTER: "kairo.errorForm.footer"
};

// src/utils/ErrorManager.ts
import { ActionFormData } from "@minecraft/server-ui";
var ErrorManager = class {
  static async showErrorDetails(player, errorId) {
    const errorDetail = ErrorDetails[errorId];
    if (!errorDetail) {
      return this.showErrorDetails(player, "kairo_error_not_found");
    }
    const errorForm = new ActionFormData().title({ translate: KAIRO_TRANSLATE_IDS.ERROR_FORM_TITLE }).header({ translate: KAIRO_TRANSLATE_IDS.ERROR_FORM_HEADER }).label({ text: `[ ${errorDetail.errorCode} ]` }).divider().label({
      rawtext: [
        { translate: errorDetail.errorMessageId },
        { text: "\n\n" },
        { translate: errorDetail.errorHintId }
      ]
    }).divider().label({
      translate: KAIRO_TRANSLATE_IDS.ERROR_FORM_FOOTER,
      with: [errorDetail.errorCode]
    });
    const { selection, canceled } = await errorForm.show(player);
    if (canceled)
      return;
  }
};
export {
  ConsoleManager,
  ErrorManager,
  Kairo,
  KairoUtils,
  ScoreboardManager
};
