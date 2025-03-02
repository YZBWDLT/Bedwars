/** 所有设置 */

import { ItemUseAfterEvent, Player } from "@minecraft/server"
import { regenerateMap, validMaps } from "../maps/mapGenerator"
import { createAndShowActionUi, createAndShowMessageUi, createAndShowModalUi } from "./uiManager"
import { tickToSecond } from "./time"
import { warnPlayer } from "./bedwarsPlayer"
import { map } from "./bedwarsMaps"
import { getScore, setScore } from "./scoreboardManager"

/** 生成默认设置的函数 */
function createDefaultSettings() {
    return {
        /** 游戏开始前的游戏前设置 */ beforeGaming: {
            /** 等待设置 */ waiting: {
                /** 玩家人数下限 */ minPlayerCount: 2,
                /** 玩家人数上限 */ maxPlayerCount: 16,
                /** 游戏开始时长 */ gameStartWaitingTime: 400,
            },
            /** 重加载设置 */ reload: {
                /** 清除地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 */ clearSpeed: 3,
                /** 加载地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 */ loadSpeed: 3,
            },
            /** 队伍分配设置 */ teamAssign: {
                /** 队伍分配模式，0：标准组队，1：随机组队，2：胜率组队 */ mode: 1,
                /** 是否在开始前就随机组队 */ assignBeforeGaming: false,
                /** 是否启用自由选队 */ playerSelectEnabled: false,
            },
        },
        /** 游戏内设置 */ gaming: {
            /** 生成上限 */ resourceLimit: {
                iron: 72,
                gold: 7,
                diamond: 8,
                emerald: 4
            },
            /** 生成间隔（单位：游戏刻） */ resourceInterval: { 
                /** 平均每个铁的基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔*每次生成的铁锭数/(1+速度加成)） */ iron: 6,
                /** 金基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔/(1+速度加成) */ gold: 75,
                /** 钻石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ diamond: 800,
                /** 绿宝石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ emerald: 1500,
                /** 单挑模式下的生成间隔乘数 */ soloSpeedMultiplier: 6
            },
            /** 重生时间 */ respawnTime: {
                /** 普通玩家重生的时长，单位：游戏刻 */ normalPlayers: 110,
                /** 重进玩家重生的时长，单位：游戏刻 */ rejoinedPlayers: 200
            },
            /** 无效队伍 */ invalidTeam: {
                /** 是否启用无效队伍检测 */ enableTest: true,
                /** 是否启用无效队伍的资源池 */ spawnResources: true,
                /** 是否启用无效队伍的商人 */ spawnTraders: true
            },
        },
        /** 地图启用设置 */ mapEnabled: {
            /** 是否启用经典两队模式 */ classicTwoTeamsEnabled: true,
            /** 是否启用经典四队模式 */ classicFourTeamsEnabled: true,
            /** 是否启用经典八队模式 */ classicEightTeamsEnabled: true,
            /** 是否启用夺点两队模式 */ captureTwoTeamsEnabled: true,
        },
        /** 杂项设置 */ miscellaneous: {
            /** 创造模式玩家允许破坏方块 */ creativePlayerCanBreakBlocks: false,
            /** 虚空玩家可扔物品 */ playerCanThrowItemsInVoid: false,
        },
    };
};
/** 默认设置，为定值 */
const defaultSettings = createDefaultSettings();
/** 可用设置列表 */
export let settings = createDefaultSettings();

/** 显示设置菜单主页面
 * @param {Player} player 
 */
