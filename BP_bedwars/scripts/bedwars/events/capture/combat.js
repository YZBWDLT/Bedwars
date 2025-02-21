/**
 * ===== 游戏事件（夺点模式） =====
 * 该文件是基于gaming/combat.js而编写的。在实际使用中，应视情况禁用其中的某些函数，然后启用这里的替代函数。
 */

import { EntityDieAfterEvent, Player } from "@minecraft/server";
import { eachValidPlayer, getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { settings } from "../../methods/bedwarsSettings";

/** 夺点模式战斗相关（Event）
 * @description 玩家死亡判定：（基于原版模式的补充）若玩家被淘汰，提示玩家重新获得一张床即可复活。
 * @param {EntityDieAfterEvent} event
 */
export function playerDiedCapture( event ) {
    /** 死亡玩家 @type {Player} */ let player = event.deadEntity;
    if ( event.deadEntity.typeId === "minecraft:player" && playerIsValid( player ) && !getPlayerBedwarsInfo( player ).getBedState() ) {
        player.sendMessage( { translate: "message.respawnTipWhenHaveBed" } )
    }
}

/** 复活已被淘汰的队员
 * @description 如果该队队员在被淘汰后，该队获得一张新床，则该队的被淘汰队员将全体复活
 */
export function respawnEliminatedPlayers() {
    eachValidPlayer( ( player, playerInfo ) => {
        if ( playerInfo.isEliminated && !playerInfo.isSpectator && playerInfo.getBedState() ) {
            playerInfo.isEliminated = false;
            playerInfo.deathState.respawnCountdown = settings.gaming.respawnTime.normalPlayers;
        }
    } )
}

/** 转化最终击杀数为普通击杀
 * @description 夺点模式不计最终击杀。
 */
export function convertKillCount() {
    eachValidPlayer( (player, playerInfo) => {
        if ( playerInfo.killCount.finalKill > 0 ) {
            playerInfo.killCount.finalKill--;
            playerInfo.killCount.kill++;
        }
    } )
}
