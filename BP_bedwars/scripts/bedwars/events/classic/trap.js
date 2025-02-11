/**
 * ===== 陷阱 =====
 * 控制陷阱的冷却倒计时和运行。
 * 冷却机制：当陷阱启用后，进入倒计时状态，倒计时结束后重新进入检测状态。
 * 触发机制：当未处于冷却状态下，并且有敌方玩家接近己方的床时，触发第一个陷阱
 */

import { Player, system, world } from "@minecraft/server";
import { eachTeam } from "../../methods/bedwarsTeam";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { replaceInventoryItem } from "../../methods/itemManager";
import { eachNearbyPlayer, entityIsNearby, getPlayerNearby, showTitle } from "../../methods/playerManager";
import { eachAlivePlayer, getPlayerBedwarsInfo, playerIsAlive, warnPlayer } from "../../methods/bedwarsPlayer";
import { Vector } from "../../methods/positionManager";

/** 陷阱机制控制函数 */
export function trap() {

    /** 在玩家物品栏中显示陷阱 */
    eachAlivePlayer( ( player, playerInfo ) => showTrapsInInventory( player, playerInfo.getTeam() ) )

    /** 陷阱触发与警报 */
    eachTeam( team => {

        /** 获取队伍玩家和敌队玩家信息 */
        let enemy = getEnemyNearby( team.bedInfo.pos, 10, team );
        let teamMember = team.getTeamMember();

        /** 如果陷阱处于冷却阶段，则进行冷却倒计时，阻止陷阱的触发 */
        if ( team.trapInfo.cooldownEnabled ) { trapCooldown( team ); }
        /** 不处于冷却阶段时，则在存在敌人且陷阱已购买的情况下，触发第一个陷阱 */
        else if ( enemy && team.teamUpgrade.trap1Type !== "" && !team.trapInfo.cooldownEnabled ) {
            
            /** 陷阱的触发 */
            let trap1 = team.teamUpgrade.trap1Type;
            if ( trap1 === "its_a_trap" ) { itsATrap( teamMember, enemy ) }
            else if ( trap1 === "alarm_trap" ) { alarmTrap( teamMember, enemy, team ) }
            else if ( trap1 === "counter_offensive_trap" ) { counterAndOffensiveTrap( teamMember, team ) }
            else { minerFatigueTrap( teamMember, enemy ) };

            /** 陷阱的顺延 */
            trapPostponeAndStartCountdown( team );

        };

        /** 警报陷阱的警报 */
        if ( team.trapInfo.isAlarming && system.currentTick % 2 === 0 ) { alarming( team ) };

    } )

}

/** 控制陷阱倒计时
 * @param {BedwarsTeam} team 队伍信息
 */
function trapCooldown( team ) {

    team.trapInfo.cooldown--;
    if ( team.trapInfo.cooldown <= 0 ) {
        team.trapInfo.cooldownEnabled = false;
        team.trapInfo.cooldown = 600;
    }

}

/** 陷阱顺延与启用倒计时
 * @param {BedwarsTeam} team 顺延陷阱的队伍
 */
function trapPostponeAndStartCountdown( team ) {

    /** 将 2、3 号位向前顺延一位 */
    team.teamUpgrade.trap1Type = team.teamUpgrade.trap2Type;
    team.teamUpgrade.trap2Type = team.teamUpgrade.trap3Type;
    team.teamUpgrade.trap3Type = "";

    /** 启用陷阱倒计时 */
    team.trapInfo.cooldownEnabled = true;
    team.trapInfo.cooldown = 600;

}

/** 触发陷阱 “这是个陷阱！”
 * @param {Player[]} teamMember 触发陷阱队伍的队伍成员
 * @param {Player} enemy 触发陷阱队伍的敌人
 */
function itsATrap( teamMember, enemy ) {

    /** 报警信息 */
    trapTriggeredMessage( teamMember, "its_a_trap" );

    /** 对敌人施加 debuff */
    enemy.addEffect( "blindness", 160 );
    enemy.addEffect( "slowness", 160 );

}

/** 触发陷阱 “警报陷阱”
 * @param {Player[]} teamMember 触发陷阱队伍的队伍成员
 * @param {Player} enemy 触发陷阱队伍的敌人
 * @param {BedwarsTeam} team 触发陷阱的队伍
 */
function alarmTrap( teamMember, enemy, team ) {

    /** 报警信息 */
    teamMember.forEach( player => {
        showTitle( player, { translate: "title.trapTriggered.alarmTrap" }, { translate: "subtitle.trapTriggered.alarmTrap", with: [ `${enemy.bedwarsInfo.getTeam().getTeamNameWithColor()}`, `${enemy.nameTag}` ] } )
        warnPlayer( player, { translate: "message.trapTriggered.alarmTrap", with: [ `${enemy.bedwarsInfo.getTeam().getTeamNameWithColor()}`, `${enemy.nameTag}` ] } )    
    } );

    /** 移除敌人的隐身效果 */
    enemy.removeEffect( "invisibility" )

    /** 将队伍的报警信息打开 */
    team.trapInfo.isAlarming = true;
    team.trapInfo.alarmedTimes = 0;

}

/** 触发陷阱 “反击陷阱”
 * @param {Player[]} teamMember 触发陷阱队伍的队伍成员
 * @param {BedwarsTeam} team 触发陷阱的队伍
 */
function counterAndOffensiveTrap( teamMember, team ) {

    /** 报警信息 */
    trapTriggeredMessage( teamMember, "counter_offensive_trap" );

    /** 对在床附近的玩家施加buff */
    teamMember.filter( player => entityIsNearby( player, team.bedInfo.pos, 10 ) ).forEach( player => {
        player.addEffect( "jump_boost", 300, { amplifier: 1 } );
        player.addEffect( "speed", 300, { amplifier: 1 } );
    } );

}

