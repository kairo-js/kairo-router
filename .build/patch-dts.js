import fs from "node:fs";
import path from "node:path";

const file = path.resolve("lib/index.d.ts");

let text = fs.readFileSync(file, "utf8");

text = text.replace(/constructor\s*\(/g, "private constructor(");

fs.writeFileSync(file, text);

console.log("patched constructors to private");
