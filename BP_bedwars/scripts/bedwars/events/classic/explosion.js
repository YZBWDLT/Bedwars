/**
 * ===== 爆炸逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 阻止爆炸破坏原版方块，仅允许破坏特定的方块。
 * · 手动生成掉落物。（因为部分自定义方块因设定了条件性的掉落规则，导致无法从爆炸中掉落自定义方块）
 * · 为玩家施加一定的 y 方向动量。例如火球跳。
 * · 对火球和 TNT 附近的玩家施加抗性提升的效果，实现较低伤害。
 */

import { system, ExplosionBeforeEvent } from "@minecraft/server";
import { overworld, positionManager } from "../../methods/positionManager";
import { eachNearbyPlayer } from "../../methods/playerManager";

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
