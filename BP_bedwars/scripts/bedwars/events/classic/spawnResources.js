/**
 * ===== 玩家与方块交互逻辑 =====
 * 【经典模式】
 * 本文件主要用于：
 * · 队伍资源生成：生成铁和金，如果拥有特定团队升级的玩家可以生成绿宝石，以及加快生成速度。
 * · 世界资源生成：生成钻石和绿宝石，在特定的事件执行后可以加快生成速度。同时，显示资源点信息。
 */

import { Player } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps";
import { eachTeam } from "../../methods/bedwarsTeam";
import { eachNearbyPlayer, getPlayerNearby } from "../../methods/playerManager";
import { settings } from "../../methods/bedwarsSettings";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { spawnItem } from "../../methods/itemManager";
import { overworld, positionManager, Vector } from "../../methods/positionManager";
import { intToRoman, randomInt } from "../../methods/number";
import { tickToSecond } from "../../methods/time";
import { playerIsAlive } from "../../methods/bedwarsPlayer";

/** 资源生成函数 */
export function spawnResources() {

    /** 队伍资源生成 | 只要无效队伍允许生成资源，或者队伍有效，就允许该队伍生成资源 */
    eachTeam( team => { if ( settings.gaming.invalidTeam.spawnResources || team.isValid ) { teamResources( team ); } } );

    /** 世界资源生成 */
    mapResources( );

}

/** 队伍资源生成
 * @description 负责生成队伍内的资源
 * @param {BedwarsTeam} team 生成资源的队伍
 */
function teamResources( team ) {

    /** ===== 基本信息 ===== */
    let nearbyPlayers = getPlayerNearby( team.spawnerInfo.spawnerPos, 2.5 );

    /** ===== 倒计时 ===== */
    team.spawnerInfo.ironCountdown--;
    team.spawnerInfo.goldCountdown--;
    team.spawnerInfo.emeraldCountdown--;

    /** ===== 倒计时结束后，生成资源并重新设定倒计时 ===== */

    /** 铁 */
    if ( team.spawnerInfo.ironCountdown <= 0 ) {

        /** 铁生成 | 最大生成次数必须小于等于最大次数才能生成，按规定的生成次数循环生成铁 */
        if ( team.spawnerInfo.ironSpawned < settings.gaming.resourceLimit.iron * getForgeBonus( team.teamUpgrade.forge ) ) {
            for ( let i = 0; i < map().spawnerInfo.ironSpawnTimes; i++ ) { spawnIron( team, nearbyPlayers ); };
        }

        /** 铁倒计时 | 时间：单个铁的间隔*生成铁的数目/速度加成 */
        team.spawnerInfo.ironCountdown = Math.floor( settings.gaming.resourceInterval.iron * map().spawnerInfo.ironSpawnTimes / ( map().isSolo() ? settings.gaming.resourceInterval.soloSpeedMultiplier / 10 : 1.0 ) / getForgeBonus( team.teamUpgrade.forge ) );

    };
    
    /** 金 */
    if ( team.spawnerInfo.goldCountdown <= 0 ) {

        /** 金生成 | 最大生成次数必须小于等于最大次数才能生成 */
        if ( team.spawnerInfo.goldSpawned < settings.gaming.resourceLimit.gold * getForgeBonus( team.teamUpgrade.forge ) ) {
            spawnGold( team, nearbyPlayers );
        }

        /** 金倒计时 | 时间：金间隔/速度加成 */
        team.spawnerInfo.goldCountdown = Math.floor( settings.gaming.resourceInterval.gold / ( map().isSolo() ? settings.gaming.resourceInterval.soloSpeedMultiplier / 10 : 1.0 ) / getForgeBonus( team.teamUpgrade.forge ) );

    };
    
    /** 绿宝石 */
    if ( team.spawnerInfo.emeraldCountdown <= 0 ) {

        /** 绿宝石生成 | 最大生成次数必须小于等于最大次数，并且必须解锁绿宝石锻炉后才能生成 */
        if ( team.spawnerInfo.emeraldSpawned < settings.gaming.resourceLimit.emerald && team.teamUpgrade.forge >= 3 ) {
            spawnEmeraldTeam( team, nearbyPlayers );
        }

        /** 绿宝石倒计时 | 时间：绿宝石间隔（无加成） */
        team.spawnerInfo.emeraldCountdown = settings.gaming.resourceInterval.emerald;

    };

    /** ===== 如果生成点附近有玩家，则清除生成次数 ===== */
    if ( nearbyPlayers.length !== 0 ) {
        team.spawnerInfo.emeraldSpawned = 0;
        team.spawnerInfo.goldSpawned = 0;
        team.spawnerInfo.ironSpawned = 0;
    };

}

