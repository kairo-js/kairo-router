import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { RegistrationManager } from "./RegistrationManager";

// kjs-router-CH 004
export class RegistrationListener {
    public constructor(registrationManager: RegistrationManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
    }

    private onRegistrationQuery = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;
    };
}
