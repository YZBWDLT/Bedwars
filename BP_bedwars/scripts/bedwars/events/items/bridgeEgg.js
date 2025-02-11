/**
 * ===== 搭桥蛋 =====
 * 搭桥蛋用于在其经过之处搭设一座桥梁。
 * 所过之处会播放音效。
 * 放置投掷者所在队伍的颜色的羊毛。如果投掷者不存在队伍，则放置白色羊毛。
 * 每次放置，范围是3*3的区域，保留85%的完整度。
 */

import { Entity, Player } from "@minecraft/server";
import { eachPlayer } from "../../methods/playerManager";
import { getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { overworld } from "../../methods/positionManager";
import { map } from "../../methods/bedwarsMaps";

/** 在搭桥蛋途经之处创建一座桥 */
export function createBridge() {

    /** 在搭桥之前，如果已经出界，则直接移除之 */
    map().removeEntityOutOfBorder( "bedwars:bridge_egg", -5 );

    /** 使每个搭桥蛋执行 */
    overworld.getEntities( { type: "bedwars:bridge_egg" } ).forEach( bridgeEgg => {
        /** 获取投掷者信息 @type {Entity} */
        let thrower = bridgeEgg.getComponent( "minecraft:projectile" ).owner
        /** 设置搭桥蛋属性 */
        setBridgeEggProperties( bridgeEgg, thrower );
        /** 创造桥面 */
        fillBlocksEachLayer( bridgeEgg, bridgeEgg.color, 0.85 );
        /** 播放音效 */
        eachPlayer( player => { player.playSound( "random.pop", { location: bridgeEgg.location } ) } );
    } );
}

/** 设置搭桥蛋的属性
 * @param {Entity} bridgeEgg 要更改的搭桥蛋信息
 * @param {Player} thrower 掷出者
 */
function setBridgeEggProperties( bridgeEgg, thrower ) {
    /** 设定颜色 */
    bridgeEgg.color = "white";
    if ( playerIsValid( thrower ) ) { bridgeEgg.color = getPlayerBedwarsInfo( thrower ).team; }
}

/** 放置每层羊毛
 * @param {Entity} bridgeEgg 放置羊毛的搭桥蛋
 * @param {String} color 放置的羊毛颜色
 * @param {Number} integrity 每次放置的完整度，取值[0,1]
 */
function fillBlocksEachLayer( bridgeEgg, color, integrity = 0.85 ) {

    /** 获取 ID */
    let woolId = `bedwars:${color}_wool`;

    /** 填充完整的一层 */
    bridgeEgg.runCommand( `fill ~-1~-2~-1~1~-2~1 ${woolId} keep` )

    /** 令填充的每一格遍历，按照完整度的要求随机填充空气 */
    for ( let x=-1; x<=1; x++ ) {
        for ( let z=-1; z<=1; z++ ) {
            if ( Math.random() >= integrity ) {
                bridgeEgg.runCommand( `fill ~${x}~-2~${z} ~${x}~-2~${z} air replace ${woolId}` );
            }
        }
    }

}
