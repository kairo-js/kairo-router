import { SyntaxKind } from "ts-morph";

export function pruneUnused(source, rootNames) {
    const roots = new Set(rootNames);
    const declarations = [
        ...source.getClasses(),
        ...source.getInterfaces(),
        ...source.getTypeAliases(),
    ];
    const declarationNames = new Set(
        declarations.map((declaration) => declaration.getName()).filter(Boolean),
    );
    const typeRefsMap = new Map();

    for (const declaration of declarations) {
        const name = declaration.getName();
        if (!name) continue;

        const refs = new Set();

        declaration.forEachDescendant((node) => {
            if (node.getKind() !== SyntaxKind.TypeReference) return;

            const typeNameNode = node.getFirstChildByKind(SyntaxKind.Identifier);
            const ref = typeNameNode?.getText();

            if (ref && declarationNames.has(ref) && ref !== name) {
                refs.add(ref);
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
