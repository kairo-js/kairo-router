import fs from "node:fs";
import path from "node:path";

const file = path.resolve("lib/index.d.ts");

let text = fs.readFileSync(file, "utf8");

text = text.replace(/export declare class KairoRouter[\s\S]*?constructor\s*\([^)]*\)/, (match) =>
    match.replace(/constructor\s*\([^)]*\)/, "private constructor()"),
);

fs.writeFileSync(file, text);

console.log("patched KairoRouter constructor to private");
