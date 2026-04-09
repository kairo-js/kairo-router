import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";

// kjs-router-ch 0101
export class DiscoveryListener {
    public constructor(private readonly manager: AddonDiscoveryManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onScriptEvent);
    }

    private onScriptEvent = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        switch (id) {
            case DiscoveryEventId.Query:
                this.manager.handleRegistrationQuery(message);
                break;
        }
    };
}
