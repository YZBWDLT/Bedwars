/**
 * ===== 记分板信息展示 =====
 */

import { world } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps";
import { eachPlayer, getPlayerAmount } from "../../methods/playerManager";
import { secondToMinute, tickToSecond, timeString } from "../../methods/time";
import { eachValidPlayer } from "../../methods/bedwarsPlayer";
import { settings } from "../../methods/bedwarsSettings";
import { BedwarsTeam } from "../../methods/bedwarsTeam";

/** 游戏前信息板 */
export function beforeGamingInfoBoard() {
    if ( map() ) {
        let loadInfo = map().loadInfo;
        if ( loadInfo.isLoading ) {
            if ( loadInfo.mapClear.currentLayer !== 0 ) { waitingInfoBoard( `§f清除原地图中... §7${tickToSecond(loadInfo.mapClear.currentLayer*loadInfo.mapClear.timeCostPerLayer)}秒§r` ); }
            else if ( loadInfo.mapReload.countdown !== 0 ) { waitingInfoBoard( `§f生成地图中... §7${tickToSecond(loadInfo.mapReload.countdown)}秒§r` ); }
            else { waitingInfoBoard( "§f设置队伍岛屿中...§r" ); }
        }
        else {
            if ( getPlayerAmount() >= settings.minWaitingPlayers ) { waitingInfoBoard( `§f即将开始： §a${tickToSecond(map().gameStartCountdown)}秒§r` ); }
            else { waitingInfoBoard( "§f等待中...§r" ); }
        }
    }
}

/** 游戏时信息板 */
export function gamingInfoBoard() {

    eachValidPlayer( ( player, playerInfo ) => {

        /** ===== 预备函数与变量 ===== */

        /** 队伍状态 @param {BedwarsTeam} team */
        let teamState = ( team ) => {
            if ( team.bedInfo.isExist ) { return "§a✔"; }
            else if ( team.getAliveTeamMember().length > 0 ) { return `§a${team.getAliveTeamMember().length}`; }
            else { return "§c✘"; }
        };
        /** 玩家是否在队伍内 @param {BedwarsTeam} team */
        let playerInTeam = ( team ) => {
            if ( playerInfo.team === team.id ) { return "§7（你）" } else { return "" }
        };
        /** 所有队伍的显示列表 */
        let teams = [];

        /** ===== 显示名称 ===== */

        /** 标题 */
        let title = "§l§e       起床战争§r       ";

        /** 模式 | 例：4队经典模式 5899 */
        let mode = `§8${map().teamCount}队${map().modeName()}模式 ${map().gameId}`;

        /** 游戏事件 | 例：钻石生成点 III 级 - 5:07 */
        let gameEvent = `§f${map().gameEvent.nextEventName} - §a${timeString( "ms", secondToMinute( tickToSecond( map().gameEvent.nextEventCountdown ) ) )}`;

        /** 队伍信息 | 例：红 红队： √ （你） */
        for ( let i = 0; i < map().teamCount; i++ ) {
            let team = map().teamList[i]
            teams.push( `${team.getTeamNameWithColor()} §f${team.getTeamName()}队： ${teamState(team)} ${playerInTeam(team)}` )
        }

        /** 击杀信息 */
        let killInfo = `§f击杀数 ： §a${playerInfo.killCount.kill}\n§f最终击杀数 ： §a${playerInfo.killCount.finalKill}\n§f破坏床数 ： §a${playerInfo.killCount.bed}`

        /** 旁观信息 */
        let spectator = "§f您当前为旁观者"

        /** 作者信息 */
        let author = "§e一只卑微的量筒"

        /** ===== 显示 ===== */

        let firstPart = `${title}\n${mode}\n\n${gameEvent}\n\n${teams.join("\n")}\n`;
        let secondPart = () => {
            if ( playerInfo.isSpectator ) { return `\n${spectator}\n`; }
            else if ( map().teamCount <= 4 ) { return `\n${killInfo}\n`; }
            else { return ``; }
        };
        let thirdPart = `\n${author}`;

        player.onScreenDisplay.setActionBar( `${firstPart}${secondPart()}${thirdPart}` );

    } );

}

/** 血量记分板 */
export function healthScoreboard() {

    /** 如果不存在血量记分板，则创建之 */
    if ( !world.scoreboard.getObjective( "health" ) ) {
        world.scoreboard.addObjective( "health", "§c❤" );
    };
    /** 如果玩家名下没有显示血量，则显示之 */
    if ( !world.scoreboard.getObjectiveAtDisplaySlot( "BelowName" ) ) {
        world.scoreboard.setObjectiveAtDisplaySlot( "BelowName", { objective: world.scoreboard.getObjective( "health" ) } );
    };
    /** 设置玩家的血量到记分板上 */
    eachPlayer( player => {
        let health = player.getComponent("health").currentValue;
        player.runCommand( `scoreboard players set @s health ${Math.floor(health)}` )
    } );

}

/** 在等待大厅时展示的信息板
 * @param {String} infoBoardProgress - 当前地图进度
 */
function waitingInfoBoard( infoBoardProgress ) {

    /** 展示内容 */
    let infoBoardTitle = "§l§e     起床战争§r     ";
    let infoBoardMapName = `§f地图： §a${map().name}§r`;
    let infoBoardWaitingPlayer = `§f玩家： §a${getPlayerAmount()}/16§r`;
    let infoBoardTeamCount = `§f队伍数： §a${map().teamCount}§r`;
    let infoBoardMode = `§f模式： §a${map().modeName()}§r`;
    let infoBoardAuthor = `§e一只卑微的量筒§r`
    eachPlayer( player => { player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n§8${map().gameId}\n\n${infoBoardMapName}\n${infoBoardWaitingPlayer}\n\n${infoBoardProgress}\n\n${infoBoardTeamCount}\n${infoBoardMode}\n\n${infoBoardAuthor}` ) } )
    
}

