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

import { overworld } from "../../methods/positionManager";

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
