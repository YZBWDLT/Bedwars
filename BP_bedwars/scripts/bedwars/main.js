import { world } from "@minecraft/server";
import { alwaysSaturation } from "./events/classic/effects";
import { playerBreakVanillaBlocksTest } from "./events/classic/breakBlock";
import { regenerateMap } from "./maps/mapGenerator";
import { createEvent } from "./methods/eventManager";
import { createInterval } from "./methods/intervalManager";
import { playerLeave, playerRejoin } from "./events/classic/playerLeaveAndRejoin";
import { killStyleSettings, mapSettings } from "./methods/bedwarsSettings";
import { waiting } from "./events/classic/beforeGaming";
import { beforeGamingInfoBoard } from "./events/classic/infoBoard";

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
    /** 破坏方块 */ breakBlock: "breakBlock",
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
createEvent( "playerBreakVanillaBlockTest", world.beforeEvents.playerBreakBlock, event => playerBreakVanillaBlocksTest( event ), [ tags.gameLogic, tags.breakBlock ] );
createEvent( "playerLeave", world.beforeEvents.playerLeave, event => playerLeave( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );
createEvent( "playerRejoin", world.afterEvents.playerSpawn, event => playerRejoin( event ), [ tags.gameLogic, tags.playerLeaveAndRejoin ] );
createEvent( "mapSettings", world.afterEvents.itemUse, event => mapSettings( event ), [ tags.gameLogic, tags.settings ] );
createEvent( "killStyleSettings", world.afterEvents.itemUse, event => killStyleSettings( event ), [ tags.gameLogic, tags.settings ] )

/** ===== 游戏前事件 ===== */
createInterval( "waiting", () => waiting(), [ tags.beforeGaming ] );
createInterval( "beforeGamingInfoBoard", () => beforeGamingInfoBoard(), [ tags.gameLogic, tags.beforeGaming, tags.infoBoard ], 3 );
