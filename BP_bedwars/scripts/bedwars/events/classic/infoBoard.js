/**
 * ===== 信息板逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 展示游戏前的信息板；
 * · 展示游戏时的信息板；
 * · 显示玩家的血量信息。
 */

import { world } from "@minecraft/server";
import { eachPlayer } from "../../methods/playerManager";

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
