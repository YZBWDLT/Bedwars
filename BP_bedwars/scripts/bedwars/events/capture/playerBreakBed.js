/** 
 * ===== 玩家破坏床检测 =====
 * 该文件是基于gaming/playerBreakBlockTest.js而编写的。在实际使用中，应视情况禁用其中的某些函数，然后启用这里的替代函数。
 */

import { PlayerBreakBlockAfterEvent, Player, world } from "@minecraft/server";
import { BedwarsPlayer, eachValidPlayer, getPlayerBedwarsInfo, playerIsValid, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

import { removeItemEntity } from "../../methods/itemManager";
import { overworld, positionManager } from "../../methods/positionManager";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { showTitle } from "../../methods/playerManager";
import { removeElementOfArray } from "../../methods/number";

/** 玩家破坏床检测
 * @param {PlayerBreakBlockAfterEvent} event 
 */
export function playerBreakBedTestCapture( event ) {

    /** 如果玩家破坏的方块是床，进行判定 */
    if ( event.brokenBlockPermutation.type.id === "minecraft:bed" ) {

        /** ===== 获取基本信息 ===== */

        /** 破坏床的玩家 */ let breaker = event.player;
        /** 破坏床的玩家的起床战争信息 */ let breakerInfo = getPlayerBedwarsInfo( breaker );
        /** 被破坏床的队伍 */ let team = map().teamList.filter( team => {
            let bedDestroyed = false;
            team.captureInfo.bedsPos.forEach( pos => { if ( overworld.getBlock( pos ).typeId === "minecraft:air" ) { bedDestroyed = true; } } )
            return bedDestroyed;
        } )[0];

        /** ===== 判断逻辑 ===== */

        /** 如果玩家不是有效玩家，或是无队伍的玩家，则还原床 */
        if ( !playerIsValid( breaker ) || !breakerInfo.team ) {
            invalidPlayerBreakBed( team, breaker );
        }
        /** 如果是被自家玩家破坏，则还原床 */
        else if ( breakerInfo.team === team.id ) {
            selfPlayerBreakBed( team, breaker );
        }
        /** 否则，床被破坏 */
        else {
            otherPlayerBreakBed( team );
        }

        /** ===== 其他 ===== */
        
        /** 清除掉落物 */
        removeItemEntity( "minecraft:bed" );
                
    }
}

/** 床被无效玩家破坏时
 * @param {BedwarsTeam} team 被破坏床的队伍
 * @param {Player} breaker 破坏床的玩家
 */
function invalidPlayerBreakBed( team, breaker ) {
    warnPlayer( breaker, { translate: "message.invalidPlayer.breakingBed" } );
    team.setBed( );
}

/** 床被自家玩家破坏时
 * @param {BedwarsTeam} team 被破坏床的队伍
 * @param {Player} breaker 破坏床的玩家
 */
function selfPlayerBreakBed( team, breaker ) {
    warnPlayer( breaker, { translate: "message.selfTeamPlayer.breakingBed" } );
    team.setBed( );
}

/** 床被其他队玩家玩家破坏时
 * @param {BedwarsTeam} team 被破坏床的队伍
 */
function otherPlayerBreakBed( team ) {

    /** 更新床状态 | 如果床被破坏，则将空床附近的方块染色 */
    team.captureInfo.bedsPos.forEach( bedPos => {
        if ( overworld.getBlock( bedPos ).typeId === "minecraft:air" ) {
            removeElementOfArray( team.captureInfo.bedsPos, bedPos );
            recolorBlocks( bedPos );
        }
    } )

    /** 全体玩家通报 */
    world.sendMessage( { translate: "message.capture.bedDestroyed", with: { rawtext: [ { translate: `team.${team.id}` }, { text: `${team.captureInfo.bedsPos.length}` } ] } } );
    if ( team.captureInfo.bedsPos.length === 0 ) {
        eachValidPlayer( ( player, playerInfo ) => {
            /** 本队玩家播放标题 */
            if ( playerInfo.team === team.id ) {
                showTitle( player, { translate: "title.capture.allBedDestroyed", with: { rawtext: [ { translate: `team.${team.id}` } ] } }, { translate: "subtitle.capture.allBedDestroyed.self" } );
                player.sendMessage( { translate: "message.capture.allBedDestroyed.self" } );
                player.playSound( "mob.wither.death" );
            }
            /** 别队玩家播放标题 */
            else {
                showTitle( player, { translate: "title.capture.allBedDestroyed", with: { rawtext: [ { translate: `team.${team.id}` } ] } }, { translate: "subtitle.capture.allBedDestroyed.other" } );
                player.sendMessage( { translate: "message.capture.allBedDestroyed.other" } );
                player.playSound( "mob.enderdragon.growl", { location: positionManager.add( player.location, 0, 12 ) } );
            }
        } );
    }
}

/**
 * 将床点位附近的方块重新染色
 * @param {Vector} bedPoint 有效的床点位信息
 */
function recolorBlocks( bedPoint ) {

    /** 坐标信息 */
    let { x, y, z } = bedPoint;
    /** 颜色信息 */
    let colors = [ "red", "blue" ];
    /** fill命令模板 @param {String} blocks 替代的方块 @param {String} replaceBlocks 待替代的方块 */
    let fill = ( blocks, replaceBlocks ) => { overworld.runCommand( `fill ${x-4} ${y-1} ${z-3} ${x+4} ${y+8} ${z+4} ${blocks} replace ${replaceBlocks}` ); }

    /** 将对应颜色的羊毛、硬化粘土、防爆玻璃替换为对应队伍的颜色 */
    colors.forEach( color => {
        fill( `white_wool`, `${color}_wool` );
        fill( `bedwars:white_wool`, `bedwars:${color}_wool` );
        fill( `bedwars:white_stained_hardened_clay`, `bedwars:${color}_stained_hardened_clay` );
        fill( `bedwars:white_blast_proof_glass`, `bedwars:${color}_blast_proof_glass` );
    } );

}