/** 地图资源生成 */
function mapResources() {

    /** ===== 钻石点 ===== */

    /** 倒计时 */
    map().spawnerInfo.diamondCountdown--;

    /** 生成资源，更新动画，清除生成次数 */
    map().spawnerInfo.diamondInfo.forEach( diamondSpawner => {

        /** ===== 倒计时完成后，生成资源 | 最大生成次数必须小于等于最大次数才能生成 */
        if ( map().spawnerInfo.diamondCountdown <= 0 ) {
            if ( diamondSpawner.spawned < settings.gaming.resourceLimit.diamond ) { spawnDiamond( diamondSpawner ); };
        };

        /** ===== 资源点实体动画与悬浮文本更新 ===== */
        let text1 = `§e等级 §c${intToRoman(map().spawnerInfo.diamondLevel)}`;
        let text2 = `§b§l钻石`;
        let text3 = `§e在 §c${tickToSecond(map().spawnerInfo.diamondCountdown)} §e秒后产出`;
        updateAnimationEntityAndTextDisplay( diamondSpawner.pos, "diamond", text1, text2, text3 );

        /** ===== 如果生成点附近有玩家，则清除生成次数 ===== */
        eachNearbyPlayer( diamondSpawner.pos, 2.5, () => { diamondSpawner.spawned = 0; } );

    } );

    /** 重置倒计时 */
    if ( map().spawnerInfo.diamondCountdown <= 0 ) {
        map().spawnerInfo.diamondCountdown = settings.gaming.resourceInterval.diamond - 10 * 20 * map().spawnerInfo.diamondLevel;
    }

    /** ===== 绿宝石点 ===== */
    map().spawnerInfo.emeraldCountdown--;
    map().spawnerInfo.emeraldInfo.forEach( emeraldSpawner => {

        /** ===== 倒计时完成后，生成资源 ===== */
        if ( map().spawnerInfo.emeraldCountdown <= 0 ) {
            if ( emeraldSpawner.spawned < settings.gaming.resourceLimit.emerald ) { spawnEmerald( emeraldSpawner ); };
        };

        /** ===== 资源点实体动画与悬浮文本更新 ===== */
        let text1 = `§e等级 §c${intToRoman(map().spawnerInfo.emeraldLevel)}`;
        let text2 = `§2§l绿宝石`;
        let text3 = `§e在 §c${tickToSecond(map().spawnerInfo.emeraldCountdown)} §e秒后产出`;
        updateAnimationEntityAndTextDisplay( emeraldSpawner.pos, "emerald", text1, text2, text3 );

        /** ===== 如果生成点附近有玩家，则清除生成次数 ===== */
        eachNearbyPlayer( emeraldSpawner.pos, 2.5, () => { emeraldSpawner.spawned = 0; } );

    } )
    /** 重置倒计时 */
    if ( map().spawnerInfo.emeraldCountdown <= 0 ) {
        map().spawnerInfo.emeraldCountdown = settings.gaming.resourceInterval.emerald - 10 * 20 * map().spawnerInfo.emeraldLevel;
    }

}

/** ===== 资源生成 ===== */

/** 在某个队伍生成铁，并记录生成次数
 * @param {BedwarsTeam} team 生成铁的队伍
 * @param {Player[]} nearbyPlayers 生成点附近的玩家
 */
function spawnIron( team, nearbyPlayers ) {

    /** 生成资源 */
    spawnTeamResource( team, nearbyPlayers,
        player => {
            /** 玩家附近4格是否有商人 */
            let haveTraderNearby = player.runCommand( "execute if entity @e[r=4,type=bedwars:trader]" ).successCount === 1;
            if ( haveTraderNearby ) { player.runCommand( `give @s bedwars:iron_ingot 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` ); } else { player.runCommand( `give @s bedwars:iron_ingot` ); }
        },
        pos => { spawnItem( pos, "bedwars:iron_ingot", { clearVelocity: map().spawnerInfo.clearResourceVelocity } ) }
    );

    /** 记录生成次数 */
    team.spawnerInfo.ironSpawned++;

}

/** 在某个队伍生成金，并记录生成次数
 * @param {BedwarsTeam} team 生成金的队伍
 * @param {Player[]} nearbyPlayers 生成点附近的玩家
 */
function spawnGold( team, nearbyPlayers ) {

    /** 生成资源 */
    spawnTeamResource( team, nearbyPlayers,
        player => {
            /** 玩家附近4格是否有商人 */
            let haveTraderNearby = player.runCommand( "execute if entity @e[r=4,type=bedwars:trader]" ).successCount === 1;
            if ( haveTraderNearby ) { player.runCommand( `give @s bedwars:gold_ingot 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` ); } else { player.runCommand( `give @s bedwars:gold_ingot` ); }
        },
        pos => { spawnItem( pos, "bedwars:gold_ingot", { clearVelocity: map().spawnerInfo.clearResourceVelocity } ) }
    );

    /** 记录生成次数 */
    team.spawnerInfo.goldSpawned++;

}

/** 在某个队伍生成绿宝石，并记录生成次数
 * @param {BedwarsTeam} team 生成绿宝石的队伍
 * @param {Player[]} nearbyPlayers 生成点附近的玩家
 */
