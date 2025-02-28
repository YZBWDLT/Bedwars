/**
 * ===== 物品锁定管理器 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 当遇到以下情况之一时，锁定物品为`inventory`模式。
 *   - 在商人 4 格附近。
 *   - 玩家正处于掉落状态。
 *   - 木剑、镐子、斧子、剪刀。
 * · 当遇到以下情况之一时，锁定物品为`none`模式。
 *   - 面向箱子。
 *   - 不处于锁定模式的其他情况。
 */

import { Player } from "@minecraft/server";
import { eachValidSlot } from "../../methods/itemManager";
import { eachPlayer } from "../../methods/playerManager";
import { settings } from "../../methods/bedwarsSettings";

/** 始终锁定的物品 */
const alwaysLockInInventory = [ "bedwars:wooden_sword", "bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe", "bedwars:diamond_pickaxe", "bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe", "bedwars:diamond_axe", "bedwars:shears" ];

/** 箱子类型 */
const chestTypes = [ "minecraft:chest", "minecraft:ender_chest" ]

/** 玩家物品锁定控制器
 * @description 当玩家与商人交互后，锁定玩家物品；当玩家离开商人 4 格后，开放玩家物品
 */
export function playerItemLocker() {

    eachPlayer( player => {

        /** 玩家附近4格是否有商人 */
        let haveTraderNearby = player.runCommand( "execute if entity @e[r=4,type=bedwars:trader]" ).successCount === 1;

        /** 玩家视野内是否有商人 */
        let haveTraderInView = player.getEntitiesFromViewDirection( { type: "bedwars:trader", maxDistance: 4 } );

        /** 玩家视野内是否有箱子 */
        let blockInView = player.getBlockFromViewDirection( { maxDistance: 7.5 } );
        let haveChestInView = false;
        if ( blockInView ) {
            haveChestInView = chestTypes.includes( blockInView.block.typeId )
        };

        /** 玩家是否正在掉落 */
        let isFalling = player.isFalling;

        /** 当玩家附近有商人、视线内有商人并且视线内没有箱子时；或者，玩家正在掉落状态，则锁定，否则解锁之。 */
        if ( ( haveTraderNearby && !haveChestInView ) || ( !settings.miscellaneous.playerCanThrowItemsInVoid && isFalling && isVoidBelow( player ) ) ) { lockItem( player ); }
        else { unlockItem( player ); };

    } )

}

/** 锁定玩家的物品栏
 * @param {Player} player 
 */
function lockItem( player ) {
    eachValidSlot( player, slot => {
        /** 如果该槽位的物品不为「始终锁定的物品」，且还未处于锁定状态，则锁定之 */
        if ( slot.lockMode === "none" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "inventory"; };
    } );
}

/** 解锁玩家的物品栏
 * @param {Player} player 
 */
function unlockItem( player ) {
    eachValidSlot( player, slot => {
        /** 如果该槽位的物品不为「始终锁定的物品」，且处于锁定状态，则解锁之 */
        if ( slot.lockMode === "inventory" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "none"; };
    } );
}

/** 检测玩家脚下是否为虚空
 * @param {Player} player 待检测玩家
 */
function isVoidBelow( player ) {
    let { x, y, z } = player.location
    for ( let y0 = y; y0 >= 0; y0-- ) {
        if ( !player.dimension.getBlock( { x, y: y0, z } ).isAir ) { return false; }
    }
    return true;
}
