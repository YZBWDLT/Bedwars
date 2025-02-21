/** 所有设置 */

import { ItemUseAfterEvent, Player } from "@minecraft/server"
import { regenerateMap, validMaps } from "../maps/mapGenerator"
import { createActionUi, createModalUi, showActionOrMessageUi, showModalUi } from "./uiManager"
import { tickToSecond } from "./time"
import { warnPlayer } from "./bedwarsPlayer"
import { map } from "./bedwarsMaps"

/** 可用设置列表 */
export let settings = {
    /** 游戏开始前的游戏前设置 */ waiting: {
        /** 最低等待人数 */ minWaitingPlayers: 2,
        /** 游戏开始时长 */ gameStartWaitingTime: 400,
    },
    /** 游戏内设置 */ gaming: {
        /** 生成上限 */ resourceLimit: { iron: 72, gold: 7, diamond: 8, emerald: 4 },
        /** 重生时间 */ respawnTime: { normalPlayers: 110, rejoinedPlayers: 200 },
        /** 无效队伍能否生成资源 */ invalidTeamCouldSpawnResources: true,
    },
    /** 地图启用设置 */ mapEnabled: {
        classicTwoTeamsEnabled: true,
        classicFourTeamsEnabled: true,
        classicEightTeamsEnabled: true,
        captureTwoTeamsEnabled: true,
    },
    /** 杂项设置 */ miscellaneous: {
        /** 创造模式玩家允许破坏方块 */ creativePlayerCanBreakBlocks: false,
        /** 虚空玩家可扔物品 */ playerCanThrowItemsInVoid: false,
    },
    /** 高级设置 */ advanced: {

    },
}

/** 默认设置，为定值 */
const defaultSettings = {
    /** 游戏开始前的游戏前设置 */ waiting: {
        /** 最低等待人数 */ minWaitingPlayers: 2,
        /** 游戏开始时长 */ gameStartWaitingTime: 400,
    },
    /** 游戏内设置 */ gaming: {
        /** 生成上限 */ resourceLimit: { iron: 72, gold: 7, diamond: 8, emerald: 4 },
        /** 重生时间 */ respawnTime: { normalPlayers: 110, rejoinedPlayers: 200 },
        /** 无效队伍能否生成资源 */ invalidTeamCouldSpawnResources: true,
    },
    /** 地图启用设置 */ mapEnabled: {
        classicTwoTeamsEnabled: true,
        classicFourTeamsEnabled: true,
        classicEightTeamsEnabled: true,
        captureTwoTeamsEnabled: true,
    },
    /** 杂项设置 */ miscellaneous: {
        /** 创造模式玩家允许破坏方块 */ creativePlayerCanBreakBlocks: false,
        /** 虚空玩家可扔物品 */ playerCanThrowItemsInVoid: false,
    },
    /** 高级设置 */ advanced: {

    },
}

/** 显示设置菜单主页面
 * @param {Player} player 
 */
function showMainPage( player ) {
    showActionOrMessageUi(
        createActionUi(
            [
                { text: "游戏前设置...", iconPath: "textures/items/clock_item" },
                { text: "游戏内设置...", iconPath: "textures/items/bed_red" },
                { text: "地图启用设置...", iconPath: "textures/items/map_filled" },
                { text: "生成地图", iconPath: "textures/items/map_empty" },
                { text: "杂项设置...", iconPath: "textures/items/diamond_pickaxe" },
            ], "", "设置"
        ),
        player,
        result => {
            if ( result === 0 ) { showWaitingPage( player ); }
            else if ( result === 1 ) { showGamingPage( player ); }
            else if ( result === 2 ) { showMapEnabledPage( player ); }
            else if ( result === 3 ) { showRegenerateMapPage( player ); }
            else if ( result === 4 ) { showMiscellaneousPage( player ); }
        },
        () => {}
    );
};

/** 显示二级菜单游戏前设置主页面
 * @param {Player} player 
 */
