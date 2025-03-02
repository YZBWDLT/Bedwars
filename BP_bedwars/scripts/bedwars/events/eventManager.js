/** ===== 事件主文件 ===== */

/** MC 核心事件 */
import { world } from "@minecraft/server";

/** 方法类函数调用 */
import { createEvent, deleteEvents, deleteEventsWithTag } from "../methods/eventManager";
import { createInterval, deleteIntervals, deleteIntervalsWithTag } from "../methods/intervalManager";

/** 物品事件函数调用 */
import { magicMilkCountdown, playerDrinkMagicMilkTest } from "./items/magicMilk";
import { silverfishCountdown, summonSilverfish } from "./items/bedBug";
import { summonIronGolem, ironGolemCountdown } from "./items/dreamDefender";
import { createBridge } from "./items/bridgeEgg";
import { igniteImmediately } from "./items/tnt";
import { clearBucket } from "./items/waterBucket";
import { playerDrinkPotionTest } from "./items/potions";
import { removeEnderPearl } from "./items/enderPearl";

/** 经典模式函数调用 */
import { waiting } from "./classic/beforeGaming";
import { playerBreakBedTest, playerBreakVanillaBlocksTest } from "./classic/playerBreakBlock";
import { maxHeightLimit, minHeightLimit, playerOpenChest, safeAreaLimit } from "./classic/playerUseBlock";
import { equipmentTest } from "./classic/equipment";
import { applyResistanceNearby, applyYVelocity, dropLoot, preventBreakingVanillaBlocks } from "./classic/explosion";
import { trap } from "./classic/trap";
import { spawnResources } from "./classic/spawnResources";
import { combat, deadPlayer, hurtByFireball, hurtByPlayer, playerDied } from "./classic/combat";
import { alwaysSaturation, goldenAppleEffect, invulnerableAfterGame, teamUpgradeEffects } from "./classic/effects";
import { gameEvents, teamEliminateAndWin } from "./classic/gameEvents";
import { playerLeave, playerRejoin } from "./classic/playerLeaveAndRejoin";
import { beforeGamingInfoBoard, gamingInfoBoard, healthScoreboard } from "./classic/infoBoard";
import { gameOverCountdown } from "./classic/afterGaming";
import { settingsFunction } from "../methods/bedwarsSettings";
import { trading } from "./classic/trading";
import { playerItemLocker } from "./classic/itemLock";

/** 夺点模式函数调用 */
import { playerBreakBedTestCapture } from "./capture/playerBreakBed";
import { playerPlaceBedTest } from "./capture/playerPlaceBed";
import { gameEventsCapture, supplyDragonBuff, teamEliminateAndWinCapture } from "./capture/gameEvents";
import { captureInfoBoard } from "./capture/infoBoard";
import { convertKillCount, playerDiedCapture, respawnEliminatedPlayers } from "./capture/combat";
import { playSoundWhenShot } from "./items/bow";

/** 所用到的标签含义 */
const tags = {
    /** 游戏前 */ beforeGaming: "beforeGaming",
    /** 游戏时 */ gaming: "gaming",
    /** 游戏后 */ afterGaming: "afterGaming",
    
    /** 游戏逻辑 */ gameLogic: "gameLogic",
    /** 战斗相关 */ combat: "combat",
    /** 药效 */ effects: "effects",
    /** 装备检测 */ equipmentTest: "equipmentTest",
    /** 爆炸 */ explosion: "explosion",
    /** 游戏事件 */ gameEvents: "gameEvents",
    /** 使用方块 */ playerUseBlock: "playerUseBlock",
    /** 信息板 */ infoBoard: "infoBoard",
    /** 破坏方块 */ playerBreakBlock: "playerBreakBlock",
    /** 玩家退出重进 */ playerLeaveAndRejoin: "playerLeaveAndRejoin",
    /** 资源生成 */ spawnResources: "spawnResources",
    /** 交易 */ trading: "trading",
    /** 陷阱 */ trap: "trap",
    /** 物品锁定 */ itemLock: "itemLock",
    /** 设置 */ settings: "settings",

    /** 物品逻辑 */ itemLogic: "itemLogic",
    /** 床虱 */ bedBug: "bedBug",
    /** 搭桥蛋 */ bridgeEgg: "bridgeEgg",
    /** 梦境守护者 */ dreamDefender: "dreamDefender",
    /** 魔法牛奶 */ magicMilk: "magicMilk",
    /** 药水 */ potions: "potions",
    /** TNT */ tnt: "tnt",
    /** 水桶 */ waterBucket: "waterBucket",
    /** 末影珍珠 */ enderPearl: "enderPearl",
    /** 弓 */ bow: "bow",
}

