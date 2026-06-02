import type { KairoApiRegistry } from "./KairoApiRegistry";
import type { ApiManifest } from "./protocol/schema";

export class ApiManifestBuilder {
    build(registry: KairoApiRegistry): ApiManifest {
        const apis = registry.getApiNames().map((name) => ({ name }));

        const hooks = registry.getHookDeclarations().map((decl) => {
            const phases: ("before" | "after")[] = [];
            if (decl.before) phases.push("before");
            if (decl.after) phases.push("after");
            return {
                targetAddonId: decl.targetAddonId,
                apiName: decl.apiName,
                priority: decl.priority,
                phases,
            };
        });

        return { apis, hooks };
    }
}
