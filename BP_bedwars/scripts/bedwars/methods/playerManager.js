/**
 * ===== 玩家方法 =====
 * 用于获取玩家数据。也负责处理玩家标题。
 */

import { world, Player, Entity } from "@minecraft/server";
import { overworld, Vector } from "./positionManager";

/** ===== 获取玩家 ===== */

/** 获取玩家数目 */
export function getPlayerAmount() {
    return world.getPlayers().length;
};

/** 获取在特定的位置附近是否有玩家
 * @param {Vector} pos 获取特定位置
 * @param {number} r 检测位置附近的半径
 */
export function getPlayerNearby( pos, r ) {
    return overworld.getPlayers( { location: pos, maxDistance: r } )
}

/** 使每个玩家都执行一个 func 函数
 * @param {function(Player)} func - 一个接受 Player 类型参数的函数
 */
export function eachPlayer( func ) {
    world.getPlayers().forEach( player => { func( player ) } );
}

/** 使每个临近的玩家执行一个 func 函数
 * @param {Vector} pos 获取特定位置
 * @param {number} r 检测位置附近的半径
 * @param {function(Player)} func - 一个接受 Player 类型参数的函数
 */
export function eachNearbyPlayer( pos, r, func ) {
    getPlayerNearby( pos, r ).forEach( player => { func( player ) } )
}

/** 判断实体是否在某位置附近
 * @param {Entity} entity 待检测实体
 * @param {Vector} pos 位置
 * @param {Number} r 检测范围
*/
export function entityIsNearby( entity, pos, r ) {
    let { x, y, z } = pos;
    return entity.runCommand( `execute if entity @s[x=${x},y=${y},z=${z},r=${r}]` ).successCount !== 0;
}

/** ===== 玩家控制 ===== */

/** 设置玩家的游戏模式，当玩家为创造模式时则不尝试设置
 * @param {Player} player 
 * @param {"adventure"|"survival"|"spectator"} gamemode 
 */
export function setPlayerGamemode( player, gamemode ) {
    if ( player.getGameMode() !== "creative" && player.getGameMode() !== gamemode ) {
        player.setGameMode( gamemode );
    };
}

/** ===== 标题 ===== */

/**
 * @typedef titleOptions 标题可选项
 * @property {Number} fadeInDuration 淡入时间，默认 10 刻
 * @property {Number} stayDuration 持续时间，默认 70 刻
 * @property {Number} fadeOutDuration 淡出时间，默认 20 刻
 */

/** 默认设置 @type {titleOptions} */ const defaultTitleOptions = { fadeInDuration: 10, stayDuration: 70, fadeOutDuration: 20 }

/** 对特定玩家展示标题和副标题
 * @param {Player} player 待展示标题的玩家
 * @param {String | import("@minecraft/server").RawMessage} title 标题
 * @param {String | import("@minecraft/server").RawMessage} subtitle 副标题，默认值""
 * @param {titleOptions} options 可选项
 */
export function showTitle( player, title, subtitle = "", options = {} ) {
    player.onScreenDisplay.setTitle( title, { ...defaultTitleOptions, ...options, subtitle: subtitle } );
}
