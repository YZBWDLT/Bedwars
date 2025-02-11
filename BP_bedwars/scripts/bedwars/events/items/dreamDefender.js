/**
 * ===== 梦境守护者 =====
 * 玩家会获得梦境守护者的刷怪蛋，即铁傀儡。
 * 在玩家使用梦境守护者的地方，将生成一只铁傀儡。
 * 如果使用者不存在队伍，则不设定队伍。
 * 每只存在队伍的铁傀儡最多存活 4 分钟。
 * 存活时间和队伍信息将显示到铁傀儡的名称上。
 * 考虑到铁傀儡可能无法及时响应敌人，因此需要在敌人接近时手动施加伤害。
 */

import { ItemUseOnBeforeEvent, system } from "@minecraft/server";
import { BedwarsPlayer, getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { overworld, positionManager } from "../../methods/positionManager";

/** 设定铁傀儡额外属性
 * @param {Entity} ironGolem 
 * @param {BedwarsPlayer} placerInfo 
 */
function setIronGolemProperties( ironGolem, placerInfo ) {

    /** 队伍 */
    ironGolem.team = placerInfo.getTeam( );

    /** 生成事件 */
    ironGolem.triggerEvent( `team_${placerInfo.team}` );
    
    /** 消失计时 */
    ironGolem.killTimer = 0;
    
    /** 名称 */
    ironGolem.nameSetter = () => {
        const index = Math.floor( ironGolem.killTimer / 480 );
        const bars = "■■■■■■■■■■";
        if ( index >= 0 && index <= 9 ) {
            return bars.slice(0, 10 - index) + "§7" + bars.slice(10 - index);
        }
        return "§7■■■■■■■■■■";
    }

}

/** 在玩家使用梦境守护者的方块上方生成铁傀儡
 * @param {ItemUseOnBeforeEvent} event 
 */
export function summonIronGolem( event ) {

    /** 检测玩家对方块使用的物品是否为梦境守护者 */
    if ( event.itemStack.typeId === "bedwars:dream_defender" ) {

        /** 如果是，则取消事件的发生 */
        event.cancel = true;

        /** 手动生成一只新的铁傀儡 */
        system.run( () => {

            /** 在被使用的方块上方生成一只铁傀儡 */
            let ironGolem = event.block.dimension.spawnEntity( "minecraft:iron_golem", positionManager.add( event.block.location, 0, 1 ) );

            /** 清除一个玩家的刷怪蛋物品 */
            if ( event.source.getGameMode() !== "creative" ) { event.source.runCommand( `clear @s bedwars:dream_defender -1 1` ) };

            /** 如果使用者是拥有正常起床信息的玩家，则设定其额外属性 */
            if ( playerIsValid( event.source ) ) { setIronGolemProperties( ironGolem, getPlayerBedwarsInfo( event.source ) ) }

        } )
    }
}

/** 铁傀儡存活倒计时 */
export function ironGolemCountdown() {

    /** 令每只有队伍的铁傀儡执行 */
    overworld.getEntities( { type: "minecraft:iron_golem" } ).filter( ironGolem => ironGolem.killTimer !== undefined ).forEach( ironGolem => {

        /** 计时 */
        ironGolem.killTimer++;

        /** 设定名称 */
        ironGolem.nameTag = `§8[§r${ironGolem.team.getTeamColor()}${ironGolem.nameSetter()}§8]\n§l${ironGolem.team.getTeamColor()}铁傀儡`;

        /** 当铁傀儡击杀计时到达后，立即清除铁傀儡 */
        if ( ironGolem.killTimer >= 4800 ) { ironGolem.kill( ); };

    } )

}

function setIronGolemTarget() {}
