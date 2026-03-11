import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["scripts/index.ts"],
    format: ["esm"],
    dts: true,
    outDir: "lib",
    clean: true,
    external: ["@minecraft/server", "@minecraft/server-ui"],
});
