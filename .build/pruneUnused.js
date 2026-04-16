import { SyntaxKind } from "ts-morph";

export function pruneUnused(source, rootNames) {
    const roots = new Set(rootNames);

    const typeRefsMap = new Map();

    for (const cls of source.getClasses()) {
        const name = cls.getName();
        if (!name) continue;

        const refs = new Set();

        cls.forEachDescendant((node) => {
            if (node.getKind() === SyntaxKind.TypeReference) {
                refs.add(node.getText());
            }
        });

        typeRefsMap.set(name, refs);
    }

    const reachable = new Set([...roots]);
    let changed = true;

    while (changed) {
        changed = false;

        for (const [cls, refs] of typeRefsMap.entries()) {
            if (!reachable.has(cls)) continue;

            for (const ref of refs) {
                if (!reachable.has(ref)) {
                    reachable.add(ref);
                    changed = true;
                }
            }
        }
    }

    for (const cls of source.getClasses()) {
        const name = cls.getName();
        if (!name) continue;

        if (!reachable.has(name)) {
            cls.remove();
        }
    }

    for (const iface of source.getInterfaces()) {
        const name = iface.getName();
        if (!reachable.has(name)) {
            iface.remove();
        }
    }

    for (const typeAlias of source.getTypeAliases()) {
        const name = typeAlias.getName();
        if (!reachable.has(name)) {
            typeAlias.remove();
        }
    }
}
