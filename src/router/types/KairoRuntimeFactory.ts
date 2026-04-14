import { KairoRuntime } from "./KairoRuntime";

export interface KairoRuntimeFactory {
    create(): KairoRuntime;
}
