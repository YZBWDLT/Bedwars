/**
 * ===== 药水 =====
 * 药水提供特定的效果。
 * 其中，隐身药水还提供隐藏盔甲的效果。
 */

import { ItemCompleteUseAfterEvent } from "@minecraft/server";

/** 玩家饮用药水检测（跳跃药水、迅捷药水、隐身药水）
 * @param {ItemCompleteUseAfterEvent} event 
 */
export function playerDrinkPotionTest( event ) {
    switch ( event.itemStack.typeId ) {
        case "bedwars:potion_jump_boost": event.source.addEffect( "jump_boost", 900, { amplifier: 4 } ); break;
        case "bedwars:potion_speed": event.source.addEffect( "speed", 900, { amplifier: 1 } ); break;
        case "bedwars:potion_invisibility": event.source.addEffect( "invisibility", 600, { amplifier: 0 } ); event.source.triggerEvent( "hide_armor" ); break;
    }
}
