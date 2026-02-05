import type { ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import type { AddonInitializer } from "./AddonInitializer";
/**
 * 各アドオンが、ルーターからのリクエストを受け取るためのクラス
 * 受け取った initializeRequest を、そのまま AddonInitializeResponseへ流します
 *
 * A class responsible for receiving requests from the router in each addon.
 * Forwards the received initializeRequest directly to AddonInitializeResponse.
 */
export declare class AddonInitializeReceive {
    private readonly addonInitializer;
    private constructor();
    static create(addonInitializer: AddonInitializer): AddonInitializeReceive;
    handleScriptEvent: (ev: ScriptEventCommandMessageAfterEvent) => void;
    private handleRegistrationRequest;
    private handleRequestReseedId;
    private subscribeReceiverHooks;
}
