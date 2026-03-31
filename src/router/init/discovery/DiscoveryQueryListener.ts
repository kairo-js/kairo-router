import { ScriptEventCommandMessageAfterEvent, ScriptEventSource, system } from "@minecraft/server";
import { AddonDiscoveryManager } from "./AddonDiscoveryManager";
import { DiscoveryEventId } from "./constants/DiscoveryEvent";

// kjs-router-ch 004
export class DiscoveryQueryListener {
    public constructor(private readonly manager: AddonDiscoveryManager) {}

    public setup() {
        system.afterEvents.scriptEventReceive.subscribe(this.onRegistrationQuery);
    }

    private onRegistrationQuery = (ev: ScriptEventCommandMessageAfterEvent) => {
        const { id, message, sourceType } = ev;

        if (sourceType !== ScriptEventSource.Server) return;

        if (id === DiscoveryEventId.Query) {
            this.manager.handleRegistrationQuery(message);
        }
    };
}
