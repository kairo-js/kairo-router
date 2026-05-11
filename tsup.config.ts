import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/properties/index.ts"],
    format: ["esm"],
    dts: true,
    outDir: "lib",
    clean: true,
    splitting: false,
    external: ["@minecraft/server", "@minecraft/server-ui"],
    noExternal: ["@sinclair/typebox", "ajv", "fast-json-stringify", "seedrandom"],
});