function spawnEmeraldTeam( team, nearbyPlayers ) {

    /** 生成资源 */
    spawnTeamResource( team, nearbyPlayers,
        player => {
            /** 玩家附近4格是否有商人 */
            let haveTraderNearby = player.runCommand( "execute if entity @e[r=4,type=bedwars:trader]" ).successCount === 1;
            if ( haveTraderNearby ) { player.runCommand( `give @s bedwars:emerald 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` ); } else { player.runCommand( `give @s bedwars:emerald` ); }
        },
        pos => { spawnItem( pos, "bedwars:emerald", { clearVelocity: map().spawnerInfo.clearResourceVelocity } ) }
    );
    
    /** 记录生成次数 */
    team.spawnerInfo.emeraldSpawned++;
    
}

/** 生成钻石
 * @param {{pos: Vector, spawned: Number}} diamondSpawner 钻石生成点信息
 */
function spawnDiamond( diamondSpawner ) {

    /** 生成资源 */
    spawnItem( diamondSpawner.pos, "bedwars:diamond", { clearVelocity: map().spawnerInfo.clearResourceVelocity } );

    /** 记录生成次数 */
    diamondSpawner.spawned++;

}

/** 生成绿宝石
 * @param {{pos: Vector, spawned: Number}} emeraldSpawner 生成点信息
 */
function spawnEmerald( emeraldSpawner ) {

    /** 生成资源 */
    spawnItem( emeraldSpawner.pos, "bedwars:emerald", { clearVelocity: map().spawnerInfo.clearResourceVelocity } );

    /** 记录生成次数 */
    emeraldSpawner.spawned++;

}

/** ===== 方法 ===== */

/** 获取锻炉加成
 * 等级  0  1     2     3     4
 * 加成  0  +50%  +100% +100% +200%
 * @param {0|1|2|3|4} tier 
 */
function getForgeBonus( tier ) {
    if ( tier === 0 ) { return 1; }
    else if ( tier === 1 ) { return 1.5 }
    else if ( tier === 2 ) { return 2 }
    else if ( tier === 3 ) { return 2 }
    else { return 3 };
}

/** 在某个队伍生成资源
 * @param {BedwarsTeam} team 生成资源的队伍
 * @param {Player[]} nearbyPlayers 生成点附近的玩家
 * @param {function(Player)} playerNearbyFunc 如果生成点附近有存活的玩家，则该玩家执行的函数
 * @param {function(Vector)} nonPlayerNearbyFunc 如果生成点附近没有玩家时执行的函数，若启用了分散式生成则参数位置为生成点附近的位置，若未启用分散式生成则参数位置为生成点位置
 */
function spawnTeamResource( team, nearbyPlayers, playerNearbyFunc, nonPlayerNearbyFunc ) {

    /** 如果生成点附近有玩家，并且为存活的玩家，则直接给予玩家物品 */
    let nearbyAlivePlayers = nearbyPlayers.filter( player => playerIsAlive( player ) );
    if ( nearbyAlivePlayers.length !== 0 ) {
        nearbyAlivePlayers.forEach( player => { playerNearbyFunc( player ) } );
    }

    /** 否则，生成掉落物（以 3*3 分散式生成） */
    else if ( map().spawnerInfo.distributeResource ) {
        let pos = positionManager.copy( team.spawnerInfo.spawnerPos )
        pos = positionManager.add( pos, randomInt( -1, 1 ), 0, randomInt( -1, 1 ) );
        nonPlayerNearbyFunc( pos );
    }

    /** 否则，生成掉落物（在原位生成） */
    else {
        nonPlayerNearbyFunc( team.spawnerInfo.spawnerPos );
    }

}

/** 获取特定位置附近的实体，如果实体不存在则生成
 * @param {String} entityId 实体 ID
 * @param {Vector} pos 检测位置
 */
function tryGetEntity( entityId, pos ) {
    let entity = overworld.getEntities( { type: entityId, location: pos, maxDistance: 0.2 } )[0];
    if ( !entity ) { entity = overworld.spawnEntity( entityId, pos ); };
    return entity;
}

/** 更新生成点附近的动画实体和文本展示实体的信息，如果实体不存在则重新生成
 * @param {Vector} spawnerPos 生成点位置
 * @param {"diamond"|"emerald"} resourceType 生成点类型
 * @param {String} text1 第一行文本
 * @param {String} text2 第二行文本
 * @param {String} text3 第三行文本
 */
function updateAnimationEntityAndTextDisplay( spawnerPos, resourceType, text1, text2, text3 ) {

    /** 获取动画实体和文本展示实体 */
    tryGetEntity( `bedwars:${resourceType}_spawner`, positionManager.add( spawnerPos, 0, -1 ) );
    let textLine1 = tryGetEntity( `bedwars:text_display`, positionManager.add( spawnerPos, 0, 3.5 ) );
    let textLine2 = tryGetEntity( `bedwars:text_display`, positionManager.add( spawnerPos, 0, 3.0 ) );
    let textLine3 = tryGetEntity( `bedwars:text_display`, positionManager.add( spawnerPos, 0, 2.5 ) );

    /** 更新文本展示实体的文本 */
    textLine1.nameTag = text1;
    textLine2.nameTag = text2;
    textLine3.nameTag = text3;

}
