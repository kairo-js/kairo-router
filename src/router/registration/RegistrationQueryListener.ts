import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { RegistrationManager } from "./RegistrationManager";
import { RegistrationEventId } from "../../constants/kairo";

// kjs-router-CH 004
export class RegistrationQueryListener {
    public constructor(private readonly manager: RegistrationManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
    }

    private onRegistrationQuery = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        if (id === RegistrationEventId.Query) {
            this.manager.handleRegistrationQuery(message);
        }
    };
}
