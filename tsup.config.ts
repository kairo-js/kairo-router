import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    outDir: "lib",
    clean: true,
    splitting: false,
    minify: false,
    external: ["@minecraft/server", "@minecraft/server-ui"],
    noExternal: [
        "@kairo-js/properties",
        "@sinclair/typebox",
        "ajv",
        "fast-json-stringify",
        "seedrandom",
    ],
});
