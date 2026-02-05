import type { Player } from "@minecraft/server";
export declare class ErrorManager {
    static showErrorDetails(player: Player, errorId: string): Promise<void>;
}
