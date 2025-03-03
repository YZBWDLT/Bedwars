/**
 * ===== 玩家退出重进检测 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 当玩家退出游戏后，备份数据；
 * · 当玩家回到游戏后，从备份的数据中恢复数据。
 */

import { Player, PlayerLeaveBeforeEvent, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps";
import { BedwarsPlayer, getPlayerBedwarsInfo, initPlayer, playerIsValid } from "../../methods/bedwarsPlayer";
import { overworld } from "../../methods/positionManager";
import { getKeyByValue } from "../../methods/number";

/** 队伍的数字 ID */
const teamCode = { "red": 1, "blue": 2, "yellow": 3, "green": 4, "white": 5, "cyan": 6, "pink": 7, "gray": 8, "orange": 9, "brown": 10, "purple": 11, "undefined": 12 }

/** 玩家退出游戏
 * @param {PlayerLeaveBeforeEvent} event 
 */
export function playerLeave( event ) {
    let player = event.player;
    /** 当未处于等待期间时，尝试备份玩家数据 */
    if ( playerIsValid( player ) && map().gameStage >= 1 ) {
        dataBackup( player, getPlayerBedwarsInfo( player ) );
    };
}

/** 玩家重进游戏
 * @param {PlayerSpawnAfterEvent} event 
 */
export function playerRejoin( event ) {
    
    /** 确保重生的玩家是退出重进的玩家 */
    if ( event.initialSpawn ) {

        /** 如果是游戏前，则初始化该玩家 */
        if ( map().gameStage === 0 ) {
            initPlayer( event.player );
        }
        /** 否则，开始恢复数据 */
        else {
            dataRecover( event.player )
        }

    }

}

/** 将玩家的数据备份在一个同名的记分板中
 * @param {Player} player 待备份数据的玩家
 * @param {BedwarsPlayer} playerInfo 玩家的起床战争信息
 */
function dataBackup( player, playerInfo ) {

    /** 玩家名称 */
    let playerName = player.name;

    /** 为防止 beforeEvents 出现问题，延迟执行 */
    system.run( () => {

        /** 创建记分板 | 这里用命令是因为就算真出错了也不会直接杀掉进程 */
        overworld.runCommand( `scoreboard objectives add "${playerName}" dummy` );

        /** 备份队伍信息 */
        overworld.runCommand( `scoreboard players set team "${playerName}" ${teamCode[playerInfo.team]}` );

        /** 备份装备信息 */
        overworld.runCommand( `scoreboard players set axeTier "${playerName}" ${playerInfo.equipment.axe}` );
        overworld.runCommand( `scoreboard players set pickaxeTier "${playerName}" ${playerInfo.equipment.pickaxe}` );
        overworld.runCommand( `scoreboard players set shearsTier "${playerName}" ${playerInfo.equipment.shears}` );
        overworld.runCommand( `scoreboard players set armorTier "${playerName}" ${playerInfo.equipment.armor}` );

        /** 备份击杀数信息 */
        overworld.runCommand( `scoreboard players set killCount "${playerName}" ${playerInfo.killCount.kill}` );
        overworld.runCommand( `scoreboard players set finalKillCount "${playerName}" ${playerInfo.killCount.finalKill}` );
        overworld.runCommand( `scoreboard players set bedDestroyed "${playerName}" ${playerInfo.killCount.bed}` );

        /** 备份游戏 ID 数据 */
        overworld.runCommand( `scoreboard players set gameId "${playerName}" ${playerInfo.gameId}` );
        
    } )

}

/** 恢复玩家的起床战争数据
 * @param {Player} player 
 */
function dataRecover( player ) {

    /** ===== 获取相关数据 ===== */
    /** 玩家数据 */ let playerData = world.scoreboard.getObjective( player.name );
    
    /** 如果存在数据，玩家的运行时 ID 与本局的 ID 相同，并且先前的队伍不为无效队伍，则开始尝试恢复数据，并且则进行下一步 */
    if ( playerData && playerData.getScore( "gameId" ) === map().gameId && playerData.getScore( "team" ) !== 12 ) {

        /** 初始化信息 */
        let playerInfo = new BedwarsPlayer( player.name, getKeyByValue( teamCode, playerData.getScore( "team" ) ) );
        /** 还原数据 */
        playerInfo.equipment.axe = playerData.getScore( "axeTier" );
        playerInfo.equipment.pickaxe = playerData.getScore( "pickaxeTier" );
        playerInfo.equipment.shears = playerData.getScore( "shearsTier" );
        playerInfo.equipment.armor = playerData.getScore( "armorTier" );
        playerInfo.killCount.kill = playerData.getScore( "killCount" );
        playerInfo.killCount.finalKill = playerData.getScore( "finalKillCount" );
        playerInfo.killCount.bed = playerData.getScore( "bedDestroyed" );
        /** 移除备份数据的记分板 */
        world.scoreboard.removeObjective( playerData );
        /** 杀死该玩家，然后设置更长时间的重生时间 */
        playerInfo.deathState.isRejoinedPlayer = true;
        player.kill();
        /** 播报消息 */
        if ( playerInfo.getBedState() ) {
            player.sendMessage( { translate: "message.playerRejoin.haveBed" } );
        }
        else {
            player.sendMessage( { translate: "message.playerRejoin.haveNoBed" } );
        }
    }
    /** 否则，直接改为旁观者 */
    else {
        new BedwarsPlayer( player.name, undefined );
        try { world.scoreboard.removeObjective( playerData ); } catch (error) {};
    }
}
