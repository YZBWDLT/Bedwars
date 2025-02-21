/**
 * ===== 高度限制 =====
 * 起床战争地图具有高度限制。
 * 高于某高度，或者低于某高度的放置方块的行为将被阻止。
 * <lang>
 */

import { ItemUseOnBeforeEvent } from "@minecraft/server";
import { map } from "../../methods/bedwarsMaps";

/** 玩家尝试在最高高度上使用物品时，阻止之
 * @param {ItemUseOnBeforeEvent} event 
 */
export function maxHeightLimit( event ) {

    /** 如果正在被使用的方块正处于临界高度，且玩家不为创造模式时执行 */
    if ( event.block.location.y >= map().heightLimit.max && event.source.getGameMode() !== "creative" ) {

        /** 阻止事件发生 */
        event.cancel = true;

        /** 提示玩家禁止放置方块 */
        event.source.sendMessage( { translate: "message.heightLimit.max" } )

    }
}

/** 玩家尝试在最低高度上使用物品时，阻止之
 * @param {ItemUseOnBeforeEvent} event 
 */
export function minHeightLimit( event ) {

    /** 如果正在被使用的方块正处于临界高度，且玩家不为创造模式时执行 */
    if ( event.block.location.y < map().heightLimit.min && event.source.getGameMode() !== "creative" ) {

        /** 阻止事件发生 */
        event.cancel = true;

        /** 提示玩家禁止放置方块 */
        event.source.sendMessage( { translate: "message.heightLimit.min" } )

    }
}
