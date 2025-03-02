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

import { eachValidSlot } from "../../methods/itemManager";
import { eachPlayer } from "../../methods/playerManager";
import { settings } from "../../methods/bedwarsSettings";
import { overworld } from "../../methods/positionManager";

/** 始终锁定的物品 */
const alwaysLockInInventory = [ "bedwars:wooden_sword", "bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe", "bedwars:diamond_pickaxe", "bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe", "bedwars:diamond_axe", "bedwars:shears" ];

/** 箱子类型 */
const chestTypes = [ "minecraft:chest", "minecraft:ender_chest" ];

/** 玩家物品锁定控制器
 * @description 当玩家与商人交互后，锁定玩家物品；当玩家离开商人 4 格后，开放玩家物品
 */
export function playerItemLocker() {

    eachPlayer( player => {

        /** 玩家附近4格是否有商人 */ const haveTraderNearby = player.runCommand( "execute if entity @e[r=4,type=bedwars:trader]" ).successCount === 1;
        /** 玩家视野内的箱子 */ const blockInView = player.getBlockFromViewDirection( { maxDistance: 7.5 } );
        /** 玩家视野内是否有箱子 */ const haveChestInView = blockInView ? chestTypes.includes( blockInView.block.typeId ) : false;
        /** 玩家是否正在掉落 */ const isFalling = player.isFalling;
        /** 玩家下方是否为虚空 */ const isVoidBelow = player.dimension.getTopmostBlock( { x: player.location.x, z: player.location.z }, player.location.y ) === undefined
        /** 玩家能否在虚空扔物品 */ const canThrowItems = settings.miscellaneous.playerCanThrowItemsInVoid;

        /** 当玩家附近有商人并且视线内没有箱子时；或者，玩家正在掉落状态，则锁定，否则解锁之。 */
        if (
            ( haveTraderNearby && !haveChestInView ) // 玩家附近有商人，视线内没有箱子
            || ( !canThrowItems && isFalling && isVoidBelow ) // 禁用了玩家可以扔物品的设置，玩家正在掉落到虚空中
        ) {
            // 如果该槽位的物品不为「始终锁定的物品」，且还未处于锁定状态，则锁定之
            eachValidSlot( player, slot => {
                if ( slot.lockMode === "none" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "inventory"; };
            } );
        }
        else {
            // 如果该槽位的物品不为「始终锁定的物品」，且处于锁定状态，则解锁之
            eachValidSlot( player, slot => {
                if ( slot.lockMode === "inventory" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "none"; };
            } );
        };
    } )
}

/** 清理不必要的掉落物 */
export function removeInvalidItems() {
    /** 按所含字符串搜索，若物品ID含有里面所含的字符串则移除 */ const itemIdsWithString = [ "carpet", "bedwars:shopitem_", "bedwars:upgrade_" ];
    /** 按精确的物品ID搜索 */ const itemIds = [ "minecraft:stick" ];

    // 按照粗略搜索和精确搜索两种模式移除物品
    overworld.getEntities( { type: "minecraft:item" } )
    .filter( item => {
        const thisItemId = item.getComponent( "minecraft:item" ).itemStack.typeId;
        return itemIdsWithString.some( invalidIds => thisItemId.includes( invalidIds ) ) // 粗略搜索
        || itemIds.includes( thisItemId ); // 精确搜索
    } )
    .forEach( item => item.remove() );
}
