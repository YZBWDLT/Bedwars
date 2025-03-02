/**
 * ===== 玩家与方块交互逻辑 =====
 * 【经典模式】
 * 本文件主要用于：
 * · 阻止玩家开启别队的箱子；
 * · 阻止玩家开启不应开启的 UI；
 * · 阻止玩家在资源点或队伍岛屿内放置方块；
 * · 阻止玩家在高度上限、下限处放置方块。
 */

import { PlayerInteractWithBlockBeforeEvent, system } from "@minecraft/server";
import { getPlayerBedwarsInfo, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";
import { positionManager } from "../../methods/positionManager";

/** 玩家尝试在最高高度上使用物品时，阻止之
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 */
export function maxHeightLimit( event ) {

    /** 交互的玩家 */ const player = event.player;
    /** 正在使用的方块 */ const block = event.block;
    /** 正在使用的面 */ const blockFace = event.blockFace;
    /** 高度上限 */ const maxHeight = map().heightLimit.max;
    /** 正在使用的方块所处的高度 */ const currHeight = block.location.y;

    // 如果：1. 方块处于上限高度且使用在上面，或高于上限高度；2. 玩家不为创造时，则阻止玩家放置此方块
    if (
        ( ( currHeight === maxHeight && blockFace === "Up" ) || currHeight > maxHeight )
        && player.getGameMode() !== "creative"
    ) {
        // 阻止事件
        event.cancel = true;
        // 警告玩家禁止放置方块
        if ( event.isFirstEvent ) {
            system.run( () => {
                warnPlayer( player, { translate: "message.heightLimit.max" } );
            }
        ) }
    }
}

/** 玩家尝试在最低高度上使用物品时，阻止之
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 */
export function minHeightLimit( event ) {

    /** 交互的玩家 */ const player = event.player;
    /** 正在使用的方块 */ const block = event.block;
    /** 正在使用的面 */ const blockFace = event.blockFace;
    /** 高度下限 */ const minHeight = map().heightLimit.min;
    /** 正在使用的方块所处的高度 */ const currHeight = block.location.y;

    // 如果：1. 方块处于下限高度且使用在下面，或低于下限高度；2. 玩家不为创造时，则阻止玩家放置此方块
    if (
        ( ( currHeight === minHeight && blockFace === "Down" ) || currHeight < minHeight )
        && player.getGameMode() !== "creative"
    ) {
        // 阻止事件
        event.cancel = true;
        // 警告玩家禁止放置方块
        if ( event.isFirstEvent ) { system.run( () => {
            warnPlayer( player, { translate: "message.heightLimit.min" } );
        } ) }
    }
}

/** 玩家尝试开其他未淘汰的队伍的箱子时，阻止之
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 */
export function playerOpenChest( event ) {

    /** 开箱玩家 */ const player = event.player;
    /** 开箱玩家的信息 */ const playerInfo = getPlayerBedwarsInfo( player );
    /** 开的箱子 */ const chest = event.block;
    /** 开的箱子的位置 */ const chestPos = chest.location;

    // 如果：交互方块是箱子、玩家开启的是别的队伍的箱子、该队伍未被淘汰，则阻止玩家开启此箱子并提醒。
    if ( chest.typeId === "minecraft:chest" && !positionManager.isEqual( chestPos, playerInfo.getTeam().chestPos ) ) {
        // 进入条件判断证明开的不是本队箱子，进行进一步判断，确认开的是何队的箱子以及该队是否被淘汰
        /** 被开箱的队伍信息 */ const chestTeam = map().teamList.find( team => positionManager.isEqual( chestPos, team.chestPos ) );

        if ( chestTeam !== undefined && !chestTeam.isEliminated ) {
            event.cancel = true;
            if ( event.isFirstEvent ) { system.run( () => {
                warnPlayer( player, { translate: "message.cannotOpenAliveTeamChests", with: { rawtext: [ { text: `${chestTeam.getTeamNameWithColor()}队` } ] } } );
            } ) }
        }
    }
}

/** 玩家尝试在安全区（例如队伍岛屿的重生点、资源点）放置方块时，阻止之
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 */
export function safeAreaLimit( event ) {

    /** 所有队伍的重生点 */ const spawnpoints = map().teamList.map( team => ( team.spawnpoint ) );
    /** 所有队伍的商人点 */ const traderPoints = map().traderInfo.map( trader => ( trader.pos ) );
    /** 所有队伍的队伍资源点 */ const teamSpawnerPoints = map().teamList.map( team => ( team.spawnerInfo.spawnerPos ) );
    /** 所有钻石点 */ const diamondSpawnerPoints = map().spawnerInfo.diamondInfo.map( diamond => ( diamond.pos ) );
    /** 所有绿宝石点 */ const emeraldSpawnerPoints = map().spawnerInfo.emeraldInfo.map( emerald => ( emerald.pos ) );

    /** 受限物品（ID中所含有的字符串） */ const limitedItems = [ "wool", "stained_hardened_clay", "blast_proof_glass", "end_stone", "obsidian", "ladder", "tnt", "planks", "sponge", "bucket" ];

    /** 玩家使用的物品 */ const usingItem = event.itemStack;
    /** 玩家使用的方块的位置 */ const usingPos = event.block.location;

    // 如果玩家在以上点位中使用了受限物品，则取消事件并警告玩家
    if (
        usingItem !== undefined
        && (
            spawnpoints.some( spawnpoint => positionManager.distance( usingPos, spawnpoint ) <= 5 )
            || traderPoints.some( traderPoint => positionManager.distance( usingPos, traderPoint ) <= 3 )
            || teamSpawnerPoints.some( teamSpawnerPoints => positionManager.distance( usingPos, teamSpawnerPoints ) <= 5 )
            || diamondSpawnerPoints.some( diamondSpawnerPoint => positionManager.distance( usingPos, diamondSpawnerPoint ) <= 2 )
            || emeraldSpawnerPoints.some( emeraldSpawnerPoint => positionManager.distance( usingPos, emeraldSpawnerPoint ) <= 2 )
        ) // 在以上类型的点位附近放置方块时
        && limitedItems.some( limitItem => usingItem.typeId.includes( limitItem ) ) // 且玩家使用的物品为限制物品时
    ) {
        event.cancel = true;
        system.run( () => {
            // 提醒，但防止多次提醒
            if ( event.isFirstEvent ) {
                warnPlayer( event.player, { translate: "message.heightLimit.min" } );
            }
            // 如果使用的是水桶，则先设置为含水方块再设置为非含水方块，防止放假水
            if ( usingItem.typeId === "minecraft:water_bucket" ) {
                try {
                    event.block.setWaterlogged( true );
                    event.block.setWaterlogged( false );
                } catch {}
            }
        } )
    }
}
