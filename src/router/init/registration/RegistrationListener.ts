import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationEventId } from "./constants/RegistrationEventId";

// kjs-router-ch 0201
export class RegistrationListener {
    public constructor(private readonly manager: AddonRegistrationManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onScriptEvent);
    }

    private onScriptEvent = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        switch (id) {
            case RegistrationEventId.Request:
                this.manager.handleRegistrationRequest(message);
                break;

            case RegistrationEventId.Result:
                this.manager.handleRegistrationResult(message);
                break;
        }
    };
}