function showWaitingPage( player ) {
    showModalUi(
        createModalUi( 
            [
                { type: "slider", label: `最低等待人数\n§7至少需要多少玩家才可开始游戏。\n当前值：§a${settings.waiting.minWaitingPlayers}§7，设置值§a`, sliderMaxValue: 16, sliderMinValue: 2, sliderStepValue: 1, defaultValue: settings.waiting.minWaitingPlayers },
                { type: "slider", label: `开始游戏的等待时间\n§7玩家达到规定数目后，多久后开始游戏。单位：秒。\n当前值：§a${tickToSecond( settings.waiting.gameStartWaitingTime )-1}§7，设置值§a`, sliderMaxValue: 300, sliderMinValue: 5, sliderStepValue: 5, defaultValue: tickToSecond( settings.waiting.gameStartWaitingTime )-1 },
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false }
            ], "游戏前设置", "确认"
        ),
        player,
        result => {
            if ( result[2] ) {
                settings.waiting.gameStartWaitingTime = defaultSettings.waiting.gameStartWaitingTime;
                settings.waiting.minWaitingPlayers = defaultSettings.waiting.minWaitingPlayers;
            }
            else {
                settings.waiting.minWaitingPlayers = result[0];
                settings.waiting.gameStartWaitingTime = result[1] * 20;
                map().gameStartCountdown = settings.waiting.gameStartWaitingTime;
            }
            showMainPage( player ); // 回到上一页
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); } // 回到上一页
        }
    )
};

/** 显示二级菜单游戏内设置主页面
 * @param {Player} player 
 */
function showGamingPage( player ) {
    showActionOrMessageUi(
        createActionUi(
            [
                { text: "资源上限设置...", iconPath: "textures/items/iron_ingot" },
                { text: "重生时间设置...", iconPath: "textures/items/clock_item" },
                { text: "无效队伍设置...", iconPath: "textures/blocks/barrier" },
            ], "关闭此页面以返回上一级。", "游戏内设置"
        ),
        player,
        result => {
            if ( result === 0 ) { showResourceLimitPage( player ); }
            else if ( result === 1 ) { showRespawnTimePage( player ); }
            else if ( result === 2 ) { showInvalidTeamPage( player ); }
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); } // 回到上一页
        }
    )
};

/** 显示三级菜单资源上限设置主页面
 * @param {Player} player 
 */
