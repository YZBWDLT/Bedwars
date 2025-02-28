/**
 * ===== 玩家放置床逻辑 =====
 * 【夺点模式】
 * 本函数主要用于：
 * · 当玩家放置床后，进行判定。
 * · 将附近重新染色。
 */

import { ItemUseOnAfterEvent, world } from "@minecraft/server";
import { overworld, positionManager, Vector } from "../../methods/positionManager";
import { map } from "../../methods/bedwarsMaps";
import { getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { objectInArray } from "../../methods/number";

/** 当玩家对方块使用床时，执行的内容
 * @param {ItemUseOnAfterEvent} event 物品使用前事件
 */
export function playerPlaceBedTest( event ) {

    /** 确认玩家使用的是床物品，并且该玩家是有效玩家 */
    if ( event.itemStack.typeId.includes( "bedwars:" ) && event.itemStack.typeId.includes( "_bed" ) && playerIsValid( event.source ) ) {

        /** 玩家 */ let player = event.source;
        /** 玩家的起床战争信息 */ let playerInfo = getPlayerBedwarsInfo( player );
        /** 队伍 */ let team = playerInfo.getTeam();
        /** 玩家使用床的点位 */ let bedPos = getValidBedPoint( event.block.location );

        /** 当玩家使用床后，如果是对基岩使用并且为有效点位则放置床 */
        if ( bedPos !== undefined ) {
            /** 为该队伍添加该点位 */
            team.captureInfo.bedsPos.push( bedPos );
            /** 更换附近方块的颜色 */
            recolorBlocks( bedPos, team.id );
            /** 重新放置床 */
            team.setBed();
            /** 通报消息 | 特殊地，如果有队伍获得了新床之后只有 1 张床，则通报该队队员将全体重生 */
            world.sendMessage( { translate: "message.capture.bedCaptured", with: { rawtext: [ { translate: `team.${team.id}` }, { text: `${team.captureInfo.bedsPos.length}` } ] } } );
            if ( team.captureInfo.bedsPos.length === 1 ) { world.sendMessage( { translate: `message.respawn.newBed` } ) }
        }
    }
}

/** 当玩家手持“床”进行操作时，获取其有效点位
 * @description 因床的长度为 2 格，所以玩家点击的基岩的上方 1 格不一定是待检测点位
 * @param {Vector} usingBlockPos 玩家在手持“床”使用方块时，该方块的位置
 * @return 当玩家点击的方块的位置在允许的点位中，则返回有效坐标值，否则返回空值
 */
function getValidBedPoint( usingBlockPos ) {

    /** 检测点位（使用的方块的上方 1 格） */
    let testPos = positionManager.add( usingBlockPos, 0, 1, 0 );
    /** 所有有效点位 */
    let validPos = map().captureInfo.validBedPoints;

    /** 如果检测点位正好是有效点中的一个，则直接返回该检测点位 */
    if ( objectInArray( validPos, testPos ) ) { return testPos; }
    /** 如果检测点位在某个有效点的 z+1 处（即检测点位的 z-1 后为某个有效点，因有效点均取x,y,z最小），则返回检测点位 z-1 后的值 */
    else if ( objectInArray( validPos, positionManager.add( testPos, 0, 0, -1 ) ) ) { return positionManager.add( testPos, 0, 0, -1 ); }
    /** 否则，返回未定义 */
    else { return void 0; }

}

/**
 * 将床点位附近的方块重新染色
 * @param {Vector} bedPoint 有效的床点位信息
 * @param {import("../../methods/bedwarsTeam").validTeams} teamId 放置床的队员所在的队伍ID
 */
function recolorBlocks( bedPoint, teamId ) {

    /** 坐标信息 */
    let { x, y, z } = bedPoint;
    /** 颜色信息 */
    let colors = [ "white", "red", "blue" ];
    /** fill命令模板 @param {String} blocks 替代的方块 @param {String} replaceBlocks 待替代的方块 */
    let fill = ( blocks, replaceBlocks ) => { overworld.runCommand( `fill ${x-4} ${y-1} ${z-3} ${x+4} ${y+8} ${z+4} ${blocks} replace ${replaceBlocks}` ); }

    /** 将对应颜色的羊毛、硬化粘土、防爆玻璃替换为对应队伍的颜色 */
    colors.filter( color => color !== teamId ).forEach( color => {
        fill( `${teamId}_wool`, `${color}_wool` );
        fill( `bedwars:${teamId}_wool`, `bedwars:${color}_wool` );
        fill( `bedwars:${teamId}_stained_hardened_clay`, `bedwars:${color}_stained_hardened_clay` );
        fill( `bedwars:${teamId}_blast_proof_glass`, `bedwars:${color}_blast_proof_glass` );
    } );

}