import { MinecraftRuntime } from "./MinecraftRuntime";

export class MinecraftRuntimeFactory {
    create(): MinecraftRuntime {
        return new MinecraftRuntime();
    }
}
