/**
 * ===== 状态效果逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 施加全局饱和效果。
 * · 对于拥有特殊加成的队伍，则添加特殊状态效果。
 */

import { ItemCompleteUseAfterEvent, Player } from "@minecraft/server";
import { eachTeam } from "../../methods/bedwarsTeam";
import { eachPlayer, entityIsNearby } from "../../methods/playerManager";
import { map } from "../../methods/bedwarsMaps";

/** 保持添加饱和效果 */
export function alwaysSaturation() {
    eachPlayer( player => { player.addEffect( "saturation", 1, { amplifier: 9, showParticles: false } ); } )
}

/** 团队升级状态效果 */
export function teamUpgradeEffects() {
    eachTeam( team => {
        let teamMembers = team.getTeamMember();
        if ( team.teamUpgrade.maniacMiner > 0 ) {
            teamMembers.forEach( player => { maniacMiner( player, team.teamUpgrade.maniacMiner - 1 ); } )
        };
        if ( team.teamUpgrade.healPool ) {
            teamMembers.filter( player => entityIsNearby( player, team.spawnpoint, map().healPoolRadius ) ).forEach( player => {
                healPool( player, 0 );
            } )
        };
    } );
}

/** 游戏后无敌效果 */
export function invulnerableAfterGame() {
    eachPlayer( player => {
        player.addEffect( "resistance", 110, { amplifier: 9, showParticles: false } );
    } )
}

/** 控制金苹果的伤害吸收效果最多维持两颗黄心
 * @param {ItemCompleteUseAfterEvent} event 
 */
export function goldenAppleEffect(event) {
    let item = event.itemStack; let player = event.source
    if ( item.typeId === "minecraft:golden_apple" ) {
        player.removeEffect( "absorption" );
        player.addEffect( "absorption", 2400, { amplifier: 0 } );
    }
}

/** 施加疯狂矿工效果（急迫效果）
 * @param {Player} player 施加玩家
 * @param {Number} amplifier 等级 - 1
 */
function maniacMiner( player, amplifier ) {
    player.addEffect( "haste", 600, { amplifier } );
}

/** 施加治愈池效果（生命恢复效果） */
function healPool( player, amplifier ) {
    player.addEffect( "regeneration", 100, { amplifier } )
}