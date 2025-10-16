/**
 * ===== 战斗逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 玩家受伤判定；
 * · 玩家死亡判定；
 * · 玩家重生过程判定；
 * · 当玩家掉落后，施加虚空伤害。
 */

import { world } from "@minecraft/server";
import { overworld } from "../../methods/positionManager";
import { map } from "../../methods/bedwarsMaps";
import { BedwarsPlayer, eachValidPlayer } from "../../methods/bedwarsPlayer";
import { entityIsNearby } from "../../methods/playerManager";

/** 令死亡玩家执行的特殊内容
 * @description 薛定谔的玩家（即卡在暂停菜单或聊天栏界面而不能立刻重生的玩家）会导致非常多的问题，此处为对其的专门处理。
 * @description 重新重生：这类玩家重生后会直接出生在世界重生点，即中岛上方。因此，需要重新重生之。
 * @description 卡床问题：床被破坏后会遇到问题，这样玩家始终不重生，床被破坏后可以恶意卡死亡状态导致游戏无法结束。因此，如果玩家在没有床的状态下死亡超过5秒则直接淘汰。
 * @description 新游戏问题：游戏重开后会遇到问题，这样玩家可能持有错误的队伍信息进入下一局。因此如果检测到玩家的游戏ID不一致则直接设置为旁观者。
 */
export function deadPlayer() {

    /** 检测死亡玩家 */
    overworld.runCommand( "function lib/get_data/player_is_alive" );
    /** 令死亡玩家执行： */
    eachValidPlayer( ( player, playerInfo ) => {
        let isDead = !player.hasTag( "isAlive" );
        let nearSpawnpoint = entityIsNearby( player, map().spawnpointPos, 2 );
        /** 如果玩家不处于死亡状态，则重置其死亡状态的时长 */
        if ( !isDead ) { playerInfo.deathState.stayDeadTime = 0; }
        /** 如果玩家在重生点重生时为生存模式，则强制重新使其生成 */
        if ( nearSpawnpoint && player.getGameMode() === "survival" ) {
            playerInfo.spawn();
        };
        /** 如果玩家在床丢失后仍处于死亡状态，则 5 秒后直接淘汰之 */
        if ( isDead && !playerInfo.getBedState() && !playerInfo.deathState.isDeath ) {
            /** 进行计时 */
            playerInfo.deathState.stayDeadTime++;
            /** 警告之 */
            if ( playerInfo.deathState.stayDeadTime % 20 === 0 && playerInfo.deathState.stayDeadTime !== 100 ) {
                player.sendMessage( `§c§l请立即回到游戏！否则你将在${5 - Math.floor(playerInfo.deathState.stayDeadTime/20)}秒后被淘汰！` );
                player.playSound( "mob.cat.meow" )
            }
            if ( playerInfo.deathState.stayDeadTime === 100 ) {
                playerInfo.setPlayerDead();
                player.sendMessage( { translate: "message.eliminated" } );
                world.sendMessage( { translate: "message.kill.died", with: [ player.nameTag ] }, { translate: "message.finalKill" }, );
            }
        };
        /** 如果玩家的游戏 ID 与本局不匹配，则改为旁观者 */
        if ( isDead && playerInfo.gameId !== map().gameId ) {
            new BedwarsPlayer( player.name, undefined );
        };
    } )
}