function showMainPage( player ) {
    actionSettings(
        player,
        "设置",
        [
            { text: "游戏前设置...", iconPath: "textures/items/clock_item", funcWhenSelected: () => beforeGaming(), },
            { text: "游戏内设置...", iconPath: "textures/items/bed_red", funcWhenSelected: () => gaming(), },
            { text: "地图启用设置...", iconPath: "textures/items/map_filled", funcWhenSelected: () => mapEnabled(), },
            { text: "生成地图", iconPath: "textures/items/map_empty", funcWhenSelected: () => regenerateMapMainpage(), },
            { text: "杂项设置...", iconPath: "textures/items/diamond_pickaxe", funcWhenSelected: () => miscellaneous(), },
            { text: "关于...", iconPath: "textures/items/spyglass", funcWhenSelected: () => about(), },
            { text: "开发者设置...", iconPath: "textures/items/settings", funcWhenSelected: () => developer(), },
        ],
        () => { settingsBackup() /** 退出前备份数据 */ },
        "欢迎来到设置！你可以在这里设置这个附加包的方方面面，例如立刻生成一张特定地图、更改资源生成上限等。来试试吧！>wO§b\n· 更改完成后，请点击窗口下面的「确认」按钮，按右上角的「x」会使您返回上一页而不作任何更改。\n· 如果您需要调整回默认设置，您可以打开默认设置的开关，然后确认。"
    );

    /** 游戏前设置 */
    function beforeGaming() {
        actionSettings(
            player,
            "游戏前设置",
            [
                { text: "地图重置设置...", iconPath: "textures/ui/world_glyph_color", funcWhenSelected: () => reload(), },
                { text: "等待设置...", iconPath: "textures/items/clock_item", funcWhenSelected: () => waiting(), },
                { text: "组队设置...", iconPath: "textures/ui/multiplayer_glyph_color", funcWhenSelected: () => assignTeam(), }
            ],
            () => showMainPage( player ),
            "控制游戏前的运行逻辑，例如地图重置、等待时。按下右上角的「x」以返回上一页。"
        )
        /** 地图重置设置 */
        function reload() {
            let currentClearSpeed = () => { switch ( settings.beforeGaming.reload.clearSpeed ) { case 0: return "非常慢"; case 1: return "较慢"; case 2: return "慢"; case 3: return "中等"; case 4: return "较快"; case 5: return "快"; case 6: default: return "非常快"; } }
            let currentLoadSpeed = () => { switch ( settings.beforeGaming.reload.loadSpeed ) { case 0: return "非常慢"; case 1: return "较慢"; case 2: return "慢"; case 3: return "中等"; case 4: return "较快"; case 5: return "快"; case 6: default: return "非常快"; } }
            modalSettings(
                player,
                "地图重置设置",
                [
                    { type: "dropdown", label: `§l地图清除速度\n§r§7重置地图时清除地图的速度。\n§c注意！速度越快对性能的负担越大。如果您的设备性能低，请选择较慢的速度。§7\n当前值：§a${currentClearSpeed()}`, dropdownOptions: [ "非常慢", "慢", "较慢", "中等", "较快", "快", "非常快" ], defaultValue: settings.beforeGaming.reload.clearSpeed, },
                    { type: "dropdown", label: `§l地图加载速度\n§r§7重置地图时加载地图的速度。\n§c注意！速度越快对性能的负担越大。如果您的设备性能低，请选择较慢的速度。§7\n当前值：§a${currentLoadSpeed()}`, dropdownOptions: [ "非常慢", "慢", "较慢", "中等", "较快", "快", "非常快" ], defaultValue: settings.beforeGaming.reload.loadSpeed, },
                ],
                () => { settings.beforeGaming.reload = defaultSettings.beforeGaming.reload; }, // 默认设置
                result => { // 用户选择的设置
                    settings.beforeGaming.reload.clearSpeed = result[0];
                    settings.beforeGaming.reload.loadSpeed = result[1];
                },
                () => beforeGaming(), // 上一页
            )
        };
        /** 等待设置 */
        function waiting() {
            modalSettings(
                player,
                "游戏前设置",
                [
                    { type: "slider", label: `§l玩家人数下限\n§r§7至少需要多少玩家才可开始游戏。\n当前值：§a${settings.beforeGaming.waiting.minPlayerCount}§7，设置值§a`, sliderMaxValue: 16, sliderMinValue: 2, sliderStepValue: 1, defaultValue: settings.beforeGaming.waiting.minPlayerCount, },
                    { type: "slider", label: `§l玩家人数上限\n§r§7本局至多多少玩家能够参与游戏。\n当前值：§a${settings.beforeGaming.waiting.maxPlayerCount}§7，设置值§a`, sliderMaxValue: 80, sliderMinValue: 8, sliderStepValue: 8, defaultValue: settings.beforeGaming.waiting.maxPlayerCount, },
                    { type: "slider", label: `§l开始游戏的等待时间\n§r§7玩家达到规定数目后，多久后开始游戏。单位：秒。\n当前值：§a${tickToSecond(settings.beforeGaming.waiting.gameStartWaitingTime)-1}§7，设置值§a`, sliderMaxValue: 180, sliderMinValue: 5, sliderStepValue: 5, defaultValue: tickToSecond(settings.beforeGaming.waiting.gameStartWaitingTime)-1, },
                ],
                () => { settings.beforeGaming.waiting = defaultSettings.beforeGaming.waiting; }, // 默认设置
                result => { // 用户选择的设置
                    settings.beforeGaming.waiting.minPlayerCount = result[0];
                    settings.beforeGaming.waiting.maxPlayerCount = result[1];
                    settings.beforeGaming.waiting.gameStartWaitingTime = result[2] * 20;
                    map().gameStartCountdown = settings.beforeGaming.waiting.gameStartWaitingTime; // 立即应用等待时间
                },
                () => beforeGaming(), // 上一页
            )
        };
        /** 组队设置 */
        function assignTeam() {
            const getModeName = () => { switch ( settings.beforeGaming.teamAssign.mode ) { case 0: return "标准组队"; case 1: return "随机组队"; case 2: default: return "胜率组队"; } }
            modalSettings(
                player,
                "组队设置",
                [
                    { type: "dropdown", label: `§l组队模式\n§r§7如何为各个队伍分配玩家。\n§c目前未实装胜率组队的功能。§7\n当前值：§a${getModeName()}`, dropdownOptions: [ "标准组队（随机平均分队，排列靠前的队伍人多）", "随机组队（随机平均分队，何队人多不定）", "胜率组队（按照胜率平均分队）" ], defaultValue: settings.beforeGaming.teamAssign.mode, },
                    { type: "toggle", label: `§l开始前组队\n§r§7游戏将在开始前就随机组队，而非开始后随机组队。\n§c目前未实装功能。§7\n当前值：§a${settings.beforeGaming.teamAssign.assignBeforeGaming}`, defaultValue: settings.beforeGaming.teamAssign.assignBeforeGaming },
                    { type: "toggle", label: `§l玩家自主选队\n§r§7玩家是否能够自主选择队伍。未选择队伍的玩家按照组队模式的方法分配队伍。\n§c目前未实装功能。§7\n当前值：§a${settings.beforeGaming.teamAssign.playerSelectEnabled}`, defaultValue: settings.beforeGaming.teamAssign.playerSelectEnabled },
                ],
                () => { settings.beforeGaming.teamAssign = defaultSettings.beforeGaming.teamAssign; },
                result => {
                    settings.beforeGaming.teamAssign.mode = result[0];
                    settings.beforeGaming.teamAssign.assignBeforeGaming = result[1];
                    settings.beforeGaming.teamAssign.playerSelectEnabled = result[2];
                },
                () => beforeGaming()
            )
        };

    };
    /** 游戏内设置 */
    function gaming() {
        actionSettings(
            player,
            "游戏内设置",
            [
                { text: "资源上限设置...", iconPath: "textures/items/iron_ingot", funcWhenSelected: () => resourceLimit() },
                { text: "资源生成间隔设置...", iconPath: "textures/items/gold_ingot", funcWhenSelected: () => resourceSpeed() },
                { text: "重生时间设置...", iconPath: "textures/items/clock_item", funcWhenSelected: () => respawnTime() },
                { text: "无效队伍设置...", iconPath: "textures/blocks/barrier", funcWhenSelected: () => invalidTeam() },
            ],
            () => showMainPage( player ),
            "控制资源生成、复活时间等。按下右上角的「x」以返回上一页。"
        );
        /** 资源上限设置 */
        function resourceLimit() {
            modalSettings(
                player,
                "资源上限设置",
                [
                    { type: "slider", label: `§l铁生成上限\n§r§7当资源池内没有玩家时，最多生成的铁锭数目。\n当前值：§a${settings.gaming.resourceLimit.iron}§7，设置值§a`, sliderMinValue: 8, sliderMaxValue: 400, sliderStepValue: 8, defaultValue: settings.gaming.resourceLimit.iron },
                    { type: "slider", label: `§l金生成上限\n§r§7当资源池内没有玩家时，最多生成的金锭数目。\n当前值：§a${settings.gaming.resourceLimit.gold}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.gold },
                    { type: "slider", label: `§l钻石生成上限\n§r§7当钻石点内没有玩家时，最多生成的钻石数目。\n当前值：§a${settings.gaming.resourceLimit.diamond}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.diamond },
                    { type: "slider", label: `§l绿宝石生成上限\n§r§7当绿宝石点内没有玩家时，最多生成的绿宝石数目。\n当前值：§a${settings.gaming.resourceLimit.emerald}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 50, sliderStepValue: 1, defaultValue: settings.gaming.resourceLimit.emerald },
                ],
                () => { settings.gaming.resourceLimit = defaultSettings.gaming.resourceLimit; },
                result => {
                    settings.gaming.resourceLimit.iron = result[0];
                    settings.gaming.resourceLimit.gold = result[1];
                    settings.gaming.resourceLimit.diamond = result[2];
                    settings.gaming.resourceLimit.emerald = result[3];
                },
                () => gaming()
            );
        };
        /** 资源速度设置 */
        function resourceSpeed() {
            modalSettings(
                player,
                "资源间隔设置",
                [
                    { type: "slider", label: `§l铁生成间隔\n§r§7在标准模式无任何加成下，平均每个铁锭生成所需的时间。单位：*0.05秒。\n§8例：若设置为6，则每个铁锭的生成间隔将为0.3秒。§7\n当前值：§a${tickToSecond(settings.gaming.resourceInterval.iron,"float")}§7，设置值§a`, sliderMinValue: 2, sliderMaxValue: 40, sliderStepValue: 2, defaultValue: settings.gaming.resourceInterval.iron },
                    { type: "slider", label: `§l金生成间隔\n§r§7在标准模式无任何加成下，平均每个金锭生成所需的时间。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.resourceInterval.gold)-1}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 15, sliderStepValue: 1, defaultValue: tickToSecond(settings.gaming.resourceInterval.gold)-1 },
                    // 钻石生成实际速率为（基准间隔-等级*200），所以1级的情况下默认为800-1*200=600（30秒）。所以，应该减去11而不能只减1。
                    { type: "slider", label: `§l钻石生成间隔\n§r§7在标准模式无任何加成下，平均每个钻石生成所需的时间。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.resourceInterval.diamond)-11}§7，设置值§a`, sliderMinValue: 30, sliderMaxValue: 90, sliderStepValue: 5, defaultValue: tickToSecond(settings.gaming.resourceInterval.diamond)-11 },
                    { type: "slider", label: `§l绿宝石生成间隔\n§r§7在标准模式无任何加成下，平均每个绿宝石生成所需的时间。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.resourceInterval.emerald)-11}§7，设置值§a`, sliderMinValue: 30, sliderMaxValue: 90, sliderStepValue: 5, defaultValue: tickToSecond(settings.gaming.resourceInterval.emerald)-11 },
                    { type: "slider", label: `§l单挑模式生成倍率\n§r§7单挑模式相比于标准模式的速度倍率。单位：*0.1。\n§8例：若设置为6，则单挑模式下生成资源的速度降为标准模式的0.6倍。§7\n当前值：§a${settings.gaming.resourceInterval.soloSpeedMultiplier}§7，设置值§a`, sliderMinValue: 1, sliderMaxValue: 20, sliderStepValue: 1, defaultValue: settings.gaming.resourceInterval.soloSpeedMultiplier },
                ],
                () => { settings.gaming.resourceInterval = defaultSettings.gaming.resourceInterval; },
                result => {
                    settings.gaming.resourceInterval.iron = result[0];
                    settings.gaming.resourceInterval.gold = result[1] * 20;
                    settings.gaming.resourceInterval.diamond = ( result[2] + 10 ) * 20;
                    settings.gaming.resourceInterval.emerald = ( result[3] + 10 ) * 20;
                    settings.gaming.resourceInterval.soloSpeedMultiplier = result[4];
                },
                () => gaming()
            );
        };
        /** 重生时间设置 */
        function respawnTime() {
            modalSettings(
                player,
                "重生时间设置",
                [
                    { type: "slider", label: `§l普通玩家重生时长\n§r§7当玩家死亡后，需要多长时间重生。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.respawnTime.normalPlayers)-1}§7，设置值§a`, sliderMinValue: 0, sliderMaxValue: 30, sliderStepValue: 1, defaultValue: tickToSecond(settings.gaming.respawnTime.normalPlayers)-1 },
                    { type: "slider", label: `§l重进玩家重生时长\n§r§7当玩家退出重进后，需要多长时间重生。单位：秒。\n当前值：§a${tickToSecond(settings.gaming.respawnTime.rejoinedPlayers)-1}§7，设置值§a`, sliderMinValue: 0, sliderMaxValue: 30, sliderStepValue: 1, defaultValue: tickToSecond(settings.gaming.respawnTime.rejoinedPlayers)-1 },
                ],
                () => { settings.gaming.respawnTime = defaultSettings.gaming.respawnTime; },
                result => {
                    settings.gaming.respawnTime.normalPlayers = result[0] * 20;
                    settings.gaming.respawnTime.rejoinedPlayers = result[1] * 20;
                },
                () => gaming()
            );
        };
        /** 无效队伍设置 */
        function invalidTeam() {
            modalSettings(
                player,
                "无效队伍设置",
                [
                    { type: "toggle", label: `§l无效队伍检测\n§r§7在游戏开始时自动淘汰未分配到成员的队伍。\n当前值：§a${settings.gaming.invalidTeam.enableTest}`, defaultValue: settings.gaming.invalidTeam.enableTest, },
                    { type: "toggle", label: `§l无效队伍能否生成资源\n§r§7一开始未分配到队员的队伍是否在其队伍岛屿生成资源。\n当前值：§a${settings.gaming.invalidTeam.spawnResources}`, defaultValue: settings.gaming.invalidTeam.spawnResources },
                    { type: "toggle", label: `§l无效队伍能否生成商人\n§r§7一开始未分配到队员的队伍是否在其队伍岛屿生成商人。\n§c目前未实装功能。§7\n当前值：§a${settings.gaming.invalidTeam.spawnTraders}`, defaultValue: settings.gaming.invalidTeam.spawnTraders },
                ],
                () => {
                    settings.gaming.invalidTeam = defaultSettings.gaming.invalidTeam;
                },
                result => {
                    settings.gaming.invalidTeam.enableTest = result[0];
                    settings.gaming.invalidTeam.spawnResources = result[1];
                    settings.gaming.invalidTeam.spawnTraders = result[2];
                },
                () => gaming()
            )
        };
    };
    /** 地图启用设置 */
    function mapEnabled() {
        modalSettings(
            player,
            "地图启用设置",
            [
                { type: "toggle", label: `§l启用经典2队模式地图\n§r§7当前值：§a${settings.mapEnabled.classicTwoTeamsEnabled}`, defaultValue: settings.mapEnabled.classicTwoTeamsEnabled },
                { type: "toggle", label: `§l启用经典4队模式地图\n§r§7当前值：§a${settings.mapEnabled.classicFourTeamsEnabled}`, defaultValue: settings.mapEnabled.classicFourTeamsEnabled },
                { type: "toggle", label: `§l启用经典8队模式地图\n§r§7当前值：§a${settings.mapEnabled.classicEightTeamsEnabled}`, defaultValue: settings.mapEnabled.classicEightTeamsEnabled },
                { type: "toggle", label: `§l启用夺点2队模式地图\n§r§7当前值：§a${settings.mapEnabled.captureTwoTeamsEnabled}`, defaultValue: settings.mapEnabled.captureTwoTeamsEnabled },
            ],
            () => { settings.mapEnabled = defaultSettings.mapEnabled; },
            result => {
                if ( result.every( b => b === false ) ) {
                    warnPlayer( player, { translate: "message.settings.warning.allModesDisabled" } )
                }
                else {
                    settings.mapEnabled.classicTwoTeamsEnabled = result[0];
                    settings.mapEnabled.classicFourTeamsEnabled = result[1];
                    settings.mapEnabled.classicEightTeamsEnabled = result[2];
                    settings.mapEnabled.captureTwoTeamsEnabled = result[3];
                }
            },
            () => showMainPage( player )
        );
    };
    /** 生成地图 */
    function regenerateMapMainpage() {
        let allowedModes = [];
        if ( settings.mapEnabled.classicTwoTeamsEnabled ) { allowedModes.push( "经典2队模式" ); }
        if ( settings.mapEnabled.classicFourTeamsEnabled ) { allowedModes.push( "经典4队模式" ); }
        if ( settings.mapEnabled.classicEightTeamsEnabled ) { allowedModes.push( "经典8队模式" ); }
        if ( settings.mapEnabled.captureTwoTeamsEnabled ) { allowedModes.push( "夺点2队模式" ); }
        allowedModes.push( "在可用的地图中随机生成" )
        modalSettings(
            player,
            "生成地图",
            [
                { type: "dropdown", label: "选择生成何模式的地图。", dropdownOptions: allowedModes, defaultValue: 0 }
            ],
            () => {},
            result => {
                const selectedIndex = result[0];
                if ( selectedIndex === allowedModes.length - 1 ) { regenerateMap(); player.sendMessage( `即将生成一张随机地图。` ) }
                else if ( allowedModes[selectedIndex] === "经典2队模式" ) { regenerateMapSubpage( "classicTwoTeams" ); }
                else if ( allowedModes[selectedIndex] === "经典4队模式" ) { regenerateMapSubpage( "classicFourTeams" ); }
                else if ( allowedModes[selectedIndex] === "经典8队模式" ) { regenerateMapSubpage( "classicEightTeams" ); }
                else if ( allowedModes[selectedIndex] === "夺点2队模式" ) { regenerateMapSubpage( "captureTwoTeams" ); }
            },
            () => showMainPage( player ),
            false
        );
        /** 生成地图（子页面） */
        function regenerateMapSubpage( mode ) {
            let maps = validMaps.classic.twoTeams;
            if ( mode === "classicTwoTeams" ) { maps = validMaps.classic.twoTeams; }
            else if ( mode === "classicFourTeams" ) { maps = validMaps.classic.fourTeams; }
            else if ( mode === "classicEightTeams" ) { maps = validMaps.classic.eightTeams; }
            else if ( mode === "captureTwoTeams" ) { maps = validMaps.capture.twoTeams; }
            modalSettings(
                player,
                "生成地图",
                [
                    { type: "dropdown", label: "选择生成何地图。", dropdownOptions: maps, defaultValue: 0 },
                ],
                () => {},
                result => {
                    if ( map().loadInfo.loadStage === 2 ) {
                        warnPlayer( player, { translate: "message.settings.warning.regenerateMapWhenLoading" } );
                    }
                    else {
                        const selectedIndex = result[0];
                        regenerateMap( maps[selectedIndex] );
                        player.sendMessage( `即将生成地图${maps[selectedIndex]}。` )
                    }
                },
                () => regenerateMapMainpage( player ),
                false
            );
        }
    };
    /** 杂项设置 */
    function miscellaneous() {
        modalSettings(
            player,
            "杂项设置",
            [
                { type: "toggle", label: `§l破坏原版方块\n§r§7创造模式的玩家能否破坏原版方块。\n§7当前值：§a${settings.miscellaneous.creativePlayerCanBreakBlocks}`, defaultValue: settings.miscellaneous.creativePlayerCanBreakBlocks },
                { type: "toggle", label: `§l虚空扔物品\n§r§7在虚空中掉落的玩家是否允许扔出物品。\n§7当前值：§a${settings.miscellaneous.playerCanThrowItemsInVoid}`, defaultValue: settings.miscellaneous.playerCanThrowItemsInVoid },
            ],
            () => { settings.miscellaneous = defaultSettings.miscellaneous; },
            result => {
                settings.miscellaneous.creativePlayerCanBreakBlocks = result[0];
                settings.miscellaneous.playerCanThrowItemsInVoid = result[1];
            },
            () => showMainPage( player )
        );
    }
    /** 关于 */
    function about() {
        actionSettings(
            player,
            "关于",
            [ { text: "确认", funcWhenSelected: () => showMainPage( player ), } ],
            () => showMainPage( player ),
            `§l关于我们§r\n§l§b作者§r§f 一只卑微的量筒\n§l§b出品§r§f 极筑工坊\n§l§b版本§r§f ${map().version}\n§l§b测试员§r§f \n§7§o1.0版本（共42人）§r\n§f巴豆、星辰、龙龙、烟雨、小飞侠、文雨、火卫三、鸽子、月、硫化银、鱼周、白洲梓、lanos、Dull、小意、辉金、十三酱、小面包、鱼、虾皮、小鼠、蒙德人、祉语、帕、吴鸡哥、星空、基岩、沫尘、创哲宇、牢土、玖、小鸟、书豪、擺给、千里、han、条形马、laolu、墨、怡柔、star、闲鱼\n§l§b特别鸣谢§r§f \n祉语（感谢提供服务器！）\n辉金（为我们提供了远古的测试素材！）\n还有正在玩游戏的你 —— ${player.name}，感谢你的游玩！`
        )
    }
    /** 开发者设置 */
    function developer() {
        modalSettings(
            player,
            "开发者设置",
            [
                { type: "textField", label: `§l开始游戏倒计时\n§r§7直接设置游戏开始时长的值。单位：游戏刻。\n§7当前值：§a${settings.beforeGaming.waiting.gameStartWaitingTime}`, textFieldDescription: `settings.beforeGaming.waiting.gameStartWaitingTime: integer`, defaultValue: `${settings.beforeGaming.waiting.gameStartWaitingTime}` },
                { type: "textField", label: `§l玩家人数下限\n§r§7直接设置玩家人数下限的值。（可以强行设置为1）\n§7当前值：§a${settings.beforeGaming.waiting.minPlayerCount}`, textFieldDescription: `settings.beforeGaming.waiting.minPlayerCount: integer`, defaultValue: `${settings.beforeGaming.waiting.minPlayerCount}` },
                { type: "textField", label: `§l玩家人数上限\n§r§7直接设置玩家人数上限的值。\n§7当前值：§a${settings.beforeGaming.waiting.maxPlayerCount}`, textFieldDescription: `settings.beforeGaming.waiting.maxPlayerCount: integer`, defaultValue: `${settings.beforeGaming.waiting.maxPlayerCount}` },
            ],
            () => { settings.developer = defaultSettings.developer },
            result => {
                if ( Number.isInteger( Number( result[0] ) ) ) {
                    settings.beforeGaming.waiting.gameStartWaitingTime = Number( result[0] );
                } else { warnPlayer( player, "§c你必须输入一个整数！" ) }
                if ( Number.isInteger( Number( result[1] ) ) ) {
                    settings.beforeGaming.waiting.minPlayerCount = Number( result[1] );
                } else { warnPlayer( player, "§c你必须输入一个整数！" ) }
                if ( Number.isInteger( Number( result[2] ) ) ) {
                    settings.beforeGaming.waiting.maxPlayerCount = Number( result[2] );
                } else { warnPlayer( player, "§c你必须输入一个整数！" ) }
            },
            () => showMainPage( player )
        )
    }
};