/** 触发陷阱 “这是个陷阱！”
 * @param {Player[]} teamMember 触发陷阱队伍的队伍成员
 * @param {Player} enemy 触发陷阱队伍的敌人
 */
function minerFatigueTrap( teamMember, enemy ) {

    /** 报警信息 */
    trapTriggeredMessage( teamMember, "miner_fatigue_trap" );

    /** 对敌人施加 debuff */
    enemy.addEffect( "mining_fatigue", 200 );

}

/** 警报
 * @param {BedwarsTeam} team 警报的队伍信息
 */
function alarming( team ) {

    /** 对床边的所有玩家予以警报 */
    let bedPos = team.bedInfo.pos;
    eachNearbyPlayer( bedPos, 10, player => { alarmSound( player, bedPos, team.trapInfo.alarmedTimes ) } );
    team.getTeamMember().forEach( player => { alarmSound( player, player.location, team.trapInfo.alarmedTimes ) } )

    /** 增加警报次数，当超过 56 次后则停止警报 */
    team.trapInfo.alarmedTimes++;
    if ( team.trapInfo.alarmedTimes >= 56 ) {
        team.trapInfo.isAlarming = false;
        team.trapInfo.alarmedTimes = 0;
    };

}

/** 在玩家物品栏里显示陷阱信息
 * @param {Player} player 玩家
 * @param {BedwarsTeam} team 玩家对应的队伍信息
*/
function showTrapsInInventory( player, team ) {

    /** 获取陷阱列表信息 */
    let traps = [ team.teamUpgrade.trap1Type, team.teamUpgrade.trap2Type, team.teamUpgrade.trap3Type ];

    /** 获取陷阱名称 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType 陷阱类型 */
    let trapName = ( trapQueueType ) => { switch ( trapQueueType ) {
        case "": return "无陷阱！";
        case "its_a_trap": return "这是个陷阱！";
        case "counter_offensive_trap": return "反击陷阱";
        case "alarm_trap": return "报警陷阱";
        case "miner_fatigue_trap": return "挖掘疲劳陷阱";
    } };

    /** 获取陷阱颜色 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType 陷阱类型 */
    let trapColor = ( trapQueueType ) => {
        return trapQueueType === "" ? "§r§c" : "§r§a";
    };
    
    /** 获取下个陷阱要消耗的钻石数 */
    let nextTrapNeedsDiamond = () => {
        if ( traps[0] === "" ) { return "§b1 钻石"; }
        else if ( traps[1] === "" ) { return "§b2 钻石"; }
        else if ( traps[2] === "" ) { return "§b4 钻石"; }
        else { return "§c陷阱队列已满！"; }
    };
    
    /** 获取陷阱的代表物品 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType 陷阱类型 */
    let trapItem = ( trapQueueType ) => { switch ( trapQueueType ) {
        case "": return "minecraft:light_gray_stained_glass";
        case "its_a_trap": return "minecraft:tripwire_hook";
        case "counter_offensive_trap": return "minecraft:feather";
        case "alarm_trap": return "minecraft:redstone_torch";
        case "miner_fatigue_trap": return "minecraft:iron_pickaxe";
    } };
    
    /** 在玩家物品栏放置物品 */
    for ( let i = 0; i < 3; i++ ) {
        replaceInventoryItem( player, trapItem( traps[i] ), 15+i, { name: `${trapColor( traps[i] )}陷阱 #${i+1} ： ${trapName( traps[i] )}`, lore: [ `§r§7第${i+1}个敌人进入你的基地时将触发此陷阱！`, "", "§r§7购买的陷阱将在此排队触发。\n陷阱的价格将随着队列中陷阱的数量而增加。", "", `§r§7下个陷阱： ${nextTrapNeedsDiamond()}` ], itemLock: "slot" } )
    };
    
}

/** ===== 方法 ===== */

/** 返回在某位置附近的一个敌人
 * @param {Vector} pos 位置
 * @param {Number} range 相对该位置的检测范围
 * @param {BedwarsTeam} team 检测相对何队来说的敌人
 */
function getEnemyNearby( pos, range, team ) {

    return getPlayerNearby( pos, range ).filter( player => playerIsAlive( player ) && getPlayerBedwarsInfo( player ).team !== team.id && !getPlayerBedwarsInfo( player ).magicMilk.enabled )[0]

}

/** 陷阱触发警告（警报陷阱除外）
 * @param {Player[]} players 待显示警报的玩家
 * @param {"its_a_trap"|"counter_offensive_trap"|"alarm_trap"|"miner_fatigue_trap"} trapType 陷阱类型
 */
function trapTriggeredMessage( players, trapType ) {

    players.forEach( player => {

        showTitle( player, { translate: "title.trapTriggered" }, { translate: "subtitle.trapTriggered", with: { rawtext: [ { translate: `message.bedwars:upgrade_${trapType}` } ] } } )
        warnPlayer( player, { translate: "message.trapTriggered", with: { rawtext: [ { translate: `message.bedwars:upgrade_${trapType}` } ] } } )    
    
    } )

}

/** 警报音效
 * @param {Player} player 警报的玩家
 * @param {Vector} pos 警报的位置
 * @param {Number} alarmedTimes 已警报的次数
 */
function alarmSound( player, pos, alarmedTimes ) {
    player.playSound( "note.pling", { pitch: 1.5 + 0.2 * ( alarmedTimes % 2 ), location: pos } )
}