/** 事件控制器 */
export const eventManager = {
    /** 全局事件 */
    generalEvents() {

        /** 游戏逻辑：饱和药效 */
        createInterval( "alwaysSaturation", () => alwaysSaturation(), [ tags.gameLogic, tags.effects ], 20 );

        /** 游戏逻辑：破坏方块 */
        createEvent( "playerBreakVanillaBlockTest", world.beforeEvents.playerBreakBlock, event => playerBreakVanillaBlocksTest( event ), [ tags.gameLogic, tags.playerBreakBlock ] );

        /** 游戏逻辑：玩家退出重进 */
        createEvent( "playerLeave", world.beforeEvents.playerLeave, event => playerLeave( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );
        createEvent( "playerRejoin", world.afterEvents.playerSpawn, event => playerRejoin( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );

        /** 游戏逻辑：设置 */
        createEvent( "settingsFunction", world.afterEvents.itemUse, event => settingsFunction( event ), [ tags.gameLogic, tags.settings ] );
        
    },
    /** 经典模式游戏前事件 */
    classicBeforeEvents() {
        /** 移除游戏时和游戏后事件 */
        deleteEventsWithTag( tags.gaming, tags.afterGaming );
        deleteIntervalsWithTag( tags.gaming, tags.afterGaming );
        /** 大厅等待中 */
        createInterval( "waiting", () => waiting(), [ tags.beforeGaming ] );
        /** 大厅信息板 */
        createInterval( "beforeGamingInfoBoard", () => beforeGamingInfoBoard(), [ tags.gameLogic, tags.beforeGaming, tags.infoBoard ], 3 );
    },
    /** 经典模式游戏时事件 */
    classicEvents() {
        /** 移除游戏前和游戏后事件 */
        deleteEventsWithTag( tags.beforeGaming, tags.afterGaming );
        deleteIntervalsWithTag( tags.beforeGaming, tags.afterGaming );
        /** 物品：床虱 */
        createEvent( "summonSilverfishB", world.afterEvents.projectileHitBlock, event => summonSilverfish( event ), [ tags.itemLogic, tags.gaming, tags.bedBug, "summonSilverfish" ] );
        createEvent( "summonSilverfishE", world.afterEvents.projectileHitEntity, event => summonSilverfish( event ), [ tags.itemLogic, tags.gaming, tags.bedBug, "summonSilverfish" ] );
        createInterval( "silverfishCountdown", () => silverfishCountdown(), [ tags.itemLogic, tags.gaming, tags.bedBug ] );
        /** 物品：搭桥蛋 */
        createInterval( "createBridge", () => createBridge(), [ tags.itemLogic, tags.gaming, tags.bridgeEgg ] );
        /** 物品：梦境守护者 */
        createEvent( "summonIronGolem", world.beforeEvents.itemUseOn, event => summonIronGolem( event ), [ tags.itemLogic, tags.gaming, tags.dreamDefender ] );
        createInterval( "ironGolemCountdown", () => ironGolemCountdown(), [ tags.itemLogic, tags.gaming, tags.dreamDefender ] );        
        /** 物品：魔法牛奶 */
        createEvent( "playerDrinkMagicMilkTest", world.afterEvents.itemCompleteUse, event => playerDrinkMagicMilkTest( event ), [ tags.itemLogic, tags.gaming, tags.magicMilk ] );
        createInterval( "magicMilkCountdown", () => magicMilkCountdown(), [ tags.itemLogic, tags.gaming, tags.magicMilk ] );
        /** 物品：药水 */
        createEvent( "playerDrinkPotionTest", world.afterEvents.itemCompleteUse, event => playerDrinkPotionTest( event ), [ tags.itemLogic, tags.gaming, tags.potions ] );
        /** 物品：TNT */
        createEvent( "tntIgniteImmediately", world.afterEvents.playerPlaceBlock, event => igniteImmediately( event ), [ tags.itemLogic, tags.gaming, tags.tnt, tags.explosion ] );
        /** 物品：水桶 */
        createEvent( "clearBucket", world.afterEvents.itemUseOn, event => clearBucket( event ), [ tags.itemLogic, tags.gaming, tags.explosion ] );
        /** 物品：末影珍珠 */
        createInterval( "removeEnderPearl", () => removeEnderPearl(), [ tags.itemLogic, tags.gaming, tags.enderPearl ] );
        /** 物品：弓 */
        createEvent( "playSoundWhenShot", world.afterEvents.projectileHitEntity, event => playSoundWhenShot( event ), [ tags.itemLogic, tags.gaming, tags.bow ] );
        /** 游戏逻辑：战斗系统 */
        createInterval( "combatMain", () => combat(), [ tags.gameLogic, tags.gaming, tags.combat ] );
        createEvent( "hurtByFireballB", world.afterEvents.projectileHitBlock, event => hurtByFireball( event ), [ tags.gameLogic, tags.gaming, tags.combat ] );
        createEvent( "hurtByFireballE", world.afterEvents.projectileHitEntity, event => hurtByFireball( event ), [ tags.gameLogic, tags.gaming, tags.combat ] );
        createEvent( "hurtByPlayer", world.afterEvents.entityHurt, event => hurtByPlayer( event ), [ tags.gameLogic, tags.gaming, tags.combat ] );
        createEvent( "playerDied", world.afterEvents.entityDie, event => playerDied( event ), [ tags.gameLogic, tags.gaming, tags.combat ] );
        createInterval( "deadPlayer", () => deadPlayer(), [ tags.gameLogic, tags.gaming, tags.combat ] )
        /** 游戏逻辑：团队状态效果 */
        createInterval( "teamUpgradeEffects", () => teamUpgradeEffects(), [ tags.gameLogic, tags.gaming, tags.effects ], 20 );
        createEvent( "goldenAppleEffect", world.afterEvents.itemCompleteUse, event => goldenAppleEffect(event), [ tags.gameLogic, tags.gaming, tags.effects ] );
        /** 游戏逻辑：装备检测 */
        createInterval( "equipmentTestMain", () => equipmentTest(), [ tags.gameLogic, tags.gaming, tags.equipmentTest ] );
        /** 游戏逻辑：爆炸 */
        createEvent( "preventBreakingVanillaBlocks", world.beforeEvents.explosion, event => preventBreakingVanillaBlocks(event), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        createEvent( "dropLoot", world.beforeEvents.explosion, event => dropLoot(event), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        createEvent( "applyYVelocity", world.beforeEvents.explosion, event => applyYVelocity(event), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        createInterval( "applyResistanceNearby", () => applyResistanceNearby(), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        /** 游戏逻辑：游戏事件 */
        createInterval( "gameEventsMain", () => gameEvents(), [ tags.gameLogic, tags.gaming, tags.gameEvents ] );
        createInterval( "teamEliminateAndWin", () => teamEliminateAndWin(), [ tags.gameLogic, tags.gaming, tags.gameEvents ] );
        /** 游戏逻辑：玩家使用方块 */
        createEvent( "maxHeightLimit", world.beforeEvents.playerInteractWithBlock, event => maxHeightLimit( event ), [ tags.gameLogic, tags.gaming, tags.playerUseBlock ] );
        createEvent( "minHeightLimit", world.beforeEvents.playerInteractWithBlock, event => minHeightLimit( event ), [ tags.gameLogic, tags.gaming, tags.playerUseBlock ] );
        createEvent( "playerOpenChest", world.beforeEvents.playerInteractWithBlock, event => playerOpenChest( event ), [ tags.gameLogic, tags.gaming, tags.playerUseBlock ] );
        createEvent( "safeAreaLimit", world.beforeEvents.playerInteractWithBlock, event => safeAreaLimit( event ), [ tags.gameLogic, tags.gaming, tags.playerUseBlock ] );
        /** 游戏逻辑：信息板 */
        createInterval( "gamingInfoBoard", () => gamingInfoBoard(), [ tags.gameLogic, tags.afterGaming, tags.gaming, tags.infoBoard ], 3 );
        createInterval( "healthScoreboard", () => healthScoreboard(), [ tags.gameLogic, tags.gaming, tags.infoBoard ] );
        /** 游戏逻辑：玩家破坏方块 */
        createEvent( "playerBreakBedTest", world.afterEvents.playerBreakBlock, event => playerBreakBedTest( event ), [ tags.gameLogic, tags.gaming, tags.playerBreakBlock ] );
        /** 游戏逻辑：陷阱 */
        createInterval( "trap", () => trap(), [ tags.gameLogic, tags.gaming, tags.trap ] );
        /** 游戏逻辑：交易 */
        createInterval( "trading", () => trading(), [ tags.gameLogic, tags.gaming, tags.trading ] )
        /** 游戏逻辑：资源生成 */
        createInterval( "spawnResources", () => spawnResources(), [ tags.gameLogic, tags.gaming, tags.spawnResources ] );
        /** 游戏逻辑：物品锁定 */
        createInterval( "playerItemLocker", () => playerItemLocker(), [ tags.gameLogic, tags.gaming, tags.itemLock ] );
    },
    /** 经典模式游戏后事件 */
    classicAfterEvents() {
        /** 移除游戏前和游戏时事件 */
        deleteEventsWithTag( tags.beforeGaming, tags.gaming );
        deleteIntervalsWithTag( tags.beforeGaming, tags.gaming );
        /** 游戏逻辑：游戏结束 */
        createInterval( "gameOverCountdown", () => gameOverCountdown(), [ tags.gameLogic, tags.afterGaming, "gameOver" ] );
        /** 游戏逻辑：信息板 */
        createInterval( "gamingInfoBoard", () => gamingInfoBoard(), [ tags.gameLogic, tags.gaming, tags.afterGaming, tags.infoBoard ], 3 );
        /** 游戏逻辑：状态效果 */
        createInterval( "invulnerableAfterGame", () => invulnerableAfterGame(), [ tags.gameLogic, tags.afterGaming, tags.effects ], 20 );
    },
    /** 夺点模式游戏时事件 */
    captureEvents( ) {
        /** 使用夺点模式的床破坏与放置逻辑 */
        deleteEvents( "playerBreakBedTest" );
        createEvent( "playerBreakBedTestCapture", world.afterEvents.playerBreakBlock, event => playerBreakBedTestCapture( event ), [ tags.gameLogic, tags.gaming, tags.playerBreakBlock, "capture" ] );
        createEvent( "playerPlaceBed", world.afterEvents.itemUseOn, event => playerPlaceBedTest( event ), [ tags.gameLogic, tags.gaming, "capture" ] )
        /** 使用夺点模式的游戏事件逻辑 */
        deleteIntervalsWithTag( tags.gameEvents );
        createInterval( "gameEventsCapture", () => gameEventsCapture(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] );
        createInterval( "teamEliminateAndWinCapture", () => teamEliminateAndWinCapture(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] );
        createInterval( "supplyDragonBuff", () => supplyDragonBuff(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] )
        /** 使用夺点模式的信息板逻辑 */
        deleteIntervals( "gamingInfoBoard" );
        createInterval( "captureInfoboard", () => captureInfoBoard(), [ tags.gameLogic, tags.afterGaming, tags.gaming, tags.infoBoard, "capture" ] );
        /** 使用夺点模式的战斗逻辑 */
        createEvent( "playerDiedCapture", world.afterEvents.entityDie, event => playerDiedCapture( event ), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] );
        createInterval( "respawnEliminatedPlayers", () => respawnEliminatedPlayers(), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] )
        createInterval( "convertKillCount", () => convertKillCount(), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] )
    },
    /** 夺点模式游戏后事件 */
    captureAfterEvents( ) {
        /** 使用夺点模式的信息板逻辑 */
        deleteIntervals( "gamingInfoBoard" );
        createInterval( "captureInfoboard", () => captureInfoBoard(), [ tags.gameLogic, tags.afterGaming, tags.gaming, tags.infoBoard, "capture" ] );
    }
}
