import { Node } from "ts-morph";

export function pruneUnused(source, rootNames) {
    const declarations = [
        ...source.getClasses(),
        ...source.getInterfaces(),
        ...source.getTypeAliases(),
    ];

    const declarationMap = new Map();

    for (const declaration of declarations) {
        const name = declaration.getName();

        if (name) {
            declarationMap.set(name, declaration);
        }
    }

    const declarationNames = new Set(declarationMap.keys());

    const typeRefsMap = new Map();

    for (const declaration of declarations) {
        const name = declaration.getName();
        if (!name) continue;

        const refs = new Set();

        declaration.forEachDescendant((node) => {
            if (!Node.isTypeReference(node)) return;

            const ref = node.getTypeName().getText();

            if (declarationNames.has(ref) && ref !== name) {
                refs.add(ref);
            }
        });

        typeRefsMap.set(name, refs);
    }

    const reachable = new Set(rootNames);

    for (const declaration of declarations) {
        if (declaration.isExported()) {
            const name = declaration.getName();

            if (name) {
                reachable.add(name);
            }
        }
    }

    let changed = true;

    while (changed) {
        changed = false;

        for (const [name, refs] of typeRefsMap.entries()) {
            if (!reachable.has(name)) continue;

            for (const ref of refs) {
                if (!reachable.has(ref)) {
                    reachable.add(ref);
                    changed = true;
                }
            }
        }
    }

    for (const declaration of declarations) {
        const name = declaration.getName();

        if (!name) continue;

        if (!reachable.has(name)) {
            declaration.remove();
        }
    }
}