/** 设置功能
 * @param {ItemUseAfterEvent} event 
 */
export function settingsFunction( event ) {
    if ( event.itemStack.typeId === "bedwars:settings" ) { showMainPage( event.source ) }
}

/** 备份设置到data记分板上 */
export function settingsBackup() {
    /** 递归遍历对象，并为每个属性调用 setScore
     * @remark 代码生成自Deepseek
     * @param {object} obj - 要遍历的对象
     * @param {string} path - 当前属性的路径（用于生成 setScore 的第二个参数）
     */
    function applySettings(obj, path = "") {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 构建当前属性的路径
                const currentPath = path ? `${path}.${key}` : key;
                // 如果当前属性是对象，递归遍历
                if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                    applySettings(obj[key], currentPath);
                }
                // 如果当前属性是基本类型（整数、布尔值），调用 setScore
                else {
                    setScore("data", `settings.${currentPath}`, obj[key]);
                }
            }
        }
    }
    applySettings( settings );
}

/** 恢复设置到data记分板上 */
export function settingsRecover() {
    /**
     * 递归遍历对象，并为每个属性调用 getScore
     * @remark 代码生成自Deepseek
     * @param {object} obj - 要遍历的对象（settings 或 defaultSettings）
     * @param {string} path - 当前属性的路径（用于生成 getScore 的第二个参数）
     * @param {object} defaultObj - 默认设置对象（defaultSettings）
     */
    function applySettings(obj, path = "", defaultObj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currentPath = path ? `${path}.${key}` : key; // 构建当前属性的路径
                if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                    // 如果当前属性是对象，递归遍历
                    applySettings(obj[key], currentPath, defaultObj[key]);
                } else {
                    // 获取 getScore 的结果
                    const scoreValue = getScore("data", `settings.${currentPath}`, defaultObj[key]);

                    // 如果默认值是布尔值，则将结果转换为布尔值
                    if (typeof defaultObj[key] === "boolean") {
                        obj[key] = Boolean(scoreValue); // 或者使用 !!scoreValue
                    } else {
                        // 否则，直接使用 getScore 的结果
                        obj[key] = scoreValue;
                        
                    }
                }
            }
        }
    }

    // 调用函数，遍历 settings 对象
    applySettings(settings, "", defaultSettings);
}

