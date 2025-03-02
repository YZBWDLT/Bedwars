/**
 * ===== 玩家破坏方块逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 阻止玩家破坏原版方块；
 * · 当玩家破坏床后，进行判定。
 */

import { system, PlayerBreakBlockBeforeEvent, PlayerBreakBlockAfterEvent } from "@minecraft/server";
import { settings } from "../../methods/bedwarsSettings";
import { eachValidPlayer, getPlayerBedwarsInfo, playerIsValid, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

import { removeItemEntity } from "../../methods/itemManager";
import { overworld, positionManager } from "../../methods/positionManager";
import { showTitle } from "../../methods/playerManager";

/** 玩家破坏原版方块检测
 * @param {PlayerBreakBlockBeforeEvent} event 破坏方块检测事件
 */
export function playerBreakVanillaBlocksTest( event ) {

    /** 可由玩家破坏的原版方块 */
    const breakableVanillaBlocksByPlayer = [ "minecraft:bed", "minecraft:short_grass", "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];
    /** 创造模式的玩家是否可破坏方块 */ const creativeBreakable = settings.miscellaneous.creativePlayerCanBreakBlocks;

    // 如果玩家破坏的方块是原版方块，且不属于上方列出的的可破坏方块，则防止玩家破坏方块
    if (
        event.block.typeId.includes( "minecraft:" ) // 原版方块
        && !breakableVanillaBlocksByPlayer.includes( event.block.typeId ) // 不为上面所列出的方块
        && (
            ( creativeBreakable && event.player.getGameMode() !== "creative" ) // 创造模式的玩家可破坏方块时，玩家不处于生存模式
            || !creativeBreakable // 创造模式的玩家也不可破坏方块时
        )
    ) {
        event.cancel = true;
        let breaker = event.player;
        system.run( () => { warnPlayer( breaker, { translate: "message.breakingInvalidBlocks" } ); } );
    }
}

/** 玩家破坏床检测
 * @param {PlayerBreakBlockAfterEvent} event 
 */
export function playerBreakBedTest( event ) {

    /** 如果玩家破坏的方块是床，进行判定 */
    if ( event.brokenBlockPermutation.type.id === "minecraft:bed" ) {

        /** 破坏床的玩家 */ const breaker = event.player;
        /** 破坏床的玩家的起床战争信息 */ const breakerInfo = getPlayerBedwarsInfo( breaker );
        /** 被破坏床的队伍 */ const team = map().teamList.find( team => overworld.getBlock( team.bedInfo.pos ).typeId === "minecraft:air" && team.bedInfo.isExist );
        
        // 清除掉落物
        removeItemEntity( "minecraft:bed" );

        // 如果床不是有效的床，则直接跳过
        if ( !team ) { }
        // 如果玩家不是有效玩家，或是无队伍的玩家，则还原床
        else if ( !playerIsValid( breaker ) || !breakerInfo.team ) {
            warnPlayer( breaker, { translate: "message.invalidPlayer.breakingBed" } );
            team.setBed( );
        }
        // 如果是被自家玩家破坏，则还原床
        else if ( breakerInfo.team === team.id ) {
            warnPlayer( breaker, { translate: "message.selfTeamPlayer.breakingBed" } );
            team.setBed( );
        }
        // 否则，床被破坏
        else {
            // 更新床状态
            team.bedInfo.isExist = false;
            // 为破坏者添加床破坏数
            breakerInfo.killCount.bed++;
            // 进行全体玩家通报
            eachValidPlayer( ( player, playerInfo ) => {
                /** 破坏者的玩家名 */ const breakerName = breaker.nameTag;

                // 对本队玩家通报
                if ( playerInfo.team === team.id ) {
                    showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed" } );
                    player.playSound( "mob.wither.death" );
                    player.sendMessage( [ "\n", { translate: "message.bedDestroyed", with: [ `${breakerName}` ] }, "\n " ] );
                }
                // 对他队玩家通报
                else {
                    player.playSound( "mob.enderdragon.growl", { location: positionManager.add( player.location, 0, 12 ) } ); // 播放音效（末影龙的麦很炸，所以提高 12 格）
                    player.sendMessage( [ "\n", { translate: "message.otherBedDestroyed", with: { rawtext: [ { translate: `team.${team.id}` }, { text: `${breakerName}` } ] } }, "\n " ] );
                }
            } )
        }
    }
}
