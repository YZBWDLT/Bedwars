/**
 * ===== 装备逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 进行游戏事件计时与执行；
 * · 定时事件：在一段时间过后执行一个游戏事件，例如钻石、绿宝石生成点的升级；
 * · 队伍事件：检测队伍的淘汰，以及胜利判定。
 */

import { world } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps"
import { eachTeam } from "../../methods/bedwarsTeam";
import { eachPlayer, showTitle } from "../../methods/playerManager";
import { removeItemEntity } from "../../methods/itemManager";
import { overworld } from "../../methods/positionManager";
import { gameOver } from "./afterGaming";

/** ===== 主事件 ===== */

/** 普通模式游戏事件
 * @description 常规游戏事件：游戏将进行倒计时，倒计时结束后将触发特定事件。事件包括：钻石点升级、绿宝石点升级、床自毁、绝杀模式、游戏结束。
 */
export function gameEvents() {
    /** ===== 常规游戏事件 ===== */
    if ( map().gameEvent.nextEventCountdown > 0 ) {
        map().gameEvent.nextEventCountdown--;
    }
    else {
        if ( map().gameEvent.currentId === 0 ) { diamondTier2( 7200 ); }
        else if ( map().gameEvent.currentId === 1 ) { emeraldTier2( 7200 ); }
        else if ( map().gameEvent.currentId === 2 ) { diamondTier3( 7200 ); }
        else if ( map().gameEvent.currentId === 3 ) { emeraldTier3( 7200 ); }
        else if ( map().gameEvent.currentId === 4 ) { bedDestruction( 7200 ); }
        else if ( map().gameEvent.currentId === 5 ) { deathMatch( 7200 ); }
        else { gameOver(); };
    }
}

/** 队伍淘汰和胜利的判定
 * @description 队伍淘汰判定：如果该队伍床不存在、没有玩家且先前未被淘汰，则设置为淘汰。
 * @description 队伍胜利判定：如果仅剩一个队伍存活，则该队伍获胜。
 */
export function teamEliminateAndWin() {
    /** 队伍淘汰判定 */
    eachTeam( team => {
        if ( !team.bedInfo.isExist && team.getAliveTeamMember().length === 0 && !team.isEliminated ) {
            team.setTeamEliminated();
        }
    } );

    /** 队伍胜利判定 */
    if ( map().getAliveTeam().length <= 1 ) {
        gameOver( map().getAliveTeam()[0] );
    };
}

/** ===== 事件集 ===== */

/** 触发 II 级钻石点事件
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
export function diamondTier2( nextEventCountdown ) {
    world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier2" } );
    map().spawnerInfo.diamondLevel = 2;
    map().setNextEvent( nextEventCountdown, "绿宝石生成点 II 级" );
}

/** 触发 II 级绿宝石点事件
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
export function emeraldTier2( nextEventCountdown ) {
    world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier2" } );
    map().spawnerInfo.emeraldLevel = 2;
    map().setNextEvent( nextEventCountdown, "钻石生成点 III 级" );
}

/** 触发 III 级钻石点事件
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
export function diamondTier3( nextEventCountdown ) {
    world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier3" } );
    map().spawnerInfo.diamondLevel = 3;
    map().setNextEvent( nextEventCountdown, "绿宝石生成点 III 级" );
}

/** 触发 III 级绿宝石点事件
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
export function emeraldTier3( nextEventCountdown ) {
    world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier3" } );
    map().spawnerInfo.emeraldLevel = 3;
    map().setNextEvent( nextEventCountdown, "床自毁" );
}

/** 床自毁事件
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
function bedDestruction( nextEventCountdown ) {

    /** 破坏所有队伍的床 */
    eachTeam( team => {
        team.bedInfo.isExist = false;
        let { x: bedX, y: bedY, z: bedZ } = team.bedInfo.pos;
        overworld.runCommand( `setblock ${bedX} ${bedY} ${bedZ} air destroy` );
        removeItemEntity( "minecraft:bed" );
    } );
    /** 播报床破坏消息 */
    eachPlayer( player => {
        player.playSound( "mob.wither.death", { location: player.location } );
        showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed.allTeams" } );
        player.sendMessage( { translate: "message.bedDestroyed.allTeams" } );
    } );
    map().setNextEvent( nextEventCountdown, "绝杀模式" );
    
}

/** 开启绝杀模式
 * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
 */
function deathMatch( nextEventCountdown ) {

    /** 令每个存活的队伍召唤末影龙 */
    eachTeam( team => {
        if ( !team.isEliminated ) {
            overworld.spawnEntity( "minecraft:ender_dragon", map().spawnpointPos );
            if ( team.teamUpgrade.dragonBuff ) {
                overworld.spawnEntity( "minecraft:ender_dragon", map().spawnpointPos );
            };
        };
    } );
    /** 给每个玩家播放绝杀模式的标题 */
    eachPlayer( player => {
        showTitle( player, { translate: "title.deathMatch" } );
    } )
    /** 在世界原点处生成一块基岩，防止末影龙发疯 */
    overworld.runCommand( `setblock 0 60 0 barrier` );

    /** 下个事件的倒计时 */
    map().setNextEvent( nextEventCountdown, "游戏结束" );

}
