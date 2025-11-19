/** ===== 事件主文件 ===== */

/** MC 核心事件 */
import { world } from "@minecraft/server";

/** 经典模式函数调用 */
import { gameEvents } from "./classic/gameEvents";
import { killStyleSettings, mapSettings, selectTeamSettings } from "../methods/bedwarsSettings";

/** 夺点模式函数调用 */
import { playerBreakBedTestCapture } from "./capture/playerBreakBed";
import { playerPlaceBedTest } from "./capture/playerPlaceBed";
import { gameEventsCapture, supplyDragonBuff, teamEliminateAndWinCapture } from "./capture/gameEvents";
import { captureInfoBoard } from "./capture/infoBoard";
import { convertKillCount, playerDiedCapture, respawnEliminatedPlayers } from "./capture/combat";

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
        /** 游戏逻辑：游戏事件 */
        createInterval( "gameEventsMain", () => gameEvents(), [ tags.gameLogic, tags.gaming, tags.gameEvents ] );
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
