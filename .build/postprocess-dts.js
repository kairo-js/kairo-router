import path from "node:path";
import { Project } from "ts-morph";

import { patchClasses } from "./patchClass.js";
import { pruneUnused } from "./pruneUnused.js";

const filePath = path.resolve("lib/index.d.ts");

const project = new Project({
    skipAddingFilesFromTsConfig: true,
});

const source = project.addSourceFileAtPath(filePath);

const ROOT_CLASSES = ["KairoContext", "KairoRouter"];
patchClasses(source, ROOT_CLASSES);
pruneUnused(source, ROOT_CLASSES);

source.saveSync();

console.log("postprocess-dts: done");
