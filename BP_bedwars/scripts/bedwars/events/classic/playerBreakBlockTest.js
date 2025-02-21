/** 玩家破坏方块检测 */

import { system, PlayerBreakBlockBeforeEvent, PlayerBreakBlockAfterEvent, Player } from "@minecraft/server";
import { settings } from "../../methods/bedwarsSettings";
import { BedwarsPlayer, eachValidPlayer, getPlayerBedwarsInfo, playerIsValid, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

import { removeItemEntity } from "../../methods/itemManager";
import { overworld, positionManager } from "../../methods/positionManager";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { getPlayerAmount, showTitle } from "../../methods/playerManager";

/** 玩家破坏原版方块检测
 * @param {PlayerBreakBlockBeforeEvent} event 破坏方块检测事件
 */
export function playerBreakVanillaBlocksTest( event ) {

    /** 可由玩家破坏的原版方块 */
    const breakableVanillaBlocksByPlayer = [ "minecraft:bed", "minecraft:short_grass", "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];

    /** 如果玩家破坏的方块是原版方块，且不属于上方列出的的可破坏方块，则防止玩家破坏方块 */ 
    if ( event.block.typeId.includes( "minecraft:" ) && !breakableVanillaBlocksByPlayer.includes( event.block.typeId ) && !settings.miscellaneous.creativePlayerCanBreakBlocks ) {
        let breaker = event.player;
        system.run( () => { warnPlayer( breaker, { translate: "message.breakingInvalidBlocks" } ); } );
        event.cancel = true;
    }

}

/** 玩家破坏床检测
 * @param {PlayerBreakBlockAfterEvent} event 
 */
export function playerBreakBedTest( event ) {

    /** 如果玩家破坏的方块是床，进行判定 */
    if ( event.brokenBlockPermutation.type.id === "minecraft:bed" ) {

        /** ===== 获取基本信息 ===== */

        /** 破坏床的玩家 */ let breaker = event.player;
        /** 破坏床的玩家的起床战争信息 */ let breakerInfo = getPlayerBedwarsInfo( breaker );
        /** 被破坏床的队伍 */ let team = map().teamList.filter( team => overworld.getBlock( team.bedInfo.pos ).typeId === "minecraft:air" && team.bedInfo.isExist )[0];

        /** ===== 判断逻辑 ===== */

        /** 如果床不是有效的床，则直接跳过 */
        if ( !team ) {

        }
        /** 如果玩家不是有效玩家，或是无队伍的玩家，则还原床 */
        else if ( !playerIsValid( breaker ) || !breakerInfo.team ) {
            invalidPlayerBreakBed( team, breaker );
        }
        /** 如果是被自家玩家破坏，则还原床 */
        else if ( breakerInfo.team === team.id ) {
            selfPlayerBreakBed( team, breaker );
        }
        /** 否则，床被破坏 */
        else {
            otherPlayerBreakBed( team, breaker, breakerInfo );
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
 * @param {BedwarsTeam} team  被破坏床的队伍
 * @param {Player} breaker 破坏床的玩家
 * @param {BedwarsPlayer} breakerInfo 破坏床的玩家的起床信息
 */
function otherPlayerBreakBed( team, breaker, breakerInfo ) {

    /** 更新床状态 */
    team.bedInfo.isExist = false;

    /** 为破坏者添加床破坏数 */
    breakerInfo.killCount.bed++;

    /** 全体玩家通报 */
    eachValidPlayer( ( player, playerInfo ) => {

        if ( playerInfo.team === team.id ) {
            selfBedDestroyedMessage( player, breaker.nameTag );
        }
        else {
            otherBedDestroyedMessage( player, breaker.nameTag, team.id );
        }
    } )

}

/** 当自家床被破坏后，播放消息
 * @param {Player} player 要将此类消息播报给的玩家
 * @param {String} breakerName 破坏床的玩家的 nameTag
 */
function selfBedDestroyedMessage( player, breakerName ) {

    /** 显示标题并播放音效 */
    showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed" } );
    player.playSound( "mob.wither.death" );
    
    /** 对内通报 */
    player.sendMessage( [ "\n", { translate: "message.bedDestroyed", with: [ `${breakerName}` ] }, "\n " ] );
    
}

/** 当别队家床被破坏后，播放消息
 * @param {Player} player 要将此类消息播报给的玩家
 * @param {String} breakerName 破坏床的玩家的 nameTag
 * @param {String} teamId 被破坏床的队伍的队伍名称
 */
function otherBedDestroyedMessage( player, breakerName, teamId ) {
    
    /** 播放音效（末影龙的麦很炸，所以提高 12 格） */
    player.playSound( "mob.enderdragon.growl", { location: positionManager.add( player.location, 0, 12 ) } );

    /** 对外通报 */
    player.sendMessage( [ "\n", { translate: "message.otherBedDestroyed", with: { rawtext: [ { translate: `team.${teamId}` }, { text: `${breakerName}` } ] } }, "\n " ] );
    
}
