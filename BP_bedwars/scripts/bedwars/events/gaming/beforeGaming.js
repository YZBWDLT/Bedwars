/**
 * ===== 游戏前 =====
 * 在玩家集体在大厅等待时所执行的事件。
 * 非创造或冒险模式的玩家，需要调整游戏模式。
 * 禁止玩家跑出去。
 * 在等待过程中，首先需要重置地图，这需要先清空地图，再加载，再给各个队伍岛屿上色。然后进入等待状态。
 * 当玩家人数达到所设定的人数后（默认为 2），则启动倒计时。
 * 如果有玩家退出导致等待人数不足，则停止倒计时。
 */

import { system, world } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps.js";
import { settings } from "../../methods/bedwarsSettings.js";

import { tickToSecond } from "../../methods/time.js";
import { getPlayerAmount, showTitle, eachPlayer, setPlayerGamemode } from "../../methods/playerManager.js";
import { overworld, Vector } from "../../methods/positionManager.js";
import { eachValidPlayer } from "../../methods/bedwarsPlayer.js";
import { eventManager } from "../eventManager.js";
import { eachTeam } from "../../methods/bedwarsTeam.js";

/** ===== 等待时 ===== */

/** 将在外面的玩家传送回来 */
function tpPlayerBack( ) {
    eachPlayer( player => {
        if ( player.getGameMode() !== "creative" && player.runCommand( `execute if entity @s[x=-12,y=119,z=-12,dx=25,dy=10,dz=25]` ).successCount === 0 ) { player.teleport( new Vector( 0, 121, 0 ) ) }
    } )
}

/** 清除地图与重加载地图 */
function reloadMap( ) {

    /** 清除本层结构
     * @param { Number } layer - 要清除的层数
     * @param { Number } range - 要清除的层的范围（正方形的半长边）
     */
    let clearLayer = ( layer, range = settings.mapRange ) => {
        for ( let i of [ 1, -1 ] ) { for ( let j of [ 1, -1 ] ) { overworld.runCommand( `fill 0 ${layer} 0 ${range*i} ${layer} ${range*j} air` ) } }
    }
    /** 地图加载信息 */ let loadInfo = map().loadInfo;

    /** 清除原场景 */
    if ( loadInfo.clearingLayer !== 0 ) {
        /** 每隔 loadInfo.clearTimePerLayer 刻，清理一层 */
        if ( system.currentTick % loadInfo.clearTimePerLayer === 0 ) {
            /** 倒计时 */ loadInfo.clearingLayer--;
            /** 清除本层 */ clearLayer( loadInfo.clearingLayer );
        }
        /** 清除完毕后，加载结构 */
        if ( loadInfo.clearingLayer === 0 ) { map().generateMap(); };
    }
    /** 加载结构等待 */
    else if ( loadInfo.structureLoadTime !== 0 ) {
        /** 倒计时 */
        loadInfo.structureLoadTime--;
        /** 倒计时结束后，设置队伍岛屿颜色与床 */
        if ( loadInfo.structureLoadTime === 0 ) {
            map().teamIslandInit();
            overworld.runCommand( `kill @e[type=item]` );
        };
    }
    /** 设置队伍岛屿颜色与床等待 */
    else {
        /** 倒计时 */
        loadInfo.setTeamIslandTime--;
        /** 倒计时结束后，设置等待时间，并关闭加载状态 */
        if ( loadInfo.setTeamIslandTime === 0 ) {
            loadInfo.isLoading = false;
            map().gameStartCountdown = settings.gameStartWaitingTime;
        }
    }

}

/** 开始游戏倒计时 */
function startCountdown( ) {
    /** 倒计时 */
    map().gameStartCountdown--;
    /** 提醒玩家还有多长时间开始游戏 */
    eachPlayer( player => {
        if ( map().gameStartCountdown === 399 ) {
            player.sendMessage( { translate: "message.gameStart", with: [ `20` ] } );
            player.playSound( "note.hat", { location: player.location } );
        } else if ( map().gameStartCountdown === 199 ) {
            player.sendMessage( { translate: "message.gameStart", with: [ `§610` ] } );
            showTitle( player, `§a10`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
            player.playSound( "note.hat", { location: player.location } );
        } else if ( map().gameStartCountdown < 100 && map().gameStartCountdown % 20 === 19 ) {
            player.sendMessage( { translate: "message.gameStart", with: [ `§c${tickToSecond( map().gameStartCountdown )}` ] } );
            showTitle( player, `§c${tickToSecond( map().gameStartCountdown )}`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
            player.playSound( "note.hat", { location: player.location } );
        }
    } )
    /** 倒计时结束后，开始游戏 */
    if ( map().gameStartCountdown === 0 ) { gameStart(); }
}

/** 停止游戏倒计时 */
function cancelCountdown( ) {
    /** 重置倒计时 */
    map().gameStartCountdown = settings.gameStartWaitingTime;
    /** 提醒玩家倒计时已取消 */
    eachPlayer( player => {
        player.sendMessage( { translate: "message.needsMorePlayer" } );
        showTitle( player, { translate: "title.needsMorePlayer" }, "", { fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 0 } );
        player.playSound( "note.hat", { location: player.location } );
    } )
}

/** 在大厅等待时 */
export function waiting() {

    tpPlayerBack( );

    /** 设置玩家游戏模式 */
    eachPlayer( player => {
        setPlayerGamemode( player, "adventure" );
    } )

    /** 加载地图流程 */
    if ( map().loadInfo.isLoading ) { reloadMap( ); }
    /** 加载地图结束后，等待时 */
    else {
        /** 大于规定的人数时，开始倒计时 */
        if ( getPlayerAmount() >= settings.minWaitingPlayers ) { startCountdown( ); }
        /** 人数不足时，且已经开始倒计时，则取消倒计时 */
        else if ( map().gameStartCountdown < settings.gameStartWaitingTime ) { cancelCountdown( ); }
    }
}

/** ===== 游戏开始 ===== */

function gameStart() {

    /** 开始游戏 */
    map().gameStage = 1;

    /** 分配玩家队伍 */
    map().assignPlayersRandomly();

    /** 设置商人 */
    map().setTrader();

    /** 设置为可PVP */
    world.gameRules.pvp = true;

    eachValidPlayer( ( player, playerInfo ) => {

        /** 将玩家传送到队伍中 */
        playerInfo.teleportPlayerToSpawnpoint();

        /** 调整玩家的游戏模式 */
        setPlayerGamemode( player, "survival" );

        /** 播报消息 */
        player.sendMessage( [ { translate: "message.greenLine" }, "\n", map().getStartIntro().title, "\n\n", map().getStartIntro().intro, "\n\n", { translate: "message.greenLine" } ] )
    } )

    /** 如果一个队伍没有分配到人，则设置为无效的队伍 */
    eachTeam( team => { if ( team.getTeamMember().length === 0 ) { team.setTeamInvalid(); }; } );

    /** 移除等待大厅 */
    overworld.runCommand( `fill -12 117 -12 12 127 12 air` );

    /** 激活游戏中事件 */
    eventManager.deleteBeforeGamingEvents();
    eventManager.createGamingEvents();
    if ( map().mode === "capture" ) { eventManager.captureGamingEvents(); }

}