function showResourceLimitPage( player ) {
    showModalUi(
        createModalUi(
            [
                { type: "slider", label: `铁生成上限\n§7当资源池内没有玩家时，最多生成的铁锭数目。\n当前值：§a${settings.gaming.resourceLimit.iron}§7，设置值§a`, sliderMinValue: 8, sliderMaxValue: 400, sliderStepValue: 8, defaultValue: settings.gaming.resourceLimit.iron },
                { type: "slider", label: `金生成上限\n§7当资源池内没有玩家时，最多生成的金锭数目。\n当前值：§a${settings.gaming.resourceLimit.gold}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.gold },
                { type: "slider", label: `钻石生成上限\n§7当钻石点内没有玩家时，最多生成的钻石数目。\n当前值：§a${settings.gaming.resourceLimit.diamond}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.diamond },
                { type: "slider", label: `绿宝石生成上限\n§7当绿宝石点内没有玩家时，最多生成的绿宝石数目。\n当前值：§a${settings.gaming.resourceLimit.emerald}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.emerald },
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false }
            ], "资源上限设置", "确认"
        ),
        player,
        result => {
            if ( result[4] ) {
                settings.gaming.resourceLimit.iron = defaultSettings.gaming.resourceLimit.iron;
                settings.gaming.resourceLimit.gold = defaultSettings.gaming.resourceLimit.gold;
                settings.gaming.resourceLimit.diamond = defaultSettings.gaming.resourceLimit.diamond;
                settings.gaming.resourceLimit.emerald = defaultSettings.gaming.resourceLimit.emerald;
            }
            else {
                settings.gaming.resourceLimit.iron = result[0];
                settings.gaming.resourceLimit.gold = result[1];
                settings.gaming.resourceLimit.diamond = result[2];
                settings.gaming.resourceLimit.emerald = result[3];
            }
            showGamingPage( player );
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showGamingPage( player ); }
        }
    )
};

/** 显示三级菜单重生时间设置主页面
 * @param {Player} player 
 */
function showRespawnTimePage( player ) {
    showModalUi(
        createModalUi(
            [
                { type: "slider", label: `普通玩家重生时长\n§7当玩家死亡后，需要多长时间重生。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.respawnTime.normalPlayers)}§7，设置值§a`, sliderMinValue: 0, sliderMaxValue: 30, sliderStepValue: 1, defaultValue: tickToSecond(settings.gaming.respawnTime.normalPlayers) },
                { type: "slider", label: `重进玩家重生时长\n§7当玩家退出重进后，需要多长时间重生。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.respawnTime.rejoinedPlayers)}§7，设置值§a`, sliderMinValue: 0, sliderMaxValue: 30, sliderStepValue: 1, defaultValue: tickToSecond(settings.gaming.respawnTime.rejoinedPlayers) },
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false }
            ], "重生时间设置", "确认"
        ),
        player,
        result => {
            if ( result[2] ) {
                settings.gaming.respawnTime.normalPlayers = defaultSettings.gaming.respawnTime.normalPlayers;
                settings.gaming.respawnTime.rejoinedPlayers = defaultSettings.gaming.respawnTime.rejoinedPlayers;
            }
            else {
                settings.gaming.respawnTime.normalPlayers = result[0] * 20;
                settings.gaming.respawnTime.rejoinedPlayers = result[1] * 20;
            }
            showGamingPage( player );
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showGamingPage( player ); }
        }
    )
};

/** 显示三级菜单无效队伍设置主页面
 * @param {Player} player 
 */
function showInvalidTeamPage( player ) {
    showModalUi(
        createModalUi(
            [
                { type: "toggle", label: `无效队伍能否生成资源\n§7一开始未分配到队员的队伍是否在其队伍岛屿生成资源。\n当前值：§a${settings.gaming.invalidTeamCouldSpawnResources}§7，默认值：${defaultSettings.gaming.invalidTeamCouldSpawnResources}`, defaultValue: settings.gaming.invalidTeamCouldSpawnResources },
            ], "无效队伍设置", "确认"
        ),
        player,
        result => {
            settings.gaming.invalidTeamCouldSpawnResources = result[0];
            showGamingPage( player )
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showGamingPage( player ) };
        }
    )
};

/** 显示二级菜单生成地图主页面
 * @param {Player} player 
 */
function showRegenerateMapPage( player ) {
    let allowedModes = [];
    if ( settings.mapEnabled.classicTwoTeamsEnabled ) { allowedModes.push( "经典2队模式" ); }
    if ( settings.mapEnabled.classicFourTeamsEnabled ) { allowedModes.push( "经典4队模式" ); }
    if ( settings.mapEnabled.classicEightTeamsEnabled ) { allowedModes.push( "经典8队模式" ); }
    if ( settings.mapEnabled.captureTwoTeamsEnabled ) { allowedModes.push( "夺点2队模式" ); }
    showModalUi(
        createModalUi(
            [
                { type: "dropdown", label: "选择生成何模式的地图。", dropdownOptions: allowedModes, defaultValue: 0 }
            ], "生成地图", "确认"
        ),
        player,
        result => {
            const selectedIndex = result[0];
            if ( allowedModes[selectedIndex] === "经典2队模式" ) { showRegenerateMapPage2( player, "classicTwoTeams" ); }
            else if ( allowedModes[selectedIndex] === "经典4队模式" ) { showRegenerateMapPage2( player, "classicFourTeams" ); }
            else if ( allowedModes[selectedIndex] === "经典8队模式" ) { showRegenerateMapPage2( player, "classicEightTeams" ); }
            else if ( allowedModes[selectedIndex] === "夺点2队模式" ) { showRegenerateMapPage2( player, "captureTwoTeams" ); }
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); }
        }
    )
};

/** 显示三级菜单生成地图主页面
 * @param {Player} player
 * @param {"classicTwoTeams"|"classicFourTeams"|"classicEightTeams"|"captureTwoTeams"} mode 生成模式
 */
function showRegenerateMapPage2( player, mode ) {
    let maps = validMaps.classic.twoTeams;
    if ( mode === "classicTwoTeams" ) { maps = validMaps.classic.twoTeams; }
    else if ( mode === "classicFourTeams" ) { maps = validMaps.classic.fourTeams; }
    else if ( mode === "classicEightTeams" ) { maps = validMaps.classic.eightTeams; }
    else if ( mode === "captureTwoTeams" ) { maps = validMaps.capture.twoTeams; }
    showModalUi(
        createModalUi(
            [
                { type: "dropdown", label: "选择生成何地图。", dropdownOptions: maps, defaultValue: 0 },
            ], "生成地图", "确认"
        ),
        player,
        result => {
            if ( map().loadInfo.loadStage === 2 ) {
                warnPlayer( player, { text: "§c你不能在加载结构时重新生成地图，请稍后再试" } );
            }
            else {
                const selectedIndex = result[0];
                regenerateMap( maps[selectedIndex] );
                player.sendMessage( `即将生成地图${maps[selectedIndex]}。` )
            }
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); }
        }
    )
}

/** 显示二级菜单地图启用设置主页面
 * @param {Player} player 
 */
function showMapEnabledPage( player ) {
    showModalUi(
        createModalUi(
            [
                { type: "toggle", label: `启用经典2队模式地图\n§7当前值：§a${settings.mapEnabled.classicTwoTeamsEnabled}`, defaultValue: settings.mapEnabled.classicTwoTeamsEnabled },
                { type: "toggle", label: `启用经典4队模式地图\n§7当前值：§a${settings.mapEnabled.classicFourTeamsEnabled}`, defaultValue: settings.mapEnabled.classicFourTeamsEnabled },
                { type: "toggle", label: `启用经典8队模式地图\n§7当前值：§a${settings.mapEnabled.classicEightTeamsEnabled}`, defaultValue: settings.mapEnabled.classicEightTeamsEnabled },
                { type: "toggle", label: `启用夺点2队模式地图\n§7当前值：§a${settings.mapEnabled.captureTwoTeamsEnabled}`, defaultValue: settings.mapEnabled.captureTwoTeamsEnabled },
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false }
            ], "地图启用设置", "确认"
        ),
        player,
        result => {
            if ( result[4] ) {
                settings.mapEnabled.classicTwoTeamsEnabled = defaultSettings.mapEnabled.classicTwoTeamsEnabled;
                settings.mapEnabled.classicFourTeamsEnabled = defaultSettings.mapEnabled.classicFourTeamsEnabled;
                settings.mapEnabled.classicEightTeamsEnabled = defaultSettings.mapEnabled.classicEightTeamsEnabled;
                settings.mapEnabled.captureTwoTeamsEnabled = defaultSettings.mapEnabled.captureTwoTeamsEnabled;
                showMainPage( player );
            }
            else if ( result.every( b => b === false ) ) {
                warnPlayer( player, { text: "§c你不能将所有模式全部禁用！" } )
            }
            else {
                settings.mapEnabled.classicTwoTeamsEnabled = result[0];
                settings.mapEnabled.classicFourTeamsEnabled = result[1];
                settings.mapEnabled.classicEightTeamsEnabled = result[2];
                settings.mapEnabled.captureTwoTeamsEnabled = result[3];
                showMainPage( player );
            }
            
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); }
        }
    )
};

/** 显示二级菜单杂项设置主页面
 * @param {Player} player 
 */
function showMiscellaneousPage( player ) {
    showModalUi(
        createModalUi(
            [
                { type: "toggle", label: `破坏原版方块\n§7创造模式的玩家能否破坏原版方块。\n§7当前值：§a${settings.miscellaneous.creativePlayerCanBreakBlocks}`, defaultValue: settings.miscellaneous.creativePlayerCanBreakBlocks },
                { type: "toggle", label: `虚空扔物品\n§7在虚空中掉落的玩家是否允许扔出物品。\n§7当前值：§a${settings.miscellaneous.playerCanThrowItemsInVoid}`, defaultValue: settings.miscellaneous.playerCanThrowItemsInVoid },
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false }
            ], "杂项设置", "确认"
        ),
        player,
        result => {
            if ( result[2] ) {
                settings.miscellaneous.creativePlayerCanBreakBlocks = defaultSettings.miscellaneous.creativePlayerCanBreakBlocks;
                settings.miscellaneous.playerCanThrowItemsInVoid = defaultSettings.miscellaneous.playerCanThrowItemsInVoid;
            }
            else {
                settings.miscellaneous.creativePlayerCanBreakBlocks = result[0];
                settings.miscellaneous.playerCanThrowItemsInVoid = result[1];
            }
            showMainPage( player );
        },
        canceled => {
            if ( canceled === "UserClosed" ) { showMainPage( player ); }
        }
    )
};

/** 设置功能
 * @param {ItemUseAfterEvent} event 
 */
export function settingsFunction( event ) {
    if ( event.itemStack.typeId === "bedwars:settings" ) { showMainPage( event.source ) }
}
