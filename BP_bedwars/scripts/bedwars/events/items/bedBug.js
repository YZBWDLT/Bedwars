/**
 * ===== 床虱 =====
 * 床虱即蠹虫雪球。
 * 在床虱扔中的地方，生成一只掷出者队伍的蠹虫。
 * 如果掷出者不存在队伍，则不设定队伍。
 * 考虑到蠹虫可能无法及时响应敌人，因此需要在敌人接近时手动施加伤害。
 * 每只存在队伍的蠹虫最多存活 15 秒。
 * 存活时间和队伍信息将显示到蠹虫的名称上。
 */

import { Entity, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent } from "@minecraft/server"
import { BedwarsPlayer, getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { overworld } from "../../methods/positionManager";

/** 设定蠹虫额外属性
 * @param {Entity} silverfish 要更改的蠹虫信息
 * @param {BedwarsPlayer} throwerInfo 掷出者的起床战争信息
 */
function setSilverfishProperties( silverfish, throwerInfo ) {
    
    /** 队伍 */
    silverfish.team = throwerInfo.getTeam( );

    /** 生成事件 */
    silverfish.triggerEvent( `team_${throwerInfo.team}` );

    /** 消失计时 */
    silverfish.killTimer = 0;

    /** 名称 */
    silverfish.nameSetter = () => {
        const index = Math.floor( silverfish.killTimer / 60 );
        const bars = "■■■■■";
        const timePassedColor = silverfish.team.id === "gray" ? "§8" : "§7";
        if ( index >= 0 && index <= 4 ) {
            return bars.slice(0, 5 - index) + timePassedColor + bars.slice(5 - index);
        }
        return `${timePassedColor}■■■■■`;
    }

}

/** 在床虱砸中的位置生成蠹虫
 * @param {ProjectileHitEntityAfterEvent | ProjectileHitBlockAfterEvent} event 
 */
export function summonSilverfish( event ) {

    if ( event.projectile.typeId === "bedwars:bed_bug" ) {

        /** 在砸中的位置生成一只蠹虫 */
        let silverfish = event.dimension.spawnEntity( "minecraft:silverfish", event.location );

        /** 如果掷出者是拥有正常起床信息的玩家，则设定其额外属性 */
        if ( playerIsValid( event.source ) ) { setSilverfishProperties( silverfish, getPlayerBedwarsInfo( event.source ) ) }

    }

}

/** 蠹虫存活倒计时 */
export function silverfishCountdown() {

    /** 令每只有队伍的蠹虫执行 */
    overworld.getEntities( { type: "minecraft:silverfish" } ).filter( silverfish => silverfish.killTimer !== undefined ).forEach( silverfish => {

        /** 计时 */
        silverfish.killTimer++;

        /** 设定名称 */
        silverfish.nameTag = `§8[§r${silverfish.team.getTeamColor()}${silverfish.nameSetter()}§8]\n§l${silverfish.team.getTeamNameWithColor()}队 §r${silverfish.team.getTeamColor()}蠹虫`;

        /** 当蠹虫击杀计时到达后，立即清除蠹虫 */
        if ( silverfish.killTimer >= 300 ) { silverfish.kill( ); };

    } );

}

function setSilverfishTarget() {}
