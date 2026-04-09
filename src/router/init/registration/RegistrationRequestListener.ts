import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { AddonRegistrationManager } from "./AddonRegistrationManager";
import { RegistrationEventId } from "./constants/RegistrationEventId";

export class RegistrationRequestListener {
    public constructor(private readonly manager: AddonRegistrationManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationRequest);
    }

    private onRegistrationRequest = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        if (id === RegistrationEventId.Request) {
            this.manager.handleRegistrationRequest(message);
        }
    };
}