/** === 方法 === */

/** 显示Action类型的设置
 * @param {Player} player 显示 UI 的玩家
 * @param {string} titleText 标题名称
 * @param {import("./uiManager").actionUiButtonInfo} buttonInfo 所有的按钮信息
 * @param {function()} lastPage 上一页的函数
 * @param {string} bodyText UI 中的文字描述
 */
function actionSettings( player, titleText, buttonInfo, lastPage, bodyText = "" ) {
    createAndShowActionUi(
        player,
        buttonInfo,
        () => { lastPage(); },
        bodyText,
        titleText
    )
}

/** 显示Modal类型的设置
 * @param {Player} player 显示 UI 的玩家
 * @param {string} titleText 标题名称
 * @param {import("./uiManager").modalUiButtonInfo[]} buttonInfo 所有的选项信息
 * @param {function()} defaultSettings 默认设置执行的函数
 * @param {function((number | string | boolean)[])} selectedSettings 用户选择的设置执行的函数
 * @param {function()} lastPage 上一页的函数
 * @param {boolean} enableDefaultSettings 是否启用默认设置？
 */
function modalSettings( player, titleText, buttonInfo, defaultSettings, selectedSettings, lastPage, enableDefaultSettings = true ) {
    if ( enableDefaultSettings ) {
        createAndShowModalUi(
            player,
            [
                ...buttonInfo,
                { type: "toggle", label: `恢复默认设置\n§7恢复上面的设置为原始的默认设置。`, defaultValue: false },
            ], // 在所有设置里面默认加一个恢复默认设置
            result => {
                if ( result[result.length-1] ) {
                    defaultSettings();
                } // 如果最后一个开关选择为了true，那么恢复默认设置
                else {
                    selectedSettings( result );
                } // 否则，使用用户选择的设置执行的函数
                lastPage();
            },
            () => { lastPage(); },
            titleText, "确认"
        )
    }
    else {
        createAndShowModalUi(
            player,
            buttonInfo,
            result => { selectedSettings( result ); },
            () => { lastPage(); },
            titleText, "确认"
        )
    }
}

/** 显示Message类型的设置
 * @param {Player} player 显示 UI 的玩家
 * @param {string} titleText 标题名称
 * @param {import("./uiManager").actionUiButtonInfo} buttonInfo 所有的按钮信息，必须创建 2 个有效的信息。iconPath在此处无效。
 * @param {string} bodyText UI 中的文字描述
 */
function messageSettings( player, titleText, buttonInfo, bodyText = "" ) {
    createAndShowMessageUi( player, buttonInfo, bodyText, titleText )
}
