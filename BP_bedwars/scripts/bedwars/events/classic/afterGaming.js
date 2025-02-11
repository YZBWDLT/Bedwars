/**
 * ===== 游戏后 =====
 * 即游戏结束后运行的内容。
 * 游戏结束后，会进行倒计时。
 * 倒计时结束后，重新开启下一局。
 */

import { map, regenerateMap } from "../../methods/bedwarsMaps";
import { eachPlayer, showTitle } from "../../methods/playerManager";
import { overworld } from "../../methods/positionManager";
import { getValidPlayers, eachValidPlayer, getPlayerBedwarsInfo } from "../../methods/bedwarsPlayer";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { world } from "@minecraft/server";

/** 游戏结束事件
 * @param {BedwarsTeam|undefined} winningTeam - 获胜队伍，如若为undefined则为平局结束
 */
export function gameOver( winningTeam ) {
    /** ===== 设置游戏结束 ===== */
    map().gameOver();
    /** ===== 判断何队获胜 ===== */
    /** 平局结束 */
    if ( !winningTeam ) {
        /** 通报消息 */
        eachPlayer( player => {
            showTitle( player, { translate: "title.gameOver" } );
            player.sendMessage( { translate: "message.gameOver.endInATie" } );
        } )
        
    }
    /** 某队获胜 */
    else {
        eachValidPlayer( ( player, playerInfo ) => {
            /** 分别为获胜队伍和未获胜队伍展示标题 */
            if ( playerInfo.team === winningTeam.id ) {
                showTitle( player, { translate: "title.victory" } );
            }
            else {
                showTitle( player, { translate: "title.gameOver" } );
            }
        } )
        /** 通报获胜队伍 <lang> */
        world.sendMessage( [ { translate: "message.greenLine" }, "\n§l§f      起床战争§r      ", "\n", `\n${winningTeam.getTeamNameWithColor()}队§7 - ${getWinningPlayers(winningTeam)}`, "\n\n", killCountRank().join( "\n" ), "\n\n", { translate: "message.greenLine" } ] )
    }
}

/** 游戏结束倒计时 */
export function gameOverCountdown() {
    
    map().nextGameCountdown--;
    if ( map().nextGameCountdown === 0 ) {
        regenerateMap();
    };

    /** 如果玩家跌入虚空，就传送上来 */
    eachPlayer( player => {
        if ( player.runCommand(`execute if entity @s[x=~,y=0,z=~,dx=0,dy=-60,dz=0]`).successCount === 1 ) {
            player.teleport( map().spawnpointPos );
        }
    } )

}

/** ===== 方法 ===== */

/** 获取获胜玩家字符串
 * @param {BedwarsTeam} winningTeam - 获胜队伍，如若为undefined则为平局结束
 */
function getWinningPlayers( winningTeam ) {
    let winnersName = [];
    winningTeam.getTeamMember().forEach( winner => { winnersName.push( winner.name ) } );
    return winnersName.join( ", " )
}

/** 获取击杀排名信息 */
function killCountRank() {

    /** ===== 变量初始化 ===== */

    /** 排名列表 @type { { name: String, totalKillCount: Number }[] } */ let rank = [];
    /** 第一名 */ let theFirst = "";
    /** 第二名 */ let theSecond = ``;
    /** 第三名 */ let theThird = ``;

    /** ===== 按照击杀数进行排名 ===== */
    
    getValidPlayers().forEach( player => {
        let playerInfo = getPlayerBedwarsInfo( player );
        rank.push( { name: player.name, totalKillCount: playerInfo.killCount.kill + playerInfo.killCount.finalKill } );
    } );
    rank.sort( ( a, b ) => b.totalKillCount - a.totalKillCount );

    theFirst = `§e§l击杀数第一名§r§7 - ${rank[0].name} - ${rank[0].totalKillCount}`;
    if ( rank[1] ) { theSecond = `§6§l击杀数第二名§r§7 - ${rank[1].name} - ${rank[1].totalKillCount}`; }
    if ( rank[2] ) { theThird = `§c§l击杀数第三名§r§7 - ${rank[2].name} - ${rank[2].totalKillCount}`; }

    return [ theFirst, theSecond, theThird ];
    
}
