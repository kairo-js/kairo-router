import { type ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import type { AddonManager } from "../AddonManager";
export declare class AddonReceiver {
    private readonly addonManager;
    private constructor();
    static create(addonManager: AddonManager): AddonReceiver;
    handleScriptEvent: (ev: ScriptEventCommandMessageAfterEvent) => Promise<void>;
}
