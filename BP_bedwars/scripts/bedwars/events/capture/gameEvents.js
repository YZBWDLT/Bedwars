/**
 * ===== 游戏事件（夺点模式） =====
 * 该文件是基于gaming/gameEvents.js而编写的。在实际使用中，应视情况禁用其中的某些函数，然后启用这里的替代函数。
 */

import { system } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps"
import { eachTeam } from "../../methods/bedwarsTeam";
import { setPlayerGamemode } from "../../methods/playerManager";
import { diamondTier2, diamondTier3, emeraldTier2, emeraldTier3 } from "../gaming/gameEvents";
import { gameOver } from "../classic/afterGaming";

/** ===== 主事件 ===== */

/** 夺点模式游戏事件
 * @description 常规游戏事件：游戏将进行倒计时，倒计时结束后将触发特定事件。事件包括：钻石点升级和绿宝石点升级。
 * @description 减分判定：每个队伍每秒减去非自身队伍的床数。例：若为红队和蓝队，其中红队有3张床，蓝队有1张床，则红队每秒-1分，蓝队每秒-3分。
 */
export function gameEventsCapture() {

    /** ===== 常规游戏事件 ===== */
    if ( map().gameEvent.nextEventCountdown > 0 ) {
        map().gameEvent.nextEventCountdown--;
    }
    else {
        /** 按照当前的游戏流程选择性地触发事件 */
        if ( map().gameEvent.currentId === 0 ) { diamondTier2( 4800 ); }
        else if ( map().gameEvent.currentId === 1 ) { emeraldTier2( 4800 ); }
        else if ( map().gameEvent.currentId === 2 ) { diamondTier3( 4800 ); }
        else { emeraldTier3( 99999 ); }
    }

    /** ===== 减分判定 ===== */
    eachTeam( team => {
        if ( system.currentTick % 20 === 0 ) {
            let otherBed = team.getOtherTeamBed(); // 获取其他队伍床的数目
            team.captureInfo.score -= otherBed; // 减分（每秒执行一次）
        }
    } )
}

/** 夺点模式队伍淘汰和胜利的判定
 * @description 队伍淘汰判定（1）：如果该队伍床不存在、没有玩家且先前未被淘汰，则设置为淘汰。
 * @description 队伍淘汰判定（2）：如果该队伍分值小于等于 0 ，则设置为淘汰。
 * @description 队伍胜利判定：如果仅剩一个队伍存活，则该队伍获胜。
 * @description 队伍平局判定：如果两队分值均小于等于 0 ，则设置为平局。
 */
export function teamEliminateAndWinCapture() {
    /** ===== 平局判定 ===== */
    let teamScoreData = [];
    eachTeam( team => teamScoreData.push( team.captureInfo.score ) );
    if ( teamScoreData.every( score => score <= 0 ) ) {
        gameOver( );
        return; // 终止判定，直接定为平局
    }
    /** ===== 淘汰判定 ===== */
    eachTeam( team => { if ( !team.isEliminated ) {
        if ( team.captureInfo.score <= 0 ) {
            team.getTeamMember().forEach( player => { setPlayerGamemode( player, "spectator" ) } );
            team.setTeamEliminated();
        }
        else if ( team.captureInfo.bedsPos.length === 0 && team.getAliveTeamMember().length === 0 ) {
            team.setTeamEliminated();
        }
    } } );
    /** ===== 获胜判定 ===== */
    if ( map().getAliveTeam().length <= 1 ) {
        gameOver( map().getAliveTeam()[0] );
    };
}

/** 默认提供末影龙增益 */
export function supplyDragonBuff() {
    eachTeam( team => {
        if ( !team.teamUpgrade.dragonBuff ) { team.teamUpgrade.dragonBuff = true; }
    } )
}
