/** ===== 夺点模式信息板 =====
 * 该文件是基于gaming/infoBoard.js而编写的。在实际使用中，应视情况禁用其中的某些函数，然后启用这里的替代函数。
 */

import { eachValidPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";
import { secondToMinute, tickToSecond, timeString } from "../../methods/time";
import { BedwarsTeam, getTeam } from "../../methods/bedwarsTeam";

/**
 * 夺点模式信息板
 * @description 标题：起床战争（粗体黄字）
 * @description 模式：2队夺点模式 [ID]
 * @description 游戏事件：[事件名] - [倒计时] （如果事件全部结束则不显示）
 * @description 游戏结束倒计时：[游戏结束|xx队胜利] - [倒计时]
 * @description 红蓝队床数：（例）红 ⬢⬢⬡⬡⬢ 蓝 
 * @description 红队状态：（例）红 红队：✔ 1435 -1
 * @description 蓝队状态：（例）蓝 蓝队：✔ 1323 -2
 * @description 击杀数/旁观者提示：（例）击杀数：5 / （例）您现在为旁观者
 */
export function captureInfoBoard() {
    eachValidPlayer( ( player, playerInfo ) => {
        /** 获取游戏结束的事件名：[游戏结束]/[xx队胜利] */
        function winningTeam() {
            let dominantTeam = getTeam( map().getCaptureInfo().dominantTeam );
            if ( !dominantTeam || dominantTeam === "none" ) { return `§f游戏结束` }
            else { return `${dominantTeam.getTeamNameWithColor()}队§f胜利` }
        };
        /** 获取游戏结束的倒计时（如果两队都没有床，则返回∞） */
        function getCountdownString() {
            let countdown = map().getCaptureInfo().gameOverCountdown
            if ( countdown === Infinity || countdown === -Infinity || countdown === NaN ) { return "∞" }
            else { return timeString("ms",secondToMinute(map().getCaptureInfo().gameOverCountdown)) }
        }
        /** @param {BedwarsTeam} team1 @param {BedwarsTeam} team2   */
        function bedAmountIndicator( team1, team2 ) {
            let result = ``;
            let team1BedAmount = team1.captureInfo.bedsPos.length;
            let team2BedAmount = team2.captureInfo.bedsPos.length;
            let emptyBedAmount = 5 - team1BedAmount - team2BedAmount;
            for ( let i = 0; i < team1BedAmount; i++ ) { result += `${team1.getTeamColor()}⬢`; }
            for ( let i = 0; i < emptyBedAmount; i++ ) { result += `§f⬡`; }
            for ( let i = 0; i < team2BedAmount; i++ ) { result += `${team2.getTeamColor()}⬢`; }
            return result;
        }
        /** 队伍状态 @param {BedwarsTeam} team  */
        function teamState( team ) {
            if ( team.captureInfo.bedsPos.length > 0 ) { return "§a✔"; }
            else if ( team.getAliveTeamMember().length > 0 ) { return `§a${team.getAliveTeamMember().length}`; }
            else { return "§c✘"; }
        };
        /** 玩家是否在队伍内 @param {BedwarsTeam} team */
        function playerInTeam( team ) {
            if ( playerInfo.team === team.id ) { return "§7（你）" } else { return "" }
        };

        let team1 = map().teamList[0];
        let team2 = map().teamList[1];

        let title = "§l§e       起床战争§r       "; // 标题
        let mode = `§8${map().teamCount}队${map().modeName()}模式 ${map().gameId}`; // 模式
        let gameEvent = `§f${map().gameEvent.nextEventName} - §a${timeString( "ms", secondToMinute( tickToSecond( map().gameEvent.nextEventCountdown ) ) )}`; // 游戏事件
        let gameOverCountdown = `${winningTeam()} - §a${getCountdownString()}`;
        let bedAmount = `${team1.getTeamNameWithColor()} ${ bedAmountIndicator( team1, team2 ) } ${team2.getTeamNameWithColor()}`;
        let team1State = `${team1.getTeamNameWithColor()} §f${team1.getTeamName()}队：${teamState(team1)} ${playerInTeam(team1)} §f${team1.captureInfo.score} §7-${team1.captureInfo.otherTeamBedAmount}`;
        let team2State = `${team2.getTeamNameWithColor()} §f${team2.getTeamName()}队：${teamState(team2)} ${playerInTeam(team2)} §f${team2.captureInfo.score} §7-${team2.captureInfo.otherTeamBedAmount}`;
        let killInfo = `§f击杀数 ： §a${playerInfo.killCount.kill}`
        let spectator = "§f您当前为旁观者"
        let author = "§e一只卑微的量筒"

        let showGameEvent = () => {
            if ( map().gameEvent.currentId < 4 ) { return `${gameEvent}\n` }
            else { return ``; }
        };
        let spectatorOrKillinfo = () => {
            if ( playerInfo.isSpectator ) { return `\n${spectator}\n`; }
            else if ( map().teamCount <= 4 ) { return `\n${killInfo}\n`; }
            else { return ``; }
        };

        player.onScreenDisplay.setActionBar( `${title}\n${mode}\n\n${showGameEvent()}${gameOverCountdown}\n\n${bedAmount}\n\n${team1State}\n${team2State}\n${spectatorOrKillinfo()}\n${author}` );

    } );

}