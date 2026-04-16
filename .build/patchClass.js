import { SyntaxKind } from "ts-morph";

export function patchClasses(source, targets) {
    const targetSet = new Set(targets);

    for (const cls of source.getClasses()) {
        const name = cls.getName();
        if (!name || !targetSet.has(name)) continue;

        for (const ctor of cls.getConstructors()) {
            ctor.getParameters().forEach((p) => p.remove());

            if (!ctor.hasModifier(SyntaxKind.PrivateKeyword)) {
                ctor.toggleModifier("private", true);
            }
        }

        if (cls.getConstructors().length === 0) {
            cls.addConstructor({
                scope: "private",
                parameters: [],
            });
        }

        for (const prop of cls.getProperties()) {
            if (prop.hasModifier(SyntaxKind.PrivateKeyword)) {
                prop.remove();
            }
        }
    }
}
