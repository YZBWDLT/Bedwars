/**
 * ===== 魔法牛奶 =====
 * 魔法牛奶能够阻止玩家触发陷阱。
 * 在玩家饮用魔法牛奶后，有 30 秒的生效时间。
 */

import { ItemCompleteUseAfterEvent } from "@minecraft/server";
import { BedwarsPlayer, playerIsValid, eachValidPlayer, getPlayerBedwarsInfo } from "../../methods/bedwarsPlayer";

/** 玩家饮用魔法牛奶检测
 * @param {ItemCompleteUseAfterEvent} event 
 */
export function playerDrinkMagicMilkTest( event ) {
    if ( event.itemStack.typeId === "bedwars:magic_milk" && playerIsValid( event.source ) ) {
        getPlayerBedwarsInfo( event.source ).magicMilk.enabled = true;
        getPlayerBedwarsInfo( event.source ).magicMilk.remainingTime = 600;
    }
}

/** 魔法牛奶倒计时 */
export function magicMilkCountdown( ) {
    eachValidPlayer( ( player, playerInfo ) => {
        if ( playerInfo.magicMilk.enabled ) {
            playerInfo.magicMilk.remainingTime--;
            if ( playerInfo.magicMilk.remainingTime <= 0 ) {
                player.sendMessage( { translate: "message.magicMilkTimeOut" } );
                playerInfo.magicMilk.enabled = false;
            };
        };
    } )
}
