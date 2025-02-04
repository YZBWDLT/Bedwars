/**
 * ===== 水桶 =====
 * 提供防御。
 * 如果有队伍的玩家放下了水桶，则应清除其空桶。
 */

import { ItemUseOnAfterEvent } from "@minecraft/server";

/** 玩家使用水桶后，立即清除水桶
 * @param {ItemUseOnAfterEvent} event 
 */
export function clearBucket( event ) {
    if ( event.itemStack.typeId === "minecraft:water_bucket" ) {
        event.source.runCommand( `clear @s bucket` );
    }
}