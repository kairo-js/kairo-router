import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    outDir: "lib",
    clean: true,
    external: ["@minecraft/server", "@minecraft/server-ui"],
});
