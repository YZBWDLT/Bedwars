import { system, world } from "@minecraft/server";
import * as methods from "./methods.js";
import * as bedwarsEvents from "./events.js"
import * as maps from "./maps.js"


/** 地图创建 */
maps.regenerateMap()

/** 起床战争功能 */


if ( world.bedwarsMap !== undefined ) {
    world.beforeEvents.playerBreakBlock.subscribe( event => { bedwarsEvents.playerBreakBlockEvent( event ); } )
    world.afterEvents.itemCompleteUse.subscribe( event => { bedwarsEvents.playerUsePotionAndMagicMilkEvent( event ); } )
    world.afterEvents.projectileHitEntity.subscribe( event => { bedwarsEvents.bedBugEvent( event ); bedwarsEvents.hurtByFireballsEvent( event ) } )
    world.afterEvents.projectileHitBlock.subscribe( event => { bedwarsEvents.bedBugEvent( event ); bedwarsEvents.hurtByFireballsEvent( event ) } )
    world.beforeEvents.itemUseOn.subscribe( event => { bedwarsEvents.dreamDefenderEvent( event ); bedwarsEvents.playerUseItemOnHeightLimitEvent( event ) } )
    world.afterEvents.itemUseOn.subscribe( event => { bedwarsEvents.playerUseWaterBucketEvent( event ); } )
    world.afterEvents.playerPlaceBlock.subscribe( event => { bedwarsEvents.playerUseTNTEvent( event ); } )
    world.beforeEvents.explosion.subscribe( event => { bedwarsEvents.explosionEvents( event ); } )
    world.afterEvents.entityHurt.subscribe( event => { bedwarsEvents.hurtByPlayerEvent( event ); } )
    world.afterEvents.entityDie.subscribe( event => { bedwarsEvents.playerDieEvent( event ); } )
    world.afterEvents.playerSpawn.subscribe( event => { bedwarsEvents.playerRejoinEvent( event ); } )
    world.beforeEvents.playerLeave.subscribe( event => { bedwarsEvents.playerLeaveEvent( event ); } )
    system.afterEvents.scriptEventReceive.subscribe( event => { bedwarsEvents.settingsEvent( event ) } )
}

system.runInterval( () => {
    if ( world.bedwarsMap !== undefined ) {
        /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap

        bedwarsEvents.effectFunction();
        if ( map.gameStage === 0 ) {
            bedwarsEvents.waitingHallFunction();
            bedwarsEvents.resetMapFunction();
        }
        else if ( map.gameStage === 1 ) {
            bedwarsEvents.waitingHallFunction();
            bedwarsEvents.mapLoadFunction();
        }
        else if ( map.gameStage === 2 ) {
            bedwarsEvents.waitingHallFunction();
            bedwarsEvents.waitingFunction();
        }
        else if ( map.gameStage === 3 ) {
            bedwarsEvents.magicMilkFunction();
            bedwarsEvents.bedbugFunction();
            bedwarsEvents.dreamDefenderFunction();
            bedwarsEvents.bridgeEggFunction();
            bedwarsEvents.equipmentFunction();
            bedwarsEvents.explosionFunction();
            bedwarsEvents.trapFunction();
            bedwarsEvents.spawnResourceFunction();
            bedwarsEvents.tradeFunction();
            bedwarsEvents.playerHurtFunction();
            bedwarsEvents.respawnFunction();
            bedwarsEvents.voidDamageFunction();
            bedwarsEvents.scoreboardFunction();
            bedwarsEvents.gameEventFunction();
            bedwarsEvents.teamFunction();
        }
        else {
            bedwarsEvents.scoreboardFunction();
            bedwarsEvents.gameOverEvent();
        }
        
    }
} )
