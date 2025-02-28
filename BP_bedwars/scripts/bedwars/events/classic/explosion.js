/**
 * ===== 爆炸逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 阻止爆炸破坏原版方块，仅允许破坏特定的方块。
 * · 手动生成掉落物。（因为部分自定义方块因设定了条件性的掉落规则，导致无法从爆炸中掉落自定义方块）
 * · 为玩家施加一定的 y 方向动量。例如火球跳。
 * · 对火球和 TNT 附近的玩家施加抗性提升的效果，实现较低伤害。
 */

import { system, ExplosionBeforeEvent, world } from "@minecraft/server";
import { spawnItem } from "../../methods/itemManager";
import { overworld, positionManager } from "../../methods/positionManager";
import { eachNearbyPlayer } from "../../methods/playerManager";

const breakableVanillaBlocksByExplosion = [ "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];
const dropsFromExplosion = [ "bedwars:end_stone", "bedwars:red_stained_hardened_clay", "bedwars:blue_stained_hardened_clay", "bedwars:yellow_stained_hardened_clay", "bedwars:green_stained_hardened_clay", "bedwars:pink_stained_hardened_clay", "bedwars:cyan_stained_hardened_clay", "bedwars:white_stained_hardened_clay", "bedwars:gray_stained_hardened_clay", "bedwars:purple_stained_hardened_clay", "bedwars:brown_stained_hardened_clay", "bedwars:orange_stained_hardened_clay" ];

/** 防止爆炸破坏原版方块
 * @param {ExplosionBeforeEvent} event 
 */
export function preventBreakingVanillaBlocks(event) {

    /** 将爆炸破坏的方块设置为非原版方块，或属于在breakableVanillaBlocksByExplosion数组中的可破坏方块 */
    event.setImpactedBlocks( event.getImpactedBlocks( ).filter( block => { return !block.typeId.includes( "minecraft:" ) || breakableVanillaBlocksByExplosion.includes( block.typeId ) } ) );

}

/** 从爆炸中掉落方块
 * @param {ExplosionBeforeEvent} event 
 */
export function dropLoot(event) {

    let blockList = [];

    /** 如果有属于 dropsFromExplosion 的方块，则在方块位置生成掉落物 */
    event.getImpactedBlocks().filter( block => {

        /** 如果是 TNT 炸毁的方块，且 TNT 完全掉落开关已打开，则设置为 100% 的掉落 */
        if ( !world.gameRules.tntExplosionDropDecay && event.source.typeId === "minecraft:tnt" ) {
            return dropsFromExplosion.includes( block.typeId );
        }
        /** 否则为 33% 的掉落 */
        else {
            return dropsFromExplosion.includes( block.typeId ) && Math.random() < 0.33;
        }

    } ).forEach( block => {
        blockList.push( { id: block.typeId, pos: block.location } );
    } );

    system.run( () => {

        blockList.forEach( block => {
            spawnItem( block.pos, block.id, { clearVelocity: false } );
        } );

    } )

}

/** 给予爆炸附近的玩家y方向向量
 * @param {ExplosionBeforeEvent} event 
 */
export function applyYVelocity(event) {

    let pos = positionManager.copy( event.source.location );

    system.run( () => {
        eachNearbyPlayer( pos, 2.5, player => {
            player.applyKnockback( 0, 0, 0, 1 + 0.5 * Math.random() )
        } )
    } )

}

/** 给予爆炸物附近的玩家抗性提升 */
export function applyResistanceNearby() {

    let fireballs = overworld.getEntities( { type: "bedwars:fireball" } );
    let tnts = overworld.getEntities( { type: "minecraft:tnt" } );
    [ ...fireballs, ...tnts ].forEach( explosive => {
        eachNearbyPlayer( explosive.location, 2.5, player => {
            player.addEffect( "resistance", 5, { showParticles: false, amplifier: 2 } );
        } );
    } );

}
