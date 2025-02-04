/**
 * ===== TNT =====
 * TNT 用于炸毁方块，并提供一定的冲击力。
 * 只允许炸毁特定方块，大部分非原版方块是不允许炸毁的。
 * 放下 TNT 后，应当立刻点燃。
 */

import { PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import { positionManager } from "../../methods/positionManager";

/** 玩家放置 TNT 后，立刻点燃
 * @param {PlayerPlaceBlockAfterEvent} event 
 */
export function igniteImmediately( event ) {

    if ( event.block.typeId === "bedwars:tnt" ) {

        let { x, y, z } = event.block.location;

        /** 将 TNT 方块移除 */
        event.player.runCommand( `setblock ${x} ${y} ${z} air` );

        /** 生成一个 TNT 实体 */
        event.player.dimension.spawnEntity( "minecraft:tnt", positionManager.center( event.block.location ) )

    }
}