/** ===== 事件主文件 ===== */

/** MC 核心事件 */
import { world } from "@minecraft/server";

/** 方法类函数调用 */
import { createEvent, deleteEventsWithTag } from "../methods/eventManager";
import { createInterval, deleteIntervalsWithTag } from "../methods/intervalManager";

/** 经典模式函数调用 */
import { equipmentTest } from "./classic/equipment";
import { applyResistanceNearby, applyYVelocity } from "./classic/explosion";
import { trap } from "./classic/trap";
import { spawnResources } from "./classic/spawnResources";
import { gameEvents, teamEliminateAndWin } from "./classic/gameEvents";
import { gameOverCountdown } from "./classic/afterGaming";
import { killStyleSettings, mapSettings, selectTeamSettings } from "../methods/bedwarsSettings";
import { trading } from "./classic/trading";
import { playerItemLocker, removeInvalidItems } from "./classic/items";

/** 夺点模式函数调用 */
import { playerBreakBedTestCapture } from "./capture/playerBreakBed";
import { playerPlaceBedTest } from "./capture/playerPlaceBed";
import { gameEventsCapture, supplyDragonBuff, teamEliminateAndWinCapture } from "./capture/gameEvents";
import { captureInfoBoard } from "./capture/infoBoard";
import { convertKillCount, playerDiedCapture, respawnEliminatedPlayers } from "./capture/combat";
import { playSoundWhenShot } from "./items/bow";

/** 事件控制器 */
export const eventManager = {
    /** 全局事件 */
    generalEvents() {

        /** 游戏逻辑：设置 */
        createEvent( "mapSettings", world.afterEvents.itemUse, event => mapSettings( event ), [ tags.gameLogic, tags.settings ] );
        createEvent( "killStyleSettings", world.afterEvents.itemUse, event => killStyleSettings( event ), [ tags.gameLogic, tags.settings ] );
        createEvent( "selectTeamSettings", world.afterEvents.itemUse, event => selectTeamSettings( event ), [ tags.gameLogic, tags.settings ] );
    },
    /** 经典模式游戏时事件 */
    classicEvents() {
        /** 移除游戏前和游戏后事件 */
        deleteEventsWithTag( tags.beforeGaming, tags.afterGaming );
        deleteIntervalsWithTag( tags.beforeGaming, tags.afterGaming );
        /** 游戏逻辑：装备检测 */
        createInterval( "equipmentTestMain", () => equipmentTest(), [ tags.gameLogic, tags.gaming, tags.equipmentTest ] );
        /** 游戏逻辑：爆炸 */
        createEvent( "applyYVelocity", world.beforeEvents.explosion, event => applyYVelocity(event), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        createInterval( "applyResistanceNearby", () => applyResistanceNearby(), [ tags.gameLogic, tags.gaming, tags.explosion ] );
        /** 游戏逻辑：游戏事件 */
        createInterval( "gameEventsMain", () => gameEvents(), [ tags.gameLogic, tags.gaming, tags.gameEvents ] );
        createInterval( "teamEliminateAndWin", () => teamEliminateAndWin(), [ tags.gameLogic, tags.gaming, tags.gameEvents ] );
        /** 游戏逻辑：陷阱 */
        createInterval( "trap", () => trap(), [ tags.gameLogic, tags.gaming, tags.trap ] );
        /** 游戏逻辑：交易 */
        createInterval( "trading", () => trading(), [ tags.gameLogic, tags.gaming, tags.trading ] )
        /** 游戏逻辑：资源生成 */
        createInterval( "spawnResources", () => spawnResources(), [ tags.gameLogic, tags.gaming, tags.spawnResources ] );
        /** 游戏逻辑：物品 */
        createInterval( "playerItemLocker", () => playerItemLocker(), [ tags.gameLogic, tags.gaming, tags.items ] );
        createInterval( "removeInvalidItems", () => removeInvalidItems(), [ tags.gameLogic, tags.gaming, tags.items ] );
    },
    /** 经典模式游戏后事件 */
    classicAfterEvents() {
        /** 移除游戏前和游戏时事件 */
        deleteEventsWithTag( tags.beforeGaming, tags.gaming );
        deleteIntervalsWithTag( tags.beforeGaming, tags.gaming );
        /** 游戏逻辑：游戏结束 */
        createInterval( "gameOverCountdown", () => gameOverCountdown(), [ tags.gameLogic, tags.afterGaming, "gameOver" ] );
    },
    /** 夺点模式游戏时事件 */
    captureEvents( ) {
        /** 使用夺点模式的床破坏与放置逻辑 */
        createEvent( "playerBreakBedTestCapture", world.afterEvents.playerBreakBlock, event => playerBreakBedTestCapture( event ), [ tags.gameLogic, tags.gaming, tags.breakBlock, "capture" ] );
        createEvent( "playerPlaceBed", world.afterEvents.itemUseOn, event => playerPlaceBedTest( event ), [ tags.gameLogic, tags.gaming, "capture" ] )
        /** 使用夺点模式的游戏事件逻辑 */
        deleteIntervalsWithTag( tags.gameEvents );
        createInterval( "gameEventsCapture", () => gameEventsCapture(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] );
        createInterval( "teamEliminateAndWinCapture", () => teamEliminateAndWinCapture(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] );
        createInterval( "supplyDragonBuff", () => supplyDragonBuff(), [ tags.gameLogic, tags.gaming, tags.gameEvents, "capture" ] )
        /** 使用夺点模式的信息板逻辑 */
        createInterval( "captureInfoboard", () => captureInfoBoard(), [ tags.gameLogic, tags.afterGaming, tags.gaming, tags.infoBoard, "capture" ] );
        /** 使用夺点模式的战斗逻辑 */
        createEvent( "playerDiedCapture", world.afterEvents.entityDie, event => playerDiedCapture( event ), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] );
        createInterval( "respawnEliminatedPlayers", () => respawnEliminatedPlayers(), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] )
        createInterval( "convertKillCount", () => convertKillCount(), [ tags.gameLogic, tags.gaming, tags.combat, "capture" ] )
    },
    /** 夺点模式游戏后事件 */
    captureAfterEvents( ) {
        /** 使用夺点模式的信息板逻辑 */
        createInterval( "captureInfoboard", () => captureInfoBoard(), [ tags.gameLogic, tags.afterGaming, tags.gaming, tags.infoBoard, "capture" ] );
    }
}
