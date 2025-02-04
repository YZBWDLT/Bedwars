import { system, world } from "@minecraft/server";
import { alwaysSaturation } from "./events/gaming/effects.js";
import { playerBreakVanillaBlocksTest } from "./events/gaming/playerBreakBlockTest.js";
import { regenerateMap } from "./methods/bedwarsMaps.js";
import { createEvent } from "./methods/eventManager.js";
import { createInterval } from "./methods/intervalManager.js";
import { playerLeave, playerRejoin } from "./events/gaming/playerLeaveAndRejoin.js";
import { settingsEvent } from "./methods/bedwarsSettings.js";
import { waiting } from "./events/gaming/beforeGaming.js";
import { beforeGamingInfoBoard } from "./events/gaming/infoBoard.js";

/** 地图创建 */
regenerateMap();

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
    /** 高度限制 */ heightLimit: "heightLimit",
    /** 信息板 */ infoBoard: "infoBoard",
    /** 破坏方块 */ playerBreakBlock: "playerBreakBlock",
    /** 玩家退出重进 */ playerLeaveAndRejoin: "playerLeaveAndRejoin",
    /** 资源生成 */ spawnResources: "spawnResources",
    /** 交易 */ trading: "trading",
    /** 陷阱 */ trap: "trap",
    /** 设置 */ settings: "settings",

    /** 物品逻辑 */ itemLogic: "itemLogic",
    /** 床虱 */ bedBug: "bedBug",
    /** 搭桥蛋 */ bridgeEgg: "bridgeEgg",
    /** 梦境守护者 */ dreamDefender: "dreamDefender",
    /** 魔法牛奶 */ magicMilk: "magicMilk",
    /** 药水 */ potions: "potions",
    /** TNT */ tnt: "tnt",
    /** 水桶 */ waterBucket: "waterBucket"
}

/** ===== 常执行 ===== */
createInterval( "alwaysSaturation", () => alwaysSaturation(), [ tags.gameLogic, tags.effects ], 20 );
createEvent( "playerBreakVanillaBlockTest", world.beforeEvents.playerBreakBlock, event => playerBreakVanillaBlocksTest( event ), [ tags.gameLogic, tags.playerBreakBlock ] );
createEvent( "playerLeave", world.beforeEvents.playerLeave, event => playerLeave( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );
createEvent( "playerRejoin", world.afterEvents.playerSpawn, event => playerRejoin( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );
createEvent( "settingsEvent", system.afterEvents.scriptEventReceive, event => settingsEvent( event ), [ tags.gameLogic, tags.settings ], { namespaces: [ "bs" ] } );

/** ===== 游戏前事件 ===== */
createInterval( "waiting", () => waiting(), [ tags.beforeGaming ] );
createInterval( "beforeGamingInfoBoard", () => beforeGamingInfoBoard(), [ tags.gameLogic, tags.beforeGaming, tags.infoBoard ], 3 );
