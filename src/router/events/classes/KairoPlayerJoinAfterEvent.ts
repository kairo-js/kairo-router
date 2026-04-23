/**
 * Minecraft PlayerJoinAfterEvent
 * https://learn.microsoft.com/ja-jp/minecraft/creator/scriptapi/minecraft/server/playerjoinafterevent?view=minecraft-bedrock-stable
 */
export interface KairoPlayerJoinAfterEvent {
    readonly playerId: string;
    readonly playerName: string;
}
