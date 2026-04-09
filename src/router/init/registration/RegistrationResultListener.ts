import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationEventId } from "./constants/RegistrationEventId";

export class RegistrationResultListener {
    public constructor(private readonly manager: AddonRegistrationManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationResult);
    }

    private onRegistrationResult = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        if (id === RegistrationEventId.Result) {
            this.manager.handleRegistrationResult(message);
        }
    };
}
