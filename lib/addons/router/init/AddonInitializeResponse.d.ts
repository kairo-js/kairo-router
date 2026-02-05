import type { AddonProperty } from "../../AddonPropertyManager";
import type { AddonInitializer } from "./AddonInitializer";
/**
 * アドオンの properties を参照して、ルーターに応答するためのクラス
 * propertiesの必要な部分を抜粋して、JSON.stringifyで送信します
 *
 * A class that responds to the router by referencing the addon's properties
 * Extracts the necessary parts of the properties and sends them using JSON.stringify
 */
export declare class AddonInitializeResponse {
    private readonly addonInitializer;
    private constructor();
    static create(addonInitializer: AddonInitializer): AddonInitializeResponse;
    /**
     * scoreboard を使って登録用の識別番号も送信しておく
     * Also send the registration ID using the scoreboard
     */
    sendResponse(addonProperty: AddonProperty): void;
    sendInitializationCompleteResponse(): void;
}
