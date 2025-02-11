/**
 * ===== 弓 =====
 * 若弓击中玩家，则对射击玩家和被射击玩家播放音效。
 */

import { Player, ProjectileHitEntityAfterEvent } from "@minecraft/server";
import { playerIsValid } from "../../methods/bedwarsPlayer";

/** 射击播放音效
 * @param {ProjectileHitEntityAfterEvent} event 
 */
export function playSoundWhenShot( event ) {
    /** 射击者 @type {Player} */ let shooter = event.source;
    /** 被射击者 @type {Player} */ let hitter = event.getEntityHit().entity;
    if ( event.projectile.typeId === "minecraft:arrow" && shooter.typeId === "minecraft:player" && hitter.typeId === "minecraft:player" && playerIsValid( shooter ) && playerIsValid( hitter ) ) {
        shooter.playSound( "random.orb" );
        hitter.playSound( "random.orb" );
    }
}