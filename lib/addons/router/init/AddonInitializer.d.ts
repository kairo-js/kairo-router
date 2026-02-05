import type { AddonProperty } from "../../AddonPropertyManager";
import { Kairo } from "../../Kairo";
export declare class AddonInitializer {
    private readonly kairo;
    private registrationNum;
    private readonly receive;
    private readonly response;
    private constructor();
    static create(kairo: Kairo): AddonInitializer;
    subscribeClientHooks(): void;
    unsubscribeClientHooks(): void;
    getSelfAddonProperty(): AddonProperty;
    refreshSessionId(): void;
    sendResponse(): void;
    setRegistrationNum(num: number): void;
    getRegistrationNum(): number;
    subscribeReceiverHooks(): void;
    sendInitializationCompleteResponse(): void;
}
