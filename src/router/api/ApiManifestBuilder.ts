import type { KairoCommandRegistry } from "../command/KairoCommandRegistry";
import type { AddonEventRegistry } from "../event/AddonEventRegistry";
import type { KairoApiRegistry } from "./KairoApiRegistry";
import type { ApiManifest } from "./protocol/schema";

export class ApiManifestBuilder {
    build(
        apiRegistry: KairoApiRegistry,
        eventRegistry: AddonEventRegistry,
        commandRegistry?: KairoCommandRegistry,
    ): ApiManifest {
        const apis = apiRegistry.getApiNames().map((name) => ({ name }));

        const hooks = apiRegistry.getHookDeclarations().map((decl) => {
            const phases: ("before" | "after")[] = [];
            if (decl.before) phases.push("before");
            if (decl.after) phases.push("after");
            return {
                targetAddonId: decl.targetAddonId,
                apiName: decl.apiName,
                priority: decl.priority,
                phases,
                declarationSequence: decl.sequence,
                hasRollback: !!decl.rollback,
            };
        });

        const eventSubscriptions = eventRegistry.getSubscriptions();
        const commands = commandRegistry?.getDeclarations().map(cmd => ({
            name: cmd.name,
            mandatoryParameters: [...cmd.mandatoryParameters],
            optionalParameters: [...cmd.optionalParameters],
        }));

        return { apis, hooks, eventSubscriptions, commands };
    }
}
