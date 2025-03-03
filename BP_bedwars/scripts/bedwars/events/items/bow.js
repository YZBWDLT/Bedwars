/**
 * ===== 弓 =====
 * 若弓击中玩家，则对射击玩家和被射击玩家播放音效。
 */

import { Player, ProjectileHitEntityAfterEvent } from "@minecraft/server";
import { getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";

/** 射击播放音效
 * @param {ProjectileHitEntityAfterEvent} event 
 */
export function playSoundWhenShot( event ) {
    /** 射击者 @type {Player} */ let shooter = event.source;
    /** 被射击者 @type {Player} */ let hitter = event.getEntityHit().entity;
    if ( 
        event.projectile.typeId === "minecraft:arrow" // 被弓箭射中
        && shooter.typeId === "minecraft:player" && playerIsValid( shooter ) // 射击者是有效玩家
        && hitter.typeId === "minecraft:player" && playerIsValid( hitter ) // 被射击者是有效玩家
        && getPlayerBedwarsInfo( hitter ).team !== getPlayerBedwarsInfo( shooter ).team // 射击者和被射击者所处的队伍不同
    ) {
        shooter.playSound( "random.orb" );
        hitter.playSound( "random.orb" );
        shooter.sendMessage( { translate: "message.bowHitHealth", with: { rawtext: [ { text: `${hitter.nameTag}` }, { text: `${hitter.getComponent("minecraft:health").currentValue.toFixed(1)}` } ] } } )
    }
}