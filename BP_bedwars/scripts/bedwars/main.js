// ===== 模块导入 =====

import * as minecraft from "@minecraft/server"
import * as lib from "./lib";
import * as data from "./data";

// ===== 系统与设置 =====
// 包含起床战争脚本系统的基础系统。
// 起床战争的各个模式，依靠向系统传入基于 system.runInterval 的起床战争时间线和 world 的各类前事件和后事件的事件执行相关功能，
// 并在满足特定情况下销毁时间线或事件。
// 例如，在游戏前的三个阶段，会尝试创建一个“游戏前记分板”的时间线，在游戏开始后销毁该时间线。事件也是类似于此执行的。
// 总的来说，系统负责存储最基础的信息，并在需要的情况下对时间线和事件做管理。
// 系统还负责存储设置变量，凡是需要使用设置时，应该调用系统的相关属性。

/** 起床战争系统，在进入游戏后创立一个系统并进行初始化 */
class BedwarsSystem {

    /** 地图模式信息 @type {BedwarsClassicMode|BedwarsCaptureMode} */
    mode;

    /** 系统时间线 @type {BedwarsTimeline[]} */
    systemTimelines = [];

    /** 系统事件 @type {BedwarsEvent[]} */
    systemEvents = [];

    /** 系统版本 */
    version = "Alpha 1.1_02";

    /** 游戏 ID */
    gameId = lib.JSUtil.randomInt(1000, 9999);

    /** 游戏状态，0：清除地图中，1：生成地图中，2：等待中，3：开始游戏，4：游戏结束 */
    gameStage = 0;

    /** 下一场游戏倒计时，单位：游戏刻 */
    nextGameCountdown = 200;

    /** 地图设置 @type {BedwarsSettings} */
    settings;

    constructor() {
        this.settings = new BedwarsSettings();
        this.resetMap();
    };

    /** 重置地图，重新选择一张地图并创建模式 */
    resetMap() {

        /** 地图信息 @type {data.BedwarsMapInfo[]} */
        let maps = [];

        if (this.settings.mapEnabled.classicTwoTeamsEnabled) maps = maps.concat(Object.values(data.mapData.classic.TwoTeams));

        let randomMap = maps[lib.JSUtil.randomInt(0, maps.length - 1)];
        if (randomMap.mode == "classic") {
            this.mode = new BedwarsClassicMode(this, new BedwarsMap(this, randomMap));
        }

    };

    /** 注册时间线
     * @param {BedwarsTimeline} timeline 待注册的时间线
     */
    subscribeTimeline(timeline) {
        lib.Debug.sendMessage(`[BedwarsSystem] 已添加名为${timeline.typeId}的时间线。`);
        this.systemTimelines.push(timeline);
    };

    /** 注册事件
     * @param {BedwarsEvent} event 
     */
    subscribeEvent(event) {
        lib.Debug.sendMessage(`[BedwarsSystem] 已添加名为${event.typeId}的事件。`);
        this.systemEvents.push(event);
    };

    /** 停止特定 ID 的时间线
     * @param {string} timelineTypeId 时间线 ID
    */
    unsubscribeTimeline(timelineTypeId) {
        let index = this.systemTimelines.findIndex(timeline => timeline.typeId == timelineTypeId);
        if (index != -1) {
            minecraft.system.clearRun(this.systemTimelines[index].id);
            this.systemTimelines.splice(index, 1);
            lib.Debug.sendMessage(`[BedwarsSystem] 清除完毕！已销毁名为${timelineTypeId}的时间线。`);
        }
        else {
            lib.Debug.sendMessage(`§e[BedwarsSystem] 未找到typeId为${timelineTypeId}的时间线。`);
        }
    };

    /** 停止特定 ID 的事件
     * @param {string} eventTypeId 
     */
    unsubscribeEvent(eventTypeId) {
        let index = this.systemEvents.findIndex(event => event.typeId == eventTypeId);
        if (index != -1) {
            this.systemEvents[index].eventName.unsubscribe(this.systemEvents[index].id);
            this.systemEvents.splice(index, 1);
            lib.Debug.sendMessage(`[BedwarsSystem] 清除完毕！已销毁名为${eventTypeId}的事件。`);
        }
        else {
            lib.Debug.sendMessage(`§e[BedwarsSystem] 未找到typeId为${eventTypeId}的事件。`);
        }

    };

    /** 停止所有时间线 */
    unsubscribeAllTimelines() {
        this.systemTimelines.forEach(timeline => {
            minecraft.system.clearRun(timeline.id);
        });
        this.systemTimelines = [];
        lib.Debug.sendMessage(`[BedwarsSystem] 清除完毕！已销毁所有时间线。`);
    };

    /** 停止所有事件 */
    unsubscribeAllEvents() {
        this.systemEvents.forEach(systemEvent => {
            systemEvent.eventName.unsubscribe(systemEvent.id);
        });
        this.systemEvents = [];
        lib.Debug.sendMessage(`[BedwarsSystem] 清除完毕！已销毁所有事件。`);
    };

    /** 获取特定 ID 的时间线 */
    getTimeline(timelineTypeId) {
        let index = this.systemTimelines.findIndex(timeline => timeline.typeId == timelineTypeId);
        if (index != -1) return this.systemTimelines[index];
        return;
    };

    /** 获取特定 ID 的事件 */
    getEvent(eventTypeId) {
        let index = this.systemEvents.findIndex(event => event.typeId == eventTypeId);
        if (index != -1) return this.systemEvents[index];
        return;
    };

    // ===== 常用方法 =====

    /** 警告玩家并播放音效
     * @param {minecraft.Player} player
     * @param {string | minecraft.RawMessage | (string | minecraft.RawMessage)[]} message
     */
    warnPlayer(player, message) {
        player.playSound("mob.shulker.teleport", { pitch: 0.5, location: player.location });
        player.sendMessage(message);
    };

};

/** 地图设置信息 */
class BedwarsSettings {

    /** 游戏开始前的游戏前设置 */
    beforeGaming = {

        /** 等待设置 */
        waiting: {

            /** 玩家人数下限 */
            minPlayerCount: 2,

            /** 玩家人数上限 */
            maxPlayerCount: 16,

            /** 游戏开始时长，单位：秒 */
            gameStartWaitingTime: 20,

        },

        /** 重加载设置 */
        reload: {

            /** 清除地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 [debug] */
            clearSpeed: 6,

            /** 加载地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 [debug] */
            loadSpeed: 6,

        },

        /** 队伍分配设置 */
        teamAssign: {

            /** 队伍分配模式，0：标准组队，1：随机组队，2：胜率组队 */
            mode: 1,

            /** 是否在开始前就随机组队 */
            assignBeforeGaming: false,

            /** 是否启用自由选队 */
            playerSelectEnabled: false,

        },
    };

    /** 游戏内设置 */
    gaming = {

        /** 生成上限 */
        resourceLimit: {

            /** 铁生成上限 */
            iron: 72,

            /** 金生成上限 */
            gold: 7,

            /** 钻石生成上限 */
            diamond: 8,

            /** 绿宝石生成上限 */
            emerald: 4

        },

        /** 生成间隔（单位：游戏刻） */
        resourceInterval: {

            /** 平均每个铁的基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔*每次生成的铁锭数/(1+速度加成)） */
            iron: 6,

            /** 金基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔/(1+速度加成) */
            gold: 75,

            /** 钻石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */
            diamond: 800,

            /** 绿宝石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */
            emerald: 1500,

            /** 单挑模式下的生成间隔乘数 */
            soloSpeedMultiplier: 6

        },

        /** 重生时间 */
        respawnTime: {

            /** 普通玩家重生的时长，单位：秒 */
            normalPlayers: 6,

            /** 重进玩家重生的时长，单位：秒 */
            rejoinedPlayers: 11

        },

        /** 击杀样式 */
        killStyle: {

            /** 是否启用击杀样式 */
            isEnabled: true,

            /** 是否在每局随机玩家的击杀样式 */
            randomKillStyle: false,

        },

        /** 无效队伍 */
        invalidTeam: {

            /** 是否启用无效队伍检测 */
            enableTest: true,

            /** 是否启用无效队伍的资源池 */
            spawnResources: true,

            /** 是否启用无效队伍的商人 */
            spawnTraders: true

        },

    };

    /** 地图启用设置 */
    mapEnabled = {

        /** 是否启用经典两队模式 */
        classicTwoTeamsEnabled: true,

        /** 是否启用经典四队模式 */
        classicFourTeamsEnabled: true,

        /** 是否启用经典八队模式 */
        classicEightTeamsEnabled: true,

        /** 是否启用夺点两队模式 */
        captureTwoTeamsEnabled: true,

    };

    /** 杂项设置 */
    miscellaneous = {

        /** 创造模式玩家允许破坏方块 */
        creativePlayerCanBreakBlocks: false,

        /** 虚空玩家可扔物品 */
        playerCanThrowItemsInVoid: false,

    };

    constructor() {

    };

};

/** 时间线，是一些循环执行的函数，包含一些特定的信息 */
class BedwarsTimeline {

    /** 时间线字符串 ID，取消时可以调用此 ID 取消 */
    typeId = "";

    /** 时间线 ID，代表一个 system.runInterval() 返回的 ID */
    id = 0;

    /**
     * @param {string} typeId 
     * @param {number} id 
     */
    constructor(typeId, id) {
        this.typeId = typeId;
        this.id = id;
    };

};

/** 事件，为起床战争使用到的 afterEvents 或 beforeEvents，包含一些特定的信息 */
class BedwarsEvent {

    /** 事件字符串 ID，取消时可以调用此 ID 取消 */
    typeId = "";

    /** 事件 ID，为前事件或后事件返回的函数 @type {(arg0)=>{}} */
    id;

    /** 事件名，为各类前事件或后事件的Signal */
    eventName;

    /**
     * @param {string} typeId 
     * @param {*} eventName 
     * @param {(arg0)=>{}} id 
     */
    constructor(typeId, eventName, id) {
        this.typeId = typeId;
        this.eventName = eventName;
        this.id = id;
    };

};

// ===== 模式 =====
// 模式负责运行最基础的代码逻辑。
// 例如，游戏前、游戏时都使用什么逻辑，都通过模式调用 Minecraft 的接口（world 的前事件、后事件和 system.runInterval 等）
// 来执行，并对系统传入 Minecraft 传回的参数，方便后续管理。
// 模式内部有几个特殊方法：entry...State(){} 和 exit...State() {}，它们在阶段变更时执行。一共有 5 个阶段。
// 此外，...Timeline()的方法为时间线方法，...Event()方法为事件放发，可以调用它们以注册时间线或事件。
// 一切其他模式都是基于 BedwarsClassicMode（经典模式）的模式构建的。
// 【优化指南】在不必要的情况下，为性能考虑，模式内的代码会传入较高延迟的 system.runInterval，并且在符合特定条件时会销毁。
// 例如蠹虫生成后，蠹虫存活倒计时才开始计时，并在蠹虫全部消失后销毁时间线。事件也是类似的道理，在不需要时应销毁。

/** 经典模式起床战争的相关函数和方法 */
class BedwarsClassicMode {

    /** 模式类型 */
    type = "classic";

    /** 模式名称 */
    name = "经典";

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 地图 @type {BedwarsMap} */
    map;

    /** 当前清除的层数（仅在清空地图时使用） */
    clearingLayer = 116;

    /** 每个结构加载所需时间，单位：秒（仅在加载地图时使用） */
    loadTimeCountdown = 0;

    /** 游戏开始倒计时，单位：秒（仅在等待期间使用） */
    gameStartCountdown = 21;

    /** 经典模式中使用的物品类商店物品数据 @type {data.BedwarsItemShopitemInfo[]} */
    itemShopitemData = [];

    /** 下一个事件 */
    nextEvent = {

        /** 下一个事件的 ID @type {"diamond_2"|"emerald_2"|"diamond_3"|"emerald_3"|"bed_destruction"|"death_match"|"game_over"} */
        id: "diamond_2",

        /** 下一个事件的倒计时，单位：秒 */
        countdown: 360,

        /** 下一个事件的名称 @type {"钻石生成点 II 级"|"绿宝石生成点 II 级"|"钻石生成点 III 级"|"绿宝石生成点 III 级"|"床自毁"|"绝杀模式"|"游戏结束"} */
        name: "钻石生成点 II 级",

    }

    /**
     * @param {BedwarsSystem} system
     * @param {BedwarsMap} map 
     */
    constructor(system, map) {

        /** 系统 */
        this.system = system;
        this.system.gameStage = 0;

        /** 地图 */
        this.map = map;
        this.loadTimeCountdown = map.getStructureLoadTime();

        // 向系统内注册时间线和事件
        this.entryClearMapState();

    };

    // ===== 通用事件与时间线 =====

    /** 施加饱和状态效果时间线 */
    applySaturationTimeline() {
        return new BedwarsTimeline(
            "applySaturation",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => player.addEffect("saturation", 1, { amplifier: 19, showParticles: false }))
            }, 200)
        );
    };

    /** 显示游戏前的信息板 */
    showBeforeGamingInfoBoardTimeline() {
        return new BedwarsTimeline(
            "showBeforeGamingInfoboard",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => this.beforeGamingInfoboard(player))
            }, 20)
        );
    };

    /** 对玩家显示游戏前信息板
     * @param {minecraft.Player} player 
     */
    beforeGamingInfoboard(player) {

        /** 当前进度文本 */
        let progressText = (() => {

            /** 文本库 */
            let progressTexts = [
                `§f清除原地图中... §7${Math.ceil(this.clearingLayer * 6 / 20 / this.getLayerClearSpeed())}秒§r`, // 清除地图状态使用
                `§f生成地图中... §7${this.loadTimeCountdown}秒§r`, // 生成地图状态使用
                `§f等待中...§7还需${this.system.settings.beforeGaming.waiting.minPlayerCount - lib.PlayerUtil.getAmount()}人§r`, // 等待状态（玩家不足时）使用
                `§f即将开始： §a${this.gameStartCountdown}秒§r`, // 等待状态（玩家充足）使用
            ];

            // 在文本库中选择文本
            if (this.system.gameStage == 0) return progressTexts[0];
            else if (this.system.gameStage == 1) return progressTexts[1];
            else {
                if (lib.PlayerUtil.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) return progressTexts[2];
                else return progressTexts[3]
            }
        })();

        let infoboardTexts = [
            "§l§e     起床战争     ",
            `§8${this.system.gameId}`,
            "",
            `§f地图： §a${this.map.name}`,
            `§f玩家： §a${lib.PlayerUtil.getAmount()}/${this.system.settings.beforeGaming.waiting.maxPlayerCount}`,
            "",
            progressText,
            "",
            `§f队伍数： §a${this.map.teamCount}`,
            `§f模式： §a${this.name}`,
            `§f版本： §7${this.system.version}`,
            "",
            `§e一只卑微的量筒`,
        ];

        player.onScreenDisplay.setActionBar(infoboardTexts.join("§r\n"));

    };

    /** 游戏前时间线 */
    beforeGamingTimeline() {
        return new BedwarsTimeline(
            "beforeGaming",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => {
                    // 如果不是管理员玩家，则设置为冒险模式，并在超出限制区域时拉回来
                    if (player.playerPermissionLevel < 2) {
                        player.setGameMode("Adventure");
                        if (!lib.EntityUtil.isInVolume(player, new minecraft.BlockVolume({ x: -12, y: 119, z: -12 }, { x: 12, y: 129, z: 12 }))) player.teleport({ x: 0, y: 121, z: 0 });
                    }
                    // 反之，如果是管理员玩家，则在没有设置物品时给予一个设置物品
                    else {
                        if (!lib.InventoryUtil.hasItem(player, "bedwars:map_settings")) lib.ItemUtil.giveItem(player, "bedwars:map_settings", { itemLock: "inventory" });
                    }
                    // 如果启用了自主选队和击杀样式，则在玩家没有对应物品时给予物品
                    if (!lib.InventoryUtil.hasItem(player, "bedwars:select_team") && this.system.settings.beforeGaming.teamAssign.playerSelectEnabled) lib.ItemUtil.giveItem(player, "bedwars:select_team", { itemLock: "inventory" });
                    if (!lib.InventoryUtil.hasItem(player, "bedwars:kill_style") && this.system.settings.gaming.killStyle.isEnabled) lib.ItemUtil.giveItem(player, "bedwars:kill_style", { itemLock: "inventory" });
                })
            }, 20)
        );
    };

    /** 阻止玩家破坏方块的事件 */
    stopPlayerBreakBlockEvent() {
        return new BedwarsEvent(
            "stopPlayerBreakBlock",
            minecraft.world.beforeEvents.playerBreakBlock,
            minecraft.world.beforeEvents.playerBreakBlock.subscribe(event => {

                /** 可由玩家破坏的原版方块 */
                const breakableVanillaBlocks = [
                    "minecraft:bed",
                    "minecraft:short_grass",
                    "minecraft:ladder",
                    "minecraft:sponge",
                    "minecraft:wet_sponge"
                ];

                /** 破坏方块的玩家 */
                const breaker = event.player;

                /** 条件 1：如果玩家破坏的是原版方块，且不属于上方列出的的可破坏方块，则防止玩家破坏方块 */
                const stopCondition1 = event.block.typeId.includes("minecraft:") && !breakableVanillaBlocks.includes(event.block.typeId);

                /** 条件 2：如果禁止创造模式管理员玩家破坏方块，或在未禁用此设置的情况下，破坏方块的玩家不是创造模式的管理员玩家，则防止玩家破坏方块 */
                const stopCondition2 = (() => {
                    if (!this.system.settings.miscellaneous.creativePlayerCanBreakBlocks) return true;
                    else if (breaker.getGameMode() != "Creative") return true;
                    else if (breaker.playerPermissionLevel < 2) return true;
                    return false;
                })();

                // 如果符合以上所有条件，则阻止玩家破坏方块
                if (stopCondition1 && stopCondition2) {
                    event.cancel = true;
                    minecraft.system.run(() => {
                        this.system.warnPlayer(breaker, { translate: "message.breakingInvalidBlocks" });
                    });
                }

            })
        )
    };

    /** 游戏前初始化玩家
     * @param {minecraft.Player} player 
     */
    initPlayer(player) {

        // 清除玩家所有物品
        lib.ItemUtil.removeItem(player);

        // 清除玩家的末影箱
        player.runCommand(`function lib/modify_data/reset_ender_chest`);

        // 清除玩家的药效
        player.getEffects().forEach(effect => player.removeEffect(effect.typeId));

        // 重置玩家的血量
        player.getComponent("minecraft:health").setCurrentValue(20);

        // 移除玩家的队伍
        player.triggerEvent("remove_team");

        // 移除玩家的名字颜色
        player.nameTag = player.name;

        // 如果玩家是管理员，调整为创造模式 debug
        if (player.playerPermissionLevel >= 2) player.setGameMode(minecraft.GameMode.Creative);

    };

    /** 游戏前玩家进入游戏的事件 */
    playerSpawnBeforeGameEvent() {
        return new BedwarsEvent(
            "playerSpawnBeforeGame",
            minecraft.world.afterEvents.playerSpawn,
            minecraft.world.afterEvents.playerSpawn.subscribe(event => {
                // 玩家进入时，初始化玩家
                this.initPlayer(event.player);
            })
        );
    };

    /** 显示游戏中的信息板 */
    showGamingInfoBoardTimeline() {
        return new BedwarsTimeline(
            "showGamingInfoboard",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => this.gamingInfoboard(player, this.map.getBedwarsPlayer(player)));
            }, 20)
        );
    };

    // /** 获取下一个事件的名称 debug */
    // getNextEventName() {
    //     switch (this.nextEvent.id) {
    //         case "diamond_2": default: return "钻石生成点 II 级";
    //         case "emerald_2": return "绿宝石生成点 II 级";
    //         case "diamond_3": return "钻石生成点 III 级";
    //         case "emerald_3": return "绿宝石生成点 III 级";
    //         case "bed_destruction": return "床自毁";
    //         case "death_match": return "绝杀模式";
    //         case "game_over": return "游戏结束";
    //     }
    // }

    /** 对玩家显示游戏中信息板
     * @param {minecraft.Player} player 
     * @param {BedwarsPlayer} playerInfo
     */
    gamingInfoboard(player, playerInfo) {

        // 如果玩家没有起床战争信息，直接跳过之
        if (!playerInfo) return;

        /** 玩家所在的队伍 */
        let playerTeam = playerInfo.team;

        /** 信息板文本 */
        let infoboardTexts = [
            "§l§e       起床战争§r       ",
            `§8${this.map.teamCount}队${this.name}模式 ${this.system.gameId}`,
            "",
            `§f${this.nextEvent.name} - §a${lib.JSUtil.timeToString(lib.JSUtil.secondToMinute(this.nextEvent.countdown))}`,
            "",
        ];

        // 添加队伍信息
        this.map.teams.forEach(team => {
            const playerInTeam = playerTeam?.id == team.id ? "§7（你）" : "";
            const teamState = (() => {
                if (team.bedIsExist) return "§a✔";
                else if (team.alivePlayers.length > 0) return `§a${team.alivePlayers.length}`;
                else return "§c✘";
            })();
            infoboardTexts.push(`${team.getTeamNameWithColor()} §f${team.getTeamName()}队： ${teamState} ${playerInTeam}`)
        });
        infoboardTexts.push("");

        // 如果地图最大队伍数<=4，则显示击杀信息等
        if (this.map.teamCount <= 4) infoboardTexts.push(
            `§f击杀数： §a${playerInfo.killCount}`,
            `§f最终击杀数： §a${playerInfo.finalKillCount}`,
            `§f破坏床数： §a${playerInfo.destroyBedCount}`,
            ""
        );

        // 如果玩家是旁观玩家，则显示旁观信息
        if (!playerInfo.team) infoboardTexts.push(
            "§f您当前为旁观者",
            ""
        );

        // 添加作者信息
        infoboardTexts.push("§e一只卑微的量筒");

        player.onScreenDisplay.setActionBar(infoboardTexts.join("§r\n"));

    };

    /** 世界设置事件 */
    worldSettingsEvent() {
        // debug
    };

    /** 击杀样式设置事件 */
    killStyleSettingsEvent() {
        // debug
    };

    /** 队伍选择设置事件 */
    selectTeamSettingsEvent() {
        // debug
    };

    // ===== 清空地图状态 =====

    /** 进入清空地图状态，仅在进入此状态时执行一次 */
    entryClearMapState() {

        // 恢复设置数据
        this.recoverSettings();

        // 设置常加载区域
        minecraft.world.getDimension("overworld").runCommand("tickingarea add 0 0 0 100 0 100 gamingArea1 true");
        minecraft.world.getDimension("overworld").runCommand("tickingarea add 0 0 0 100 0 -100 gamingArea2 true");
        minecraft.world.getDimension("overworld").runCommand("tickingarea add 0 0 0 -100 0 100 gamingArea3 true");
        minecraft.world.getDimension("overworld").runCommand("tickingarea add 0 0 0 -100 0 -100 gamingArea4 true");

        // 游戏规则初始化，并设置为禁止 PVP
        minecraft.world.gameRules.pvp = false;
        minecraft.world.gameRules.sendCommandFeedback = false;
        minecraft.world.gameRules.showTags = false
        minecraft.world.gameRules.doImmediateRespawn = true
        minecraft.world.gameRules.showDeathMessages = false
        minecraft.world.gameRules.doMobLoot = false
        minecraft.world.gameRules.doEntityDrops = false
        minecraft.world.gameRules.keepInventory = true
        minecraft.world.gameRules.doMobSpawning = false
        minecraft.world.gameRules.randomTickSpeed = 0
        minecraft.world.gameRules.doDayLightCycle = false
        minecraft.world.gameRules.doWeatherCycle = false

        // 设置天气为晴天
        minecraft.world.getDimension("overworld").setWeather("Clear");

        // 设置时间为中午
        minecraft.world.setTimeOfDay(6000);

        // 移除其他实体
        lib.EntityUtil.removeAll();

        // 初始化玩家
        lib.PlayerUtil.getAll().forEach(player => this.initPlayer(player));

        // 移除除 data、killStyle 之外的记分板
        lib.ScoreboardObjectiveUtil.getAll().filter(obj => !["data", "killStyle"].includes(obj.id)).forEach(obj => minecraft.world.scoreboard.removeObjective(obj));

        // 如果没有 data、health、killStyle 和 selectTeam 记分板，则新增之
        lib.ScoreboardObjectiveUtil.add("data", "数据");
        lib.ScoreboardObjectiveUtil.add("killStyle", "击杀样式");
        lib.ScoreboardObjectiveUtil.add("selectTeam", "选队数据");
        lib.ScoreboardObjectiveUtil.add("health", "§c❤");

        // 地图大小同步
        lib.Debug.sendMessage(`§c[BedwarsClassicMode][警告] 未同步地图大小！`)
        // let prevX = getScore( "data", "mapSize.prevX" );
        // let prevZ = getScore( "data", "mapSize.prevZ" );
        // if ( prevX !== undefined ) { this.mapSize.prevX = prevX }
        // if ( prevZ !== undefined ) { this.mapSize.prevZ = prevZ }
        // setScore( "data", "mapSize.prevX", this.mapSize.x );
        // setScore( "data", "mapSize.prevZ", this.mapSize.z );

        // 加载等待区结构
        lib.StructureUtil.placeAsync("hypixel:waiting_hall", "overworld", { x: -12, y: 117, z: -12 });

        // 设置世界出生点
        minecraft.world.setDefaultSpawnLocation({ x: 0, y: 121, z: 0 });

        // 注册时间线
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧信息板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线
        this.system.subscribeTimeline(this.applySaturationTimeline()); // 施加饱和效果

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
        // this.system.subscribeEvent(this.worldSettingsEvent()); // 世界设置事件
        // this.system.subscribeEvent(this.killStyleSettingsEvent()); // 击杀样式设置事件
        // this.system.subscribeEvent(this.selectTeamSettingsEvent()); // 队伍选择设置事件

        // 在有玩家进入前，等待玩家进入后清除，有玩家时则直接清除
        if (lib.PlayerUtil.getAmount() < 1) this.system.subscribeEvent(this.playerSpawnWhenClearingMapEvent()); // 当有玩家进入后，再清除地图
        else this.system.subscribeTimeline(this.clearMapTimeline()); // 清空地图状态的主时间线

    };

    /** 离开清空地图状态，仅在退出此状态时执行一次 */
    exitClearMapState() {
        // 移除所有事件和时间线，状态数 +1
        this.system.unsubscribeAllTimelines();
        this.system.unsubscribeAllEvents();
        this.system.gameStage++;
        // 注册下一状态的事件和时间线
        this.entryGenerateMapState();
    };

    /** 玩家进入后触发清除地图的事件 */
    playerSpawnWhenClearingMapEvent() {
        return new BedwarsEvent(
            "playerSpawnWhenClearingMap",
            minecraft.world.afterEvents.playerSpawn,
            minecraft.world.afterEvents.playerSpawn.subscribe(() => {
                // 当有玩家进入后，启用时间线并销毁此事件
                this.system.subscribeTimeline(this.clearMapTimeline()); // 清空地图状态的主时间线
                this.system.unsubscribeEvent("playerSpawnWhenClearingMap"); // 销毁此事件
            })
        );

    };

    /** 清空地图状态的时间线 */
    clearMapTimeline() {
        return new BedwarsTimeline(
            "clearMap",
            minecraft.system.runInterval(() => { // 每 6 * clearLayer 刻执行 1 次
                // 清除对应层数，每次执行时层数递减
                this.clearingLayer--;
                for (let i of [-1, 1]) {
                    for (let j of [-1, 1]) {
                        /** 填充起始点 @type {minecraft.Vector3} */
                        let from = { x: 0, y: this.clearingLayer, z: 0 };
                        /** 填充终止点 @type {minecraft.Vector3} */
                        let to = { x: i * this.map.size.x, y: this.clearingLayer, z: j * this.map.size.z };
                        lib.DimensionUtil.fillBlock("overworld", from, to, "minecraft:air");
                    }
                };
                // 清除完毕后，离开本状态
                if (this.clearingLayer == 0) this.exitClearMapState();
            }, Math.ceil(6 / this.getLayerClearSpeed()))
        );
    };

    /** 获取结构加载速度 */
    getLayerClearSpeed() {
        switch (this.system.settings.beforeGaming.reload.clearSpeed) {
            case 0: return 0.25;
            case 1: return 0.50;
            case 2: return 0.75;
            case 3: default: return 1.00;
            case 4: return 1.50;
            case 5: return 2.00;
            case 6: return 4.00;
        };
    };

    /** 恢复设置数据 */
    recoverSettings() {
        lib.Debug.sendMessage(`§c[BedwarsClassicMode][警告] 未恢复设置数据！`);
    };

    // ===== 生成地图状态 =====

    /** 进入生成地图状态，仅在进入此状态时执行一次 */
    entryGenerateMapState() {

        // 加载边界
        for (let i of [-1, 1]) {
            for (let j of [-1, 1]) {
                /** 填充起始点 @type {minecraft.Vector3} */
                let from = { x: i * this.map.size.x, y: 0, z: i * this.map.size.z };
                /** 填充终止点 @type {minecraft.Vector3} */
                let to = { x: j * this.map.size.x, y: 0, z: j * this.map.size.z * (-1) };
                lib.DimensionUtil.fillBlock("overworld", from, to, "minecraft:border_block");
            }
        };

        // 加载结构（异步加载，依次加载）
        (async () => {

            // 加载队伍岛屿
            for (const teamIsland of this.map.teamIslands) {
                await lib.StructureUtil.placeAsync(`${this.map.id}:team_island`, "overworld", teamIsland.location, { animationMode: "Layers", animationSeconds: teamIsland.loadTime / this.map.getStructureLoadSpeed(), rotation: teamIsland.rotation, mirror: teamIsland.mirror });
                if (!this.map.disableTeamIslandFlag) lib.DimensionUtil.replaceBlock("overworld", teamIsland.flagLocationFrom, teamIsland.flagLocationTo, ["minecraft:white_wool"], `minecraft:${teamIsland.teamId}_wool`);
            }

            // 加载普通岛屿
            for (const island of this.map.islands) {
                await lib.StructureUtil.placeAsync(`${this.map.id}:${island.structureName}`, "overworld", island.location, { animationMode: "Layers", animationSeconds: island.loadTime / this.map.getStructureLoadSpeed(), rotation: island.rotation, mirror: island.mirror });
            }

            // 加载床
            this.map.teams.forEach(team => team.placeBed());

            // 移除其他实体
            lib.EntityUtil.removeAll();

            // 加载完毕后，离开此状态
            this.exitGenerateMapState();

        })();

        // 注册时间线
        this.system.subscribeTimeline(this.calculateLoadTimeCountdownTimeline()); // 倒计时显示
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧信息板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线
        this.system.subscribeTimeline(this.applySaturationTimeline()); // 施加饱和效果

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
        // this.system.subscribeEvent(this.worldSettingsEvent()); // 世界设置事件
        // this.system.subscribeEvent(this.killStyleSettingsEvent()); // 击杀样式设置事件
        // this.system.subscribeEvent(this.selectTeamSettingsEvent()); // 队伍选择设置事件

    };

    /** 离开生成地图状态，仅在退出此状态时执行一次 */
    exitGenerateMapState() {
        // 移除所有事件和时间线，状态数 +1
        this.system.unsubscribeAllTimelines();
        this.system.unsubscribeAllEvents();
        this.system.gameStage++;
        // 注册下一状态的事件和时间线
        this.entryWaitingState();
    };

    /** 计算生成剩余时间 */
    calculateLoadTimeCountdownTimeline() {
        return new BedwarsTimeline(
            "calculateLoadTimeCountdown",
            minecraft.system.runInterval(() => {
                this.loadTimeCountdown--;
            }, 20)
        );
    };

    // ===== 等待状态 =====

    /** 进入等待状态，仅在进入此状态时执行一次 */
    entryWaitingState() {

        // 注册时间线
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧记分板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线
        this.system.subscribeTimeline(this.applySaturationTimeline()); // 施加饱和效果

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
        // this.system.subscribeEvent(this.worldSettingsEvent()); // 世界设置事件
        // this.system.subscribeEvent(this.killStyleSettingsEvent()); // 击杀样式设置事件
        // this.system.subscribeEvent(this.selectTeamSettingsEvent()); // 队伍选择设置事件

        // 人数检查的时间线和事件
        if (lib.PlayerUtil.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) // 人数不足时注册的时间线和事件
            this.system.subscribeEvent(this.playerSpawnWhenWaitingEvent());
        else {  // 人数足够时注册的时间线和事件

            // 令倒计时等于设置值
            this.gameStartCountdown = this.system.settings.beforeGaming.waiting.gameStartWaitingTime;

            this.system.subscribeTimeline(this.gameStartCountdownTimeline());
            this.system.subscribeEvent(this.playerLeaveWhenWaitingEvent());

        }
    };

    /** 离开等待状态，仅在退出此状态时执行一次 */
    exitWaitingState() {
        // 移除所有事件和时间线，状态数 +1
        this.system.unsubscribeAllTimelines();
        this.system.unsubscribeAllEvents();
        this.system.gameStage++;
        // 注册下一状态的事件和时间线
        this.entryGamingState();
    };

    /** 当玩家进入后，检查是否符合开启游戏的条件的事件 */
    playerSpawnWhenWaitingEvent() {
        return new BedwarsEvent(
            "playerSpawnWhenWaiting",
            minecraft.world.afterEvents.playerSpawn,
            minecraft.world.afterEvents.playerSpawn.subscribe(() => {
                // 如果人数充足，检查玩家人数是否会又不足，并开始游戏倒计时
                if (lib.PlayerUtil.getAmount() >= this.system.settings.beforeGaming.waiting.minPlayerCount) {
                    lib.Debug.sendMessage(`[BedwarsClassicMode] 符合转换条件！开始游戏倒计时。`);

                    // 令倒计时等于设置值
                    this.gameStartCountdown = this.system.settings.beforeGaming.waiting.gameStartWaitingTime;

                    // 注册或销毁时间线或事件
                    this.system.subscribeTimeline(this.gameStartCountdownTimeline());
                    this.system.subscribeEvent(this.playerLeaveWhenWaitingEvent());
                    this.system.unsubscribeEvent("playerSpawnWhenWaiting");
                };
            })
        );
    };

    /** 当玩家离开后，检查是否符合终止开启游戏的条件的事件 */
    playerLeaveWhenWaitingEvent() {
        return new BedwarsEvent(
            "playerLeaveWhenWaiting",
            minecraft.world.afterEvents.playerLeave,
            minecraft.world.afterEvents.playerLeave.subscribe(() => {
                // 如果玩家人数不足，重新检查玩家人数是否充足并提醒玩家人数不足
                if (lib.PlayerUtil.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) {
                    // 重置倒计时
                    this.gameStartCountdown = this.system.settings.beforeGaming.waiting.gameStartWaitingTime;
                    // 提醒玩家倒计时已取消
                    lib.PlayerUtil.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.needsMorePlayer" });
                        player.onScreenDisplay.setTitle({ translate: "title.needsMorePlayer" }, { fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 0 });
                        player.playSound("note.hat", { location: player.location });
                    })
                    lib.Debug.sendMessage(`[BedwarsClassicMode] 符合转换条件！中止游戏倒计时。`)
                    // 重新注册或销毁时间线
                    this.system.subscribeEvent(this.playerSpawnWhenWaitingEvent());
                    this.system.unsubscribeTimeline("gameStartCountdown");
                    this.system.unsubscribeEvent("playerLeaveWhenWaiting");
                }
            })
        );

    };

    /** 玩家足够时执行的时间线 */
    gameStartCountdownTimeline() {
        return new BedwarsTimeline(
            "gameStartCountdown",
            minecraft.system.runInterval(() => {
                // 倒计时
                this.gameStartCountdown--;
                // 同步右侧快捷栏
                lib.PlayerUtil.getAll().forEach(player => this.beforeGamingInfoboard(player));
                // 提醒玩家还有多长时间开始游戏
                if (this.gameStartCountdown == 20) {
                    lib.PlayerUtil.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`20`] });
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown == 10) {
                    lib.PlayerUtil.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`§610`] });
                        player.onScreenDisplay.setTitle(`§a10`, { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 })
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown <= 5 && this.gameStartCountdown > 0) {
                    lib.PlayerUtil.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`§c${this.gameStartCountdown}`] });
                        player.onScreenDisplay.setTitle(`§c${this.gameStartCountdown}`, { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 })
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown <= 0) {
                    lib.Debug.sendMessage(`[BedwarsClassicMode] 符合条件！已退出等待状态。`)
                    this.exitWaitingState();
                }
            }, 20)
        );
    };

    // ===== 游戏状态 =====

    /** 进入游戏状态，仅在进入此状态时执行一次 */
    entryGamingState() {

        // 为玩家分配队伍
        this.map.assignTeam();

        // 如果一个队伍没有分配到玩家，则视作无效队伍
        if (this.system.settings.gaming.invalidTeam.enableTest) {
            this.map.teams.forEach(team => {
                if (team.players.length == 0) team.setInvalid();
            })
        };

        // 如果没有 killStyle 和 selectTeam 记分板，则新增之，防止后续代码报错
        lib.ScoreboardObjectiveUtil.add("killStyle", "击杀样式");
        lib.ScoreboardObjectiveUtil.add("selectTeam", "选队数据");

        // 如果没有 health 记分板，则新增并显示之，防止后续代码报错
        lib.ScoreboardObjectiveUtil.addThenDisplay("health", "BelowName", "§c❤");

        // 设置为允许 PVP
        minecraft.world.gameRules.pvp = true;

        // 设置商人
        this.map.traders.forEach(traderData => traderData.spawn());

        // 移除等待大厅
        lib.DimensionUtil.fillBlock("overworld", { x: -12, y: 117, z: -12 }, { x: 12, y: 127, z: 12 }, "minecraft:air");

        // 在重生点下方放置一块屏障（防止薛定谔玩家复活时判定失败）
        lib.DimensionUtil.setBlock("overworld", { x: 0, y: this.map.spawnpoint.y - 2, z: 0 }, "minecraft:barrier");
        lib.DimensionUtil.setBlock("overworld", { x: 1, y: this.map.spawnpoint.y, z: 0 }, "minecraft:barrier");
        lib.DimensionUtil.setBlock("overworld", { x: -1, y: this.map.spawnpoint.y, z: 0 }, "minecraft:barrier");
        lib.DimensionUtil.setBlock("overworld", { x: 0, y: this.map.spawnpoint.y, z: 1 }, "minecraft:barrier");
        lib.DimensionUtil.setBlock("overworld", { x: 0, y: this.map.spawnpoint.y, z: -1 }, "minecraft:barrier");

        // 令每队的玩家初始化
        this.map.teams.forEach(team => team.players.forEach(playerInfo => {
            let player = playerInfo.player;

            // 传送玩家
            team.teleportPlayerToSpawnpoint(player);

            // 设置玩家重生点
            player.setSpawnPoint({ dimension: minecraft.world.getDimension("overworld"), ...this.map.spawnpoint, })

            // 提示玩家游戏玩法
            /** @type {(minecraft.RawMessage | string)[]} */
            let introMessage = [
                { translate: "message.greenLine" },
                this.map.getStartIntro().title,
                "",
                this.map.getStartIntro().intro,
                "",
                { translate: "message.greenLine" },
            ]
            player.sendMessage(introMessage.flatMap((message, index) => index == introMessage.length - 1 ? [message] : [message, "§r\n"]));

            // 为玩家选定击杀样式
            let killStyles = Object.keys(data.KillStyle);
            if (!this.system.settings.gaming.killStyle.isEnabled) playerInfo.killStyle = data.KillStyle.default;
            else if (this.system.settings.gaming.killStyle.randomKillStyle) playerInfo.killStyle = killStyles[lib.JSUtil.randomInt(0, killStyles - 1)];
            else playerInfo.killStyle = killStyles[lib.ScoreboardPlayerUtil.getOrSetDefault("killStyle", player, 0)];

            // 移除玩家的设置物品
            lib.ItemUtil.removeItem(player, "bedwars:kill_style");
            lib.ItemUtil.removeItem(player, "bedwars:select_team");

            // 给予物品
            playerInfo.giveEquipmentWhileSpawn();

        }));

        // 初始化商店物品
        this.itemShopitemData = Object.values(data.itemShopitemData).filter(data => data.description.classicModeEnabled != false);

        // 注册事件
        this.system.subscribeEvent(this.playerLeaveGameEvent()); // 玩家退出事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
        this.system.subscribeEvent(this.newEntitySpawnEvent()); // 实体（尤其是弹射物）生成时的事件，用于创建新的事件（比如火球出现后，检查火球是否击中）
        this.system.subscribeEvent(this.entityRemoveEvent()); // 实体（尤其是弹射物）被移除时的事件，用于移除事件
        this.system.subscribeEvent(this.playerBreakBedEvent()); // 玩家破坏床的事件
        this.system.subscribeEvent(this.playerDieEvent()); // 玩家死亡事件
        this.system.subscribeEvent(this.playerHurtByPlayerEvent()); // 玩家被其他玩家攻击事件
        this.system.subscribeEvent(this.playerFellIntoVoidEvent()); // 玩家掉进虚空事件
        this.system.subscribeEvent(this.playerPlaceBlockOnHeightLimitEvent()); // 玩家在上下限高度放置方块事件
        this.system.subscribeEvent(this.playerOpenChestEvent()); // 玩家开箱事件
        this.system.subscribeEvent(this.playerPlaceBlockOnSafeAreaEvent()); // 检查玩家在安全区域放置方块事件
        this.system.subscribeEvent(this.playerEatGoldenAppleEvent()); // 检查玩家吃下金苹果事件
        this.system.subscribeEvent(this.playerDrinkPotionEvent()); // 检查玩家喝下药水事件
        this.system.subscribeEvent(this.igniteTntImmediatelyEvent()); // 放置 TNT 则立刻点燃事件
        this.system.subscribeEvent(this.stopExplosionBreakBlockEvent()); // 阻止爆炸破坏方块
        this.system.subscribeEvent(this.explosionDropBedwarsBlocksEvent()); // 令爆炸可以使自定义方块掉落
        this.system.subscribeEvent(this.playerTradeEvent()); // 玩家交易事件
        // this.system.subscribeEvent(this.worldSettingsEvent()); // 世界设置事件
        // this.system.subscribeEvent(this.killStyleSettingsEvent()); // 击杀样式设置事件
        // this.system.subscribeEvent(this.selectTeamSettingsEvent()); // 队伍选择设置事件
        // this.system.subscribeEvent(this.dreamDefenderUseEvent()); // 使用梦境守护者事件，使用后生成梦境守护者
        // this.system.subscribeEvent(this.magicMilkUseEvent()); // 使用魔法牛奶事件
        // this.system.subscribeEvent(this.waterBucketUseEvent()); // 使用水桶事件，使用后收回桶

        // 注册时间线
        this.system.subscribeTimeline(this.showGamingInfoBoardTimeline()); // 右侧记分板
        this.system.subscribeTimeline(this.applySaturationTimeline()); // 施加饱和效果
        this.system.subscribeTimeline(this.applyTeamUpgradeEffectTimeline()); // 施加团队升级效果
        this.system.subscribeTimeline(this.showPlayerHealthTimeline()); // 玩家血量显示
        if (!this.system.settings.miscellaneous.playerCanThrowItemsInVoid) this.system.subscribeTimeline(this.stopPlayerThrowItemInVoidTimeline()); // 禁止玩家在虚空扔出物品时间线

    };

    /** 离开游戏状态，仅在退出此状态时执行一次 */
    exitGamingState() {
    };

    // 实体生成检查，当对应实体生成后再触发对应的事件

    /** 当某些实体生成后，则开始对应的事件检查
     * @add 在游戏开始时创建
     */
    newEntitySpawnEvent() {
        return new BedwarsEvent(
            "newEntitySpawn",
            minecraft.world.afterEvents.entitySpawn,
            minecraft.world.afterEvents.entitySpawn.subscribe(event => {

                // 如果生成了火球，则触发对应检查事件
                if (event.entity.typeId == "bedwars:fireball" && !this.system.getEvent("fireballHitBlock")) {
                    this.system.subscribeEvent(this.fireballHitBlockEvent());
                    this.system.subscribeEvent(this.fireballHitEntityEvent());
                }
                // 如果生成了床虱，则触发对应检查事件
                else if (event.entity.typeId == "bedwars:bed_bug" && !this.system.getEvent("bedBugHitBlock")) {
                    this.system.subscribeEvent(this.bedBugHitBlockEvent());
                    this.system.subscribeEvent(this.bedBugHitEntityEvent());
                }
                // 如果生成了搭桥蛋，则触发对应检查事件
                else if (event.entity.typeId == "bedwars:bridge_egg" && !this.system.getTimeline("bridgeEggCreateBridge")) {
                    this.system.subscribeTimeline(this.bridgeEggCreateBridgeTimeline());
                }
            })
        );
    };

    /** 当某些实体消失后，则停止对应的事件检查
     * @add 在游戏开始时创建
     */
    entityRemoveEvent() {
        return new BedwarsEvent(
            "entityRemove",
            minecraft.world.afterEvents.entityRemove,
            minecraft.world.afterEvents.entityRemove.subscribe(event => {

                // 如果移除了火球，则移除对应检查事件
                if (event.typeId == "bedwars:fireball" && lib.EntityUtil.get("bedwars:fireball").length == 0) {
                    this.system.unsubscribeEvent("fireballHitBlock");
                    this.system.unsubscribeEvent("fireballHitEntity");
                }
                // 如果移除了床虱，则移除对应检查事件
                else if (event.typeId == "bedwars:bed_bug" && lib.EntityUtil.get("bedwars:bed_bug").length == 0) {
                    this.system.unsubscribeEvent("bedBugHitBlock");
                    this.system.unsubscribeEvent("bedBugHitEntity");
                }
                // 如果移除了搭桥蛋，则移除对应检查事件
                else if (event.typeId == "bedwars:bridge_egg" && lib.EntityUtil.get("bedwars:bridge_egg").length == 0) {
                    this.system.unsubscribeTimeline("bridgeEggCreateBridge");
                }
            })
        );
    };

    // 退出重进检查部分

    /** 玩家退出事件，退出后保存数据到该玩家名称的记分板下
     * @add 在游戏开始时创建
     */
    playerLeaveGameEvent() {
        return new BedwarsEvent(
            "playerLeaveGame",
            minecraft.world.beforeEvents.playerLeave,
            minecraft.world.beforeEvents.playerLeave.subscribe(event => {
                const player = event.player;
                let playerData = this.map.getBedwarsPlayer(player);
                const playerName = player.name;
                if (playerData) {

                    const teamCode = {
                        "undefined": 0,
                        red: 1,
                        blue: 2,
                        yellow: 3,
                        green: 4,
                        white: 5,
                        cyan: 6,
                        pink: 7,
                        gray: 8,
                        orange: 9,
                        brown: 10,
                        purple: 11,
                    };
                    // 在队伍中移除该队员
                    playerData.team.removePlayer(playerName);
                    // 备份数据
                    minecraft.system.run(() => {
                        // 创建记分板
                        lib.ScoreboardObjectiveUtil.add(playerName);
                        // 标记为是玩家数据
                        lib.ScoreboardPlayerUtil.set(playerName, "isPlayerData", 1);
                        // 队伍与游戏 ID 信息
                        lib.ScoreboardPlayerUtil.set(playerName, "team", teamCode[playerData.team.id]);
                        lib.ScoreboardPlayerUtil.set(playerName, "gameId", playerData.gameId);
                        // 装备信息
                        lib.ScoreboardPlayerUtil.set(playerName, "axeTier", playerData.axeTier);
                        lib.ScoreboardPlayerUtil.set(playerName, "pickaxeTier", playerData.pickaxeTier);
                        lib.ScoreboardPlayerUtil.set(playerName, "armorTier", playerData.armorTier);
                        lib.ScoreboardPlayerUtil.setBoolean(playerName, "hasShears", playerData.hasShears);
                        // 击杀信息
                        lib.ScoreboardPlayerUtil.set(playerName, "killCount", playerData.killCount);
                        lib.ScoreboardPlayerUtil.set(playerName, "finalKillCount", playerData.finalKillCount);
                        lib.ScoreboardPlayerUtil.set(playerName, "destroyBedCount", playerData.destroyBedCount);
                        // 备份完毕后，销毁该对象
                        playerData = void 0;
                        // 如果没有检查玩家重新进入的事件，创建该事件
                        if (!this.system.getEvent("playerJoinGame")) this.system.subscribeEvent(this.playerJoinGameEvent());
                    });

                };
            })
        );
    };

    /** 玩家重新进入事件，回到游戏后从玩家的记分板恢复数据
     * @add 在有玩家退出游戏后创建
     * @remove 在所有玩家回到游戏后销毁 debug 如果本来就没有玩家退出时有人进入怎么办？
     */
    playerJoinGameEvent() {
        return new BedwarsEvent(
            "playerJoinGame",
            minecraft.world.afterEvents.playerSpawn,
            minecraft.world.afterEvents.playerSpawn.subscribe(event => {

                const player = event.player;
                // 设置玩家的重生点
                player.setSpawnPoint({ dimension: minecraft.world.getDimension("overworld"), ...this.map.spawnpoint, });
                player.teleport(this.map.spawnpoint);
                // 如果玩家是退出重进的玩家，则准备恢复数据
                if (event.initialSpawn) {
                    const playerData = lib.ScoreboardObjectiveUtil.get(player.name);
                    const teamCode = {
                        1: "red",
                        2: "blue",
                        3: "yellow",
                        4: "green",
                        5: "white",
                        6: "cyan",
                        7: "pink",
                        8: "gray",
                        9: "orange",
                        10: "brown",
                        11: "purple",
                    };
                    // 如果满足以下所有条件，重新加入到队伍中：
                    // 1. 存在数据；
                    // 2. 玩家的 gameId == 游戏的 gameId（证明为同一局）
                    // 3. 玩家的队伍信息不是 0
                    if (
                        playerData &&
                        playerData.getScore("gameId") == this.system.gameId &&
                        playerData.getScore("team") != 0
                    ) {
                        // 向队伍中重新添加该玩家
                        let playerInfo = this.map.teams.find(team => team.id == teamCode[playerData.getScore("team")]).addPlayer(player);
                        // 还原玩家数据
                        playerInfo.axeTier = playerData.getScore("axeTier");
                        playerInfo.pickaxeTier = playerData.getScore("pickaxeTier");
                        playerInfo.armorTier = playerData.getScore("armorTier");
                        playerInfo.hasShears = playerData.getScore("hasShears") == 1 ? true : false;
                        playerInfo.killCount = playerData.getScore("killCount");
                        playerInfo.finalKillCount = playerData.getScore("finalKillCount");
                        playerInfo.destroyBedCount = playerData.getScore("destroyBedCount");
                        // 设置该玩家为已死亡状态，并根据玩家是否有床提示玩家能否重生
                        playerInfo.rejoined = true;
                        playerInfo.setDead();
                        if (playerInfo.team.bedIsExist) player.sendMessage({ translate: "message.playerRejoin.haveBed" });
                        else player.sendMessage({ translate: "message.playerRejoin.haveNoBed" });
                        // 如果没有玩家重生时间线，注册之以使玩家重生
                        if (!this.system.getTimeline("playerRespawn")) this.system.subscribeTimeline(this.playerRespawnTimeline());
                    }
                    // 否则，设为旁观者
                    else this.map.spectatorPlayers.push(new BedwarsPlayer(this.system, { team: undefined, player: player }))
                    // 移除备份数据记分板
                    lib.ScoreboardObjectiveUtil.remove(playerData);
                    // 如果不再有玩家数据记分板，移除该事件
                    if (!lib.ScoreboardObjectiveUtil.getAll().some(obj => lib.ScoreboardPlayerUtil.getOrSetDefault(obj.id, "isPlayerData", 0) == 1)) this.system.unsubscribeEvent("playerJoinGame");
                };
            })
        );
    };

    // 方块放置、破坏与交互部分

    /** 检查破坏床的事件
     * @add 在游戏开始时创建
     * @remove 在所有队伍的床都被摧毁或床自毁后销毁 debug
     */
    playerBreakBedEvent() {
        return new BedwarsEvent(
            "playerBreakBed",
            minecraft.world.afterEvents.playerBreakBlock,
            minecraft.world.afterEvents.playerBreakBlock.subscribe(event => {

                // 获取破坏者及其起床战争信息
                const breaker = event.player;
                const breakerData = this.map.getBedwarsPlayer(breaker);

                // 检查哪队的床被破坏了
                const team = this.map.teams.find(team => team.bedIsExist && minecraft.world.getDimension("overworld").getBlock(team.bedLocation).typeId == "minecraft:air");

                // 清除掉落物
                lib.ItemUtil.removeItemEntity("minecraft:bed");

                // 如果是杂床（不是队伍的床）则直接跳过
                if (!team) null;
                // 如果是杂玩家、旁观玩家，则还原床，警告无权限破坏床
                else if (!breakerData || !breakerData.team) {
                    this.system.warnPlayer(breaker, { translate: "message.invalidPlayer.breakingBed" });
                    team.placeBed();
                }
                // 如果是自家玩家，则还原床，警告不能破坏自家床
                else if (breakerData.team.id == team.id) {
                    this.system.warnPlayer(breaker, { translate: "message.selfTeamPlayer.breakingBed" });
                    team.placeBed();
                }
                // 否则，床被破坏
                else {

                    // 更新床的状态
                    team.bedIsExist = false;

                    // 如果该队伍在破坏床后已经没有存活玩家，则直接淘汰
                    if (team.alivePlayers.length == 0) team.setEliminated();

                    // 为破坏者添加床破坏数
                    breakerData.destroyBedCount++;

                    // 播报床被破坏
                    this.map.informBedDestroyed(team, breakerData);

                    // 如果所有队伍的床都被摧毁，销毁事件
                    if (!this.map.teams.some(otherTeam => otherTeam.bedIsExist)) this.system.unsubscribeEvent("playerBreakBed");

                };
            }, { blockTypes: ["minecraft:bed"] })
        );
    };

    /** 检查在上下限高度放置方块的事件
     * @add 在游戏开始时创建
     */
    playerPlaceBlockOnHeightLimitEvent() {
        return new BedwarsEvent(
            "playerPlaceBlockOnHeightLimit",
            minecraft.world.beforeEvents.playerInteractWithBlock,
            minecraft.world.beforeEvents.playerInteractWithBlock.subscribe(event => {

                /** 交互的玩家 */
                const player = event.player;

                // 只有当玩家为非创造模式的管理员时，执行取消代码
                if (player.getGameMode() != "Creative" || player.playerPermissionLevel < 2) {

                    /** 正在使用的方块 */
                    const block = event.block;

                    /** 正在使用的面 */
                    const blockFace = event.blockFace;

                    /** 高度上限 */
                    const heightLimitMax = this.map.heightLimitMax;

                    /** 高度下限 */
                    const heightLimitMin = this.map.heightLimitMin;

                    // 检查玩家是否在高度上限处放置方块
                    if (lib.DimensionUtil.getPlaceLocation(block, blockFace).y > heightLimitMax) {
                        event.cancel = true;
                        if (event.isFirstEvent) minecraft.system.run(() => this.system.warnPlayer(player, { translate: "message.heightLimit.max" }));
                    }
                    else if (lib.DimensionUtil.getPlaceLocation(block, blockFace).y < heightLimitMin) {
                        event.cancel = true;
                        if (event.isFirstEvent) minecraft.system.run(() => this.system.warnPlayer(player, { translate: "message.heightLimit.min" }));
                    };

                }

            })
        );
    };

    /** 检查玩家开箱事件
     * @add 在游戏开始时创建
     */
    playerOpenChestEvent() {
        return new BedwarsEvent(
            "playerOpenChest",
            minecraft.world.beforeEvents.playerInteractWithBlock,
            minecraft.world.beforeEvents.playerInteractWithBlock.subscribe(event => {
                const player = event.player;
                const block = event.block;

                // 当玩家开箱子时，进行进一步判断
                if (block.typeId == "minecraft:chest") {
                    const playerInfo = this.map.getBedwarsPlayer(player);
                    const chests = this.map.aliveTeams.flatMap(aliveTeam => aliveTeam.chestLocation);
                    const location = block.location;
                    const team = (() => {
                        const teamIndex = chests.findIndex(chest => lib.Vector3Util.isEqual(chest, location));
                        if (teamIndex >= 0) return this.map.aliveTeams[teamIndex];
                        return void 0;
                    })();
                    // 当玩家、队伍都为有效数据，且玩家队伍不等于被开箱的队伍时，则取消之
                    if (team && playerInfo && playerInfo.team.id != team.id) {
                        event.cancel = true;
                        if (event.isFirstEvent) minecraft.system.run(() => this.system.warnPlayer(player, { translate: "message.cannotOpenAliveTeamChests", with: { rawtext: [{ text: `${team.getTeamNameWithColor()}队` }] } }));
                    }

                }
            })
        )
    };

    /** 检查玩家在安全区域放置方块
     * @add 在游戏开始时创建
     */
    playerPlaceBlockOnSafeAreaEvent() {
        return new BedwarsEvent(
            "playerPlaceBlockOnSafeArea",
            minecraft.world.beforeEvents.playerInteractWithBlock,
            minecraft.world.beforeEvents.playerInteractWithBlock.subscribe(event => {

                const usingItem = event.itemStack;
                const player = event.player;
                const block = event.block;

                // 当满足以下所有条件时，阻止玩家放置方块：
                // 1. 使用的物品为有效的限制方块；
                // 2. 未对箱子使用，或潜行时对箱子使用；
                // 3. 在限制点位放置方块。
                // 
                const isLimitedBlock = (() => {
                    if (!usingItem) return false;
                    const limitedBlocks = [
                        "wool",
                        "stained_hardened_clay",
                        "blast_proof_glass",
                        "end_stone",
                        "obsidian",
                        "ladder",
                        "tnt",
                        "planks",
                        "sponge",
                        "bucket"
                    ];
                    return limitedBlocks.some(limitedBlock => usingItem.typeId.includes(limitedBlock));
                })();
                const notUsingChest = (() => {
                    const blockIsChest = ["minecraft:chest", "minecraft:ender_chest"].includes(block.typeId);
                    return !blockIsChest || (blockIsChest && player.isSneaking);
                })();
                const placingLocationInSafeArea = (() => {
                    const placingLocation = lib.DimensionUtil.getPlaceLocation(block, event.blockFace);
                    return this.map.locationInSafeArea(placingLocation);
                })();
                if (isLimitedBlock && notUsingChest && placingLocationInSafeArea) {
                    event.cancel = true;
                    minecraft.system.run(() => {
                        if (event.isFirstEvent) this.system.warnPlayer(player, { translate: "message.heightLimit.min" });
                        // 防止假水
                        if (usingItem.typeId == "minecraft:water_bucket") try {
                            block.setWaterlogged(true);
                            block.setWaterlogged(false);
                        } catch { };
                    });
                }
            })
        );
    };

    // 战斗、死亡与重生

    /** 玩家死亡事件
     * @add 在游戏开始时创建
     */
    playerDieEvent() {
        return new BedwarsEvent(
            "playerDie",
            minecraft.world.afterEvents.entityDie,
            minecraft.world.afterEvents.entityDie.subscribe(event => {

                /** 死亡玩家 @type {minecraft.Player} */
                const player = event.deadEntity;

                /** 死亡玩家的起床战争信息 */
                const playerData = this.map.getBedwarsPlayer(player);

                /** 死亡类型 */
                const deathType = event.damageSource.cause;

                /** 击杀者 */
                const killer = event.damageSource.damagingEntity;

                // 设置该玩家为已死亡状态，触发队伍淘汰甚至是游戏结束事件，并广播相关消息
                playerData?.setDead(deathType, killer);

                // 如果没有玩家重生时间线，则创建之
                if (!this.system.getTimeline("playerRespawn")) this.system.subscribeTimeline(this.playerRespawnTimeline());
                if (!this.system.getTimeline("playerInDeathState")) this.system.subscribeTimeline(this.playerInDeathStateTimeline());

            }, { entities: this.map.teams.flatMap(team => team.alivePlayers.flatMap(alivePlayer => alivePlayer.player)) })
        );
    };

    /** 检查被玩家攻击事件
     * @add 在游戏开始时创建
     */
    playerHurtByPlayerEvent() {
        return new BedwarsEvent(
            "playerHurtByPlayer",
            minecraft.world.afterEvents.entityHurt,
            minecraft.world.afterEvents.entityHurt.subscribe(event => {

                /** 受伤玩家 */
                const player = event.hurtEntity;

                /** 伤害玩家 */
                const damager = event.damageSource.damagingEntity;

                /** 受伤玩家的起床战争信息 */
                const playerData = this.map.getBedwarsPlayer(player);

                /** 伤害玩家的起床战争信息 */
                const damagerData = this.map.getBedwarsPlayer(damager);

                // 如果受伤，检查伤害者是否正常，正常则记录伤害者，并开始计时，同时撤销隐身玩家的盔甲隐藏状态
                if (damagerData && damagerData.team) {
                    playerData.beAttacked(damager);
                    if (!this.system.getTimeline("playerAttackedTimer")) this.system.subscribeTimeline(this.playerAttackedTimerTimeline());
                }

            }, { entities: this.map.teams.flatMap(team => team.alivePlayers.flatMap(alivePlayer => alivePlayer.player)) })
        );
    };

    /** 对正在被攻击期间的玩家计时
     * @add 在有玩家被攻击后创建
     * @remove 无被攻击玩家时销毁
     */
    playerAttackedTimerTimeline() {
        return new BedwarsTimeline(
            "playerAttackedTimer",
            minecraft.system.runInterval(() => {

                // 查找所有被攻击的玩家，让他们每秒计时，10 秒后恢复为未被攻击状态
                let attackedPlayers = this.map.teams.flatMap(team => team.players.filter(playerData => playerData.timeSinceLastAttack < 10));
                attackedPlayers.forEach(attackedPlayer => {
                    attackedPlayer.timeSinceLastAttack++;
                    if (attackedPlayer.timeSinceLastAttack >= 10) attackedPlayer.resetAttackedInfo();
                });

                // 如果不再存在被攻击玩家，销毁该时间线
                if (attackedPlayers.length == 0) this.system.unsubscribeTimeline("playerAttackedTimer");

            }, 20)
        );
    };

    /** 火球击中方块事件
     * @add 在生成火球后创建
     * @remove 在无火球时销毁
     */
    fireballHitBlockEvent() {
        return new BedwarsEvent(
            "fireballHitBlock",
            minecraft.world.afterEvents.projectileHitBlock,
            minecraft.world.afterEvents.projectileHitBlock.subscribe(event => {
                if (event.projectile.typeId == "bedwars:fireball") this.playerHurtByFireball(event);
            })
        );
    };

    /** 火球击中实体事件
     * @add 在生成火球后创建
     * @remove 在无火球时销毁
     */
    fireballHitEntityEvent() {
        return new BedwarsEvent(
            "fireballHitEntity",
            minecraft.world.afterEvents.projectileHitEntity,
            minecraft.world.afterEvents.projectileHitEntity.subscribe(event => {
                if (event.projectile.typeId == "bedwars:fireball") this.playerHurtByFireball(event);
            })
        );
    };

    /** 火球击中后执行的内容
     * @param {minecraft.ProjectileHitEntityAfterEvent | minecraft.ProjectileHitBlockAfterEvent} event 
     */
    playerHurtByFireball(event) {

        // 检查火球是否有有效的掷出者，有的话则执行代码
        const thrower = event.source;
        const throwerData = this.map.getBedwarsPlayer(thrower);
        if (throwerData) {
            // 令火球附近的玩家执行代码，如果受伤，检查伤害者是否正常，正常则记录伤害者，并开始计时，同时撤销隐身玩家的盔甲隐藏状态
            lib.PlayerUtil.getNearby(event.location, 4).forEach(player => {
                const playerData = this.map.getBedwarsPlayer(player);
                if (playerData && playerData.team.id != throwerData.team.id) {
                    playerData.beAttacked(thrower);
                    if (!this.system.getTimeline("playerAttackedTimer")) this.system.subscribeTimeline(this.playerAttackedTimerTimeline());
                }
            });
        }

    };

    /** 玩家进入虚空事件
     * @add 在游戏开始时创建
     */
    playerFellIntoVoidEvent() {
        return new BedwarsEvent(
            "playerFellIntoVoid",
            minecraft.world.afterEvents.entityHurt,
            minecraft.world.afterEvents.entityHurt.subscribe(event => {
                if (event.damageSource.cause == "void") event.hurtEntity.applyDamage(200, { cause: "void" });
            }, { entityTypes: ["minecraft:player"] })
        );
    };

    /** 玩家重生时间线
     * @add 在有本局未淘汰玩家重新进入游戏时、或有玩家死亡时创建
     * @remove 在不存在死亡玩家时销毁
     */
    playerRespawnTimeline() {
        return new BedwarsTimeline(
            "playerRespawn",
            minecraft.system.runInterval(() => {

                /** 正处于死亡状态且重生倒计时大于 0 的玩家 */
                const respawningPlayers = this.map.teams.flatMap(team => team.alivePlayers.filter(alivePlayer => alivePlayer.respawnTime > 0));

                // 进行重生倒计时
                respawningPlayers.forEach(respawningPlayer => {
                    respawningPlayer.respawnTime--;
                    if (respawningPlayer.respawnTime > 0) {
                        lib.PlayerUtil.setTitle(respawningPlayer.player, { translate: "title.respawning" }, { translate: "subtitle.respawning", with: [`${respawningPlayer.respawnTime}`] }, { fadeInDuration: 0 });
                        respawningPlayer.player.sendMessage({ translate: "message.respawning", with: [`${respawningPlayer.respawnTime}`] });
                    }
                    if (respawningPlayer.respawnTime == 0) {
                        respawningPlayer.respawn();
                    };
                });

                // 如果不存在死亡玩家，则销毁时间线
                if (respawningPlayers.length == 0) this.system.unsubscribeTimeline("playerRespawn");

            }, 20)
        );
    };

    /** 玩家处于死亡状态时的时间线
     * @description 可能会有一部分玩家在死亡后卡在聊天栏等，不重生，导致一系列问题，所以专门针对这种情况打补丁
     */
    playerInDeathStateTimeline() {
        return new BedwarsTimeline(
            "playerInDeathState",
            minecraft.system.runInterval(() => {

                // 检查所有持续死亡时间不为 -1 的玩家
                const keepDeathPlayers = this.map.teams.flatMap(team => team.alivePlayers).filter(keepDeathPlayer => keepDeathPlayer.keepDeathTime >= 0);
                keepDeathPlayers.forEach(keepDeathPlayer => {
                    const player = keepDeathPlayer.player; // 持续死亡时间的玩家
                    const isDead = player.getComponent("minecraft:health").currentValue <= 0; // 该玩家是否处于死亡状态

                    // 如果玩家处于死亡状态，此时没有床并且还没有重生，则进行死亡计时并在 5 秒后淘汰该玩家
                    if (isDead && !keepDeathPlayer.team.bedIsExist && !keepDeathPlayer.isDead) {
                        if (keepDeathPlayer.keepDeathTime >= 0 && keepDeathPlayer.keepDeathTime <= 4) {
                            player.sendMessage(`§c§l请立即回到游戏！否则你将在${5 - keepDeathPlayer.keepDeathTime}秒后被淘汰！`);
                            player.playSound("mob.cat.meow");
                        }
                        else if (keepDeathPlayer.keepDeathTime >= 5) keepDeathPlayer.setDead();
                        keepDeathPlayer.keepDeathTime++;
                    }
                    // 其他玩家（死亡计时为 0）复活后，重新指定死亡时间
                    else if (!isDead) {

                        keepDeathPlayer.keepDeathTime = -1;

                        // 如果玩家重生后在重生点附近，则重新重生
                        if (lib.EntityUtil.isNearby(player, this.map.spawnpoint, 2) && player.getGameMode() == "Survival") keepDeathPlayer.respawn();
                    };

                })

                // 如果没有正处于死亡状态的玩家，移除本时间线
                if (keepDeathPlayers.length == 0) this.system.unsubscribeTimeline("playerInDeathState");
            }, 20)
        );
    };

    // 交易

    /** 玩家与商人交互事件（开始交易）
     * @add 在游戏开始时创建
     */
    playerTradeEvent() {
        return new BedwarsEvent(
            "playerTrade",
            minecraft.world.afterEvents.playerInteractWithEntity,
            minecraft.world.afterEvents.playerInteractWithEntity.subscribe(event => {
                const trader = event.target;
                const traderData = this.map.getTrader(trader);
                const player = event.player;
                const playerData = this.map.getBedwarsPlayer(player);
                if (traderData && playerData) {
                    traderData.interacted(player, playerData);
                    if (!this.system.getTimeline("playerTrading")) this.system.subscribeTimeline(this.playerTradingTimeline());
                }
            })
        );
    };

    /** 玩家交易过程时间线
     * @add 在有玩家和商人交互后创建
     * @remove 在没有玩家和商人交易时销毁 debug
     * @highFrequency 该方法会每游戏刻执行代码
     */
    playerTradingTimeline() {
        return new BedwarsTimeline(
            "playerTrading",
            minecraft.system.runInterval(() => {
                this.map.tradingTraders.forEach(tradingTrader => {
                    // 对于物品商人，执行物品商人的代码
                    if (tradingTrader.type == "item") {
                        /** @type {BedwarsItemTrader} */ const itemTrader = tradingTrader;
                        itemTrader.categoryChangeTest();
                        itemTrader.itemChangeTest();
                    }
                    // 对于团队升级商人，执行团队升级商人的代码
                    else {

                    };

                    // 如果玩家的视角改变超过 5°，或者玩家和商人之间的距离大于 5 格，则移除物品商人
                    const currentRotation = tradingTrader.player.getRotation();
                    const tradingRotation = tradingTrader.playerInfo.tradeInfo.rotation;
                    if (
                        Math.abs(currentRotation.x - tradingRotation.x) > 5
                        || Math.abs(currentRotation.y - tradingRotation.y) > 5
                        || lib.Vector3Util.distance(tradingTrader.trader.location, tradingTrader.player.location) > 5
                    ) {
                        tradingTrader.playerInfo.unlockAllItems();
                        tradingTrader.playerInfo.tradeInfo.trader = void 0;
                        tradingTrader.playerInfo.tradeInfo.rotation = void 0;
                        this.map.removeTrader(tradingTrader.trader);
                    }
                });
                if (this.map.tradingTraders.length == 0) this.system.unsubscribeTimeline("playerTrading");
            })
        )
    };

    // 爆炸

    /** 放置 TNT 则立刻点燃事件
     * @add 在游戏开始时创建
     */
    igniteTntImmediatelyEvent() {
        return new BedwarsEvent(
            "igniteTntImmediately",
            minecraft.world.afterEvents.playerPlaceBlock,
            minecraft.world.afterEvents.playerPlaceBlock.subscribe(event => {
                lib.DimensionUtil.setBlock(event.dimension.id, event.block.location, "minecraft:air");
                lib.EntityUtil.add("minecraft:tnt", lib.Vector3Util.center(event.block.location));
            }, { blockTypes: ["bedwars:tnt"] })
        );
    };

    /** 阻止爆炸破坏方块
     * @add 在游戏开始时创建
     */
    stopExplosionBreakBlockEvent() {
        return new BedwarsEvent(
            "stopExplosionBreakBlock",
            minecraft.world.beforeEvents.explosion,
            minecraft.world.beforeEvents.explosion.subscribe(event => {
                const breakableVanillaBlocks = [
                    "minecraft:ladder",
                    "minecraft:sponge",
                    "minecraft:wet_sponge"
                ];
                const impactedBlocks = event.getImpactedBlocks();
                event.setImpactedBlocks(impactedBlocks.filter(block => !block.typeId.includes("minecraft:") || breakableVanillaBlocks.includes(block.typeId)));
            })
        );
    };

    /** 令爆炸可以使自定义方块掉落事件
     * @add 在游戏开始时创建
     */
    explosionDropBedwarsBlocksEvent() {
        return new BedwarsEvent(
            "explosionDropBedwarsBlocks",
            minecraft.world.beforeEvents.explosion,
            minecraft.world.beforeEvents.explosion.subscribe(event => {
                const lootBlocks = [
                    "bedwars:end_stone",
                    "bedwars:red_stained_hardened_clay",
                    "bedwars:blue_stained_hardened_clay",
                    "bedwars:yellow_stained_hardened_clay",
                    "bedwars:green_stained_hardened_clay",
                    "bedwars:pink_stained_hardened_clay",
                    "bedwars:cyan_stained_hardened_clay",
                    "bedwars:white_stained_hardened_clay",
                    "bedwars:gray_stained_hardened_clay",
                    "bedwars:purple_stained_hardened_clay",
                    "bedwars:brown_stained_hardened_clay",
                    "bedwars:orange_stained_hardened_clay"
                ];
                const dropBlocks = event.getImpactedBlocks().filter(block => {
                    // 如果是 TNT 炸毁的方块，且 TNT 完全掉落开关已打开，则设置为 100% 的掉落，否则为 33% 的掉落
                    if (!minecraft.world.gameRules.tntExplosionDropDecay && event.source.typeId === "minecraft:tnt") return lootBlocks.includes(block.typeId);
                    else return lootBlocks.includes(block.typeId) && Math.random() < 0.33;
                }).map(block => ({ id: block.typeId, location: block.location }));
                minecraft.system.run(() => dropBlocks.forEach(block => lib.ItemUtil.spawnItem(block.location, block.id, {}, false)));

            })
        );
    };

    /** 爆炸对附近实体施加动量 */
    applyMomentumEvent() {
        // debug
    };

    // 道具

    /** 玩家吃下金苹果事件，控制金苹果的伤害吸收效果最多维持两颗黄心
     * @add 在游戏开始时创建
     */
    playerEatGoldenAppleEvent() {
        return new BedwarsEvent(
            "playerEatGoldenApple",
            minecraft.world.afterEvents.itemCompleteUse,
            minecraft.world.afterEvents.itemCompleteUse.subscribe(event => {
                const item = event.itemStack;
                const player = event.source;
                if (item.typeId == "minecraft:golden_apple") {
                    player.removeEffect("absorption");
                    player.addEffect("absorption", 2400);
                };
            })
        );
    };

    /** 玩家喝下药水事件
     * @add 在游戏开始时创建
     */
    playerDrinkPotionEvent() {
        return new BedwarsEvent(
            "playerDrinkPotion",
            minecraft.world.afterEvents.itemCompleteUse,
            minecraft.world.afterEvents.itemCompleteUse.subscribe(event => {
                const item = event.itemStack;
                const player = event.source;
                if (item.typeId == "bedwars:potion_jump_boost") player.addEffect("jump_boost", 900, { amplifier: 4 });
                else if (item.typeId == "bedwars:potion_speed") player.addEffect("speed", 900, { amplifier: 1 });
                else if (item.typeId == "bedwars:potion_invisibility") {
                    player.addEffect("invisibility", 600, { amplifier: 0 });
                    player.triggerEvent("hide_armor");
                }
            })
        );
    };

    /** 床虱击中方块事件，击中后生成床虱
     * @add 在生成床虱雪球后创建
     * @remove 在无床虱雪球时销毁
     */
    bedBugHitBlockEvent() {
        return new BedwarsEvent(
            "bedBugHitBlock",
            minecraft.world.afterEvents.projectileHitBlock,
            minecraft.world.afterEvents.projectileHitBlock.subscribe(event => this.summonBedBug(event))
        )
    };

    /** 床虱击中实体事件，击中后生成床虱
     * @add 在生成床虱雪球后创建
     * @remove 在无床虱雪球时销毁
     */
    bedBugHitEntityEvent() {
        return new BedwarsEvent(
            "bedBugHitEntity",
            minecraft.world.afterEvents.projectileHitEntity,
            minecraft.world.afterEvents.projectileHitEntity.subscribe(event => this.summonBedBug(event))
        )

    };

    /** 床虱计时器，用于设定床虱的名字和倒计时
     * @add 在生成床虱后创建
     * @remove 在床虱全部消灭后销毁
     */
    bedBugCountdownTimeline() {
        return new BedwarsTimeline(
            "bedBugCountdown",
            minecraft.system.runInterval(() => {
                const silverfishes = lib.EntityUtil.get("minecraft:silverfish").filter(silverfish => silverfish.killTimer != undefined);
                // 对床虱计时并设定名称，倒计时结束后则杀死之
                silverfishes.forEach(silverfish => {
                    silverfish.killTimer++;
                    silverfish.nameTag = `§8[§r${silverfish.team.getTeamColor()}${silverfish.nameSetter()}§8]\n§l${silverfish.team.getTeamNameWithColor()}队 §r${silverfish.team.getTeamColor()}蠹虫`;
                    if (silverfish.killTimer >= 15) silverfish.kill();
                });
                // 若之后不再存在任何床虱，销毁时间线
                if (silverfishes.length == 0) this.system.unsubscribeTimeline("bedBugCountdown");
            }, 20)
        );
    };

    /** 生成床虱，并添加对应队伍的起床战争信息
     * @param {minecraft.ProjectileHitEntityAfterEvent | minecraft.ProjectileHitBlockAfterEvent} event 
     */
    summonBedBug(event) {
        if (event.projectile.typeId == "bedwars:bed_bug") {

            // 生成床虱（蠹虫）
            let silverfish = event.dimension.spawnEntity("minecraft:silverfish", event.location);

            // 添加对应的起床战争信息
            let player = event.source;
            let playerInfo = this.map.getBedwarsPlayer(player);
            if (playerInfo && playerInfo.team) {
                silverfish.team = playerInfo.team;
                silverfish.triggerEvent(`team_${playerInfo.team.id}`);
                silverfish.killTimer = 0;
                silverfish.owner = player;
                silverfish.nameSetter = () => {
                    const index = Math.floor(silverfish.killTimer / 3);
                    const bars = "■■■■■";
                    const timePassedColor = silverfish.team.id === "gray" ? "§8" : "§7";
                    if (index >= 0 && index <= 4) {
                        return bars.slice(0, 5 - index) + timePassedColor + bars.slice(5 - index);
                    }
                    return `${timePassedColor}■■■■■`;
                };
                silverfish.nameTag = `§8[§r${silverfish.team.getTeamColor()}${silverfish.nameSetter()}§8]\n§l${silverfish.team.getTeamNameWithColor()}队 §r${silverfish.team.getTeamColor()}蠹虫`;
            };

            // 当没有床虱时间线时，触发床虱时间线
            if (this.system.getTimeline("bedBugCountdown") == undefined) this.system.subscribeTimeline(this.bedBugCountdownTimeline());

        };
    };

    /** 使用梦境守护者事件，使用后生成梦境守护者
     * @add 在游戏开始时创建 debug
     */
    dreamDefenderUseEvent() {
        // debug
    };

    /** 梦境守护者计时器，用于设定梦境守护者的名字和倒计时
     * @add 在生成梦境守护者后创建
     * @remove 在梦境守护者全部消灭后销毁
     */
    dreamDefenderCountdownTimeline() {
        // debug
    };

    /** 使用魔法牛奶事件
     * @add 在游戏开始时创建 debug
     */
    magicMilkUseEvent() {
        // debug
    };

    /** 魔法牛奶倒计时时间线
     * @add 在有玩家使用魔法牛奶后创建 debug
     * @remove 在所有玩家魔法牛奶均过倒计时后销毁 debug
     */
    magicMilkCountdownTimeline() {
        // debug
    };

    /** 搭桥蛋搭桥时间线
     * @add 在生成搭桥蛋后创建
     * @remove 在无搭桥蛋时销毁
     * @highFrequency 该方法会每游戏刻执行代码
     */
    bridgeEggCreateBridgeTimeline() {
        return new BedwarsTimeline(
            "bridgeEggCreateBridge",
            minecraft.system.runInterval(() => {
                lib.EntityUtil.get("bedwars:bridge_egg").forEach(bridgeEgg => {
                    // 如果超界，则直接移除搭桥蛋
                    const outOfBorder = this.map.projectileOutOfBorder(bridgeEgg, -5);
                    if (outOfBorder) return;
                    // 如果搭桥蛋的掷出者有队伍信息，按照 60% 的完整度，在不放置在安全区的情况下，每游戏刻创建一个桥面，并播放音效
                    const color = this.map.getBedwarsPlayer(bridgeEgg.getComponent("minecraft:projectile").owner)?.team?.id;
                    if (color) {
                        for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) {
                            const placingLocation = lib.Vector3Util.add(bridgeEgg.location, x, -2, z);
                            if (Math.random() <= 0.60 && !this.map.locationInSafeArea(placingLocation)) {
                                lib.DimensionUtil.replaceBlock(bridgeEgg.dimension.id, placingLocation, placingLocation, ["minecraft:air"], `bedwars:${color}_wool`);
                            };
                        }
                        lib.PlayerUtil.getAll().forEach(player => player.playSound("random.pop", { location: bridgeEgg.location }));
                    }
                    // 如果搭桥蛋的掷出者没有队伍信息，移除搭桥蛋
                    else bridgeEgg.remove();
                });
            })
        );
    };

    /** 水桶收桶事件
     * @add 在游戏开始时创建 debug
     */
    waterBucketUseEvent() {
        // debug
    };

    /** 移除过界末影珍珠时间线
     * @add 在生成末影珍珠后创建 debug
     * @remove 在无末影珍珠时销毁 debug
     * @highFrequency 该方法会每游戏刻执行代码
     */
    removeEnderPearlTimeline() {

    };

    /** 弓箭击中事件
     * @add 在生成箭后创建 debug
     * @remove 在无箭时销毁 debug
     */
    arrowHitEntityEvent() {
        // debug
    };

    // 其他杂项内容

    /** 团队升级时间线
     * @add 在游戏开始时创建
     */
    applyTeamUpgradeEffectTimeline() {
        return new BedwarsTimeline(
            "applyTeamUpgradeEffect",
            minecraft.system.runInterval(() => {
                this.map.aliveTeams.forEach(aliveTeam => {
                    if (aliveTeam.teamUpgrades.maniacMiner > 0)
                        aliveTeam.alivePlayers.forEach(alivePlayer => alivePlayer.player.addEffect("haste", 600, aliveTeam.teamUpgrades.maniacMiner - 1));
                    if (aliveTeam.teamUpgrades.healPool)
                        aliveTeam.alivePlayers.filter(alivePlayer => lib.EntityUtil.isNearby(alivePlayer.player, aliveTeam.spawnpointLocation, this.map.healPoolRadius)).forEach(alivePlayer => alivePlayer.player.addEffect("regeneration", 100));
                });
            }, 60)
        );
    };

    /** 玩家血量显示时间线
     * @add 在游戏开始时创建
     * @highFrequency 该方法会每游戏刻执行代码
     */
    showPlayerHealthTimeline() {
        return new BedwarsTimeline(
            "showPlayerHealth",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => lib.ScoreboardPlayerUtil.set("health", player, Math.floor(player.getComponent("health").currentValue)));
            })
        );
    };

    /** 禁止玩家在虚空扔出物品时间线
     * @add 在游戏开始时创建（仅限设置：不允许玩家在虚空扔物品时创建）
     * @highFrequency 该方法会每游戏刻执行代码
     */
    stopPlayerThrowItemInVoidTimeline() {
        return new BedwarsTimeline(
            "stopPlayerThrowItemInVoid",
            minecraft.system.runInterval(() => {
                const alivePlayers = this.map.aliveTeams.flatMap(aliveTeam => aliveTeam.alivePlayers)
                alivePlayers.forEach(alivePlayer => {
                    const player = alivePlayer.player;
                    const { x, y, z } = player.location;
                    // 如果，玩家脚下全是空气，并且正在掉落中，则锁定物品
                    if (!player.dimension.getTopmostBlock({ x, z }, y) && player.isFalling) {
                        alivePlayer.lockAllItems();
                    }
                    // 否则可以解锁物品，但不能正处于交易状态
                    else if (!alivePlayer.tradeInfo.trader) {
                        alivePlayer.unlockAllItems();
                    }
                });
            })
        );
    }

    // ===== 结束状态 =====

    /** 进入结束状态，仅在进入此状态时执行一次 */
    entryGameOverState() {

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
        // this.system.subscribeEvent(this.worldSettingsEvent()); // 世界设置事件
        // this.system.subscribeEvent(this.killStyleSettingsEvent()); // 击杀样式设置事件
        // this.system.subscribeEvent(this.selectTeamSettingsEvent()); // 队伍选择设置事件

        // 注册时间线
        this.system.subscribeTimeline(this.applySaturationTimeline()); // 施加饱和效果
        this.system.subscribeTimeline(this.applyResistanceTimeline()); // 施加抗性提升效果

    };

    /** 离开结束状态，仅在退出此状态时执行一次 */
    exitGameOverState() {
    };

    /** 结束后施加抗性提升状态效果 */
    applyResistanceTimeline() {
        return new BedwarsTimeline(
            "applyResistance",
            minecraft.system.runInterval(() => {
                lib.PlayerUtil.getAll().forEach(player => player.addEffect("resistance", 110, { amplifier: 9, showParticles: false }));
            }, 20)
        );
    };


};

/** 夺点模式起床战争的相关函数和方法，继承自经典模式起床战争 */
class BedwarsCaptureMode extends BedwarsClassicMode {

    /** 系统类型 */
    type = "capture";

    constructor() {
        super();
    };

};

// ===== 地图 =====
// 地图负责存储该地图内的特殊信息。
// 例如：岛屿位置、商人位置、钻石或绿宝石生成点的位置等。
// 同时，地图规定了一张地图最多有多少队伍。

// --- 商店物品 ---

class BedwarsShopitem {
    
    // ===== 系统和玩家数据 =====

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 玩家的起床战争信息 @type {BedwarsPlayer} */
    player;

    /** 玩家的队伍信息 @type {BedwarsTeam} */
    team;

    // ===== 描述 =====

    /** 商店物品类别 */
    category = "";

    /** 描述 @type {string[]} */
    description = [];

    // ===== 组件 =====

    /** 要购买此物品的资源类型 @type {data.ResourceType} */
    resourceType = data.ResourceType.iron;

    /** 要购买此资源的资源消耗数 */
    resourceAmount = 1;

    /** 物品数量，决定显示在商店内的物品数量和给予玩家的物品数量 */
    amount = 1;

    /** 物品等级 @type {number} */
    tier = 0;

    // ===== 其它参数 =====

    /** 玩家是否有足够的资源 */
    resourceNeeded = 0;

    /**
     * @param {BedwarsSystem} system 
     * @param {BedwarsPlayer} playerInfo 
     */
    constructor(system, playerInfo) {
        this.system = system;
        this.player = playerInfo;
        this.team = playerInfo.team;
    };

    /** 获取资源的 typeId */
    getResourceTypeId() {
        switch (this.resourceType) {
            case data.ResourceType.iron: default: return "bedwars:iron_ingot";
            case data.ResourceType.gold: return "bedwars:gold_ingot";
            case data.ResourceType.diamond: return "bedwars:diamond";
            case data.ResourceType.emerald: return "bedwars:emerald";
        }
    };

    /** 获取资源的名称 */
    getResourceName() {
        switch (this.resourceType) {
            case data.ResourceType.iron: default: return "铁锭";
            case data.ResourceType.gold: return "金锭";
            case data.ResourceType.diamond: return "钻石";
            case data.ResourceType.emerald: return "绿宝石";
        }
    };

    /** 检查玩家还需要多少资源 */
    getResourceNeeded() {
        const playerResourceAmount = lib.InventoryUtil.hasItemAmount(this.player.player, this.getResourceTypeId())
        this.resourceNeeded = this.resourceAmount - playerResourceAmount;
        if (this.resourceNeeded <= 0) this.resourceNeeded = 0;
        return this.resourceNeeded;
    };

    /** 物品在商店内的备注信息
     * @abstract
     */
    getLore() {};

    /** 商店物品的购买检查，只有在检查该物品满足购买条件后才能购买，返回是否成功购买
     * @abstract
     */
    purchaseTest() {};

    /** 成功购买物品时的函数
     * @abstract
     */
    purchaseSuccess() {};

};

/** 物品类商店物品，在接受商店物品后进行数据操作，并提供商店物品相关方法 */
class BedwarsItemShopitem extends BedwarsShopitem {

    // ===== 描述 =====

    /** 商店物品类别 @type {data.ShopitemCategory} */
    category = data.ShopitemCategory.blocks;

    /** 是否为快速购买物品 */
    isQuickBuy = false;

    /** 该物品是否为镐子，如是则记录镐子等级，不直接给予物品 */
    isPickaxe = false;

    /** 该物品是否为斧头，如是则记录斧头等级，不直接给予物品 */
    isAxe = false;

    /** 该物品是否为盔甲，如是则记录盔甲等级，不直接给予物品 */
    isArmor = false;

    /** 该物品是否为剪刀，如是则记录剪刀等级，不直接给予物品 */
    isShears = false;

    // ===== 组件 =====

    /** 商店物品 ID */
    id = "";

    /** 按照何种物品 ID 给予物品 */
    itemId = "";

    /** 附魔 @type {lib.EnchantmentInfo[]} */
    enchantment = [];

    /** 是否显示物品的等级 */
    showCurrentTier = false;

    /** 物品是否会降级，同时也会显示当前的物品等级 */
    loseTierUponDeath = false;

    /** 购买此物品后将移除哪些物品 @type {string[]} */
    removeItem = [];

    /** 给予该物品后的 lore 信息 @type {string[]} */
    itemLore = [];

    /**
     * @param {BedwarsSystem} system
     * @param {BedwarsPlayer} playerInfo
     * @param {data.BedwarsItemShopitemInfo} info
     */
    constructor(system, playerInfo, info) {

        // ===== 继承类 =====
        super(system, playerInfo);

        // ===== 描述部分解析 =====
        this.category = info.description.category;
        if (info.description.description) this.description = info.description.description;
        if (info.description.isQuickBuy) this.isQuickBuy = info.description.isQuickBuy;
        if (info.description.isPickaxe) this.isPickaxe = info.description.isPickaxe;
        if (info.description.isAxe) this.isAxe = info.description.isAxe;
        if (info.description.isArmor) this.isArmor = info.description.isArmor;
        if (info.description.isShears) this.isShears = info.description.isShears;

        // ===== 组件部分解析 =====

        /** 待解析的组件 @type {data.BedwarsItemShopitemComponent} */
        const component = (() => {
            // 如果是单物品，直接返回单物品组件
            if (info.description.format == "item") return info.component;
            // 否则，为多物品组件，找到该玩家的对应物品升级的等级 == tier - 1 的物品组件，如果都找不到则直接返回最后一个组件
            else return info.components.find(comp => {
                if (info.description.isAxe) return playerInfo.axeTier == comp.tier.tier - 1;
                else if (info.description.isPickaxe) return playerInfo.pickaxeTier == comp.tier.tier - 1;
                return false;
            }) ?? info.components[info.components.length - 1]
        })();

        // 物品 ID 和数量
        this.id = component.id;
        this.amount = component.amount;

        // 资源类型和资源数量
        this.resourceType = component.resource.type;
        this.resourceAmount = component.resource.amount;
        if (component.resource.amountInSolo && system.mode.map.isSolo) this.resourceAmount = component.resource.amountInSolo;

        // 指定实际给予的物品 ID
        this.itemId = `bedwars:${this.id}`
        if (component.realItemId?.isVanilla) this.itemId = `minecraft:${this.id}`;
        if (component.realItemId?.isColored) this.itemId = `bedwars:${this.team.id}_${this.id}`;
        if (component.realItemId?.id) this.itemId = component.realItemId.id;

        // 等级
        if (component.tier?.tier) this.tier = component.tier.tier;
        if (component.tier?.showCurrentTier) this.showCurrentTier = component.tier.showCurrentTier;
        if (component.tier?.loseTierUponDeath) this.loseTierUponDeath = component.tier.loseTierUponDeath;

        // 附魔
        if (component.enchantment?.list) this.enchantment.push(...component.enchantment.list);
        if (component.enchantment?.applySharpness && this.team.teamUpgrades.sharpenedSwords) this.enchantment.push({ id: "sharpness", level: 1 });
        if (component.enchantment?.applyFeatherFalling && this.team.teamUpgrades.cushionedBoots) this.enchantment.push({ id: "feather_falling", level: playerInfo.team.teamUpgrades.cushionedBoots });

        // 备注
        if (component.lore) this.itemLore = component.lore;

        // 移除物品
        if (component.removeItem) this.removeItem = component.removeItem;

    };

    /** 物品在商店内的备注信息
     * @override
     */
    getLore() {

        const cost = (() => {
            if (this.resourceType == data.ResourceType.iron) return `§f${this.resourceAmount} 铁锭`;
            else if (this.resourceType == data.ResourceType.gold) return `§6${this.resourceAmount} 金锭`;
            else if (this.resourceType == data.ResourceType.diamond) return `§b${this.resourceAmount} 钻石`;
            else return `§2${this.resourceAmount} 绿宝石`;
        })();

        let lore = [
            `§r§7花费： ${cost}`,
        ];
        if (this.showCurrentTier) lore.push(
            `§r§7等级： §e${lib.JSUtil.intToRoman(this.tier)}`,
            "",
            "§r§7该道具可升级。",
        );
        if (this.loseTierUponDeath) lore.push(
            "§r§7死亡将会导致损失一级！",
            "",
            "§r§7每次重生时，至少为最低等级。"
        );
        if (this.description.length > 0) lore.push(
            "",
            ...this.description.map(text => `§r§7${text}`)
        );
        if (this.getResourceNeeded() > 0) lore.push(
            "",
            `§r§c你没有足够的${this.getResourceName()}！`
        ); else lore.push(
            "",
            `§r§e点击购买！`
        );
        return lore;
    };

    /** 商店物品的购买检查，只有在检查该物品满足购买条件后才能购买，返回是否成功购买
     * @override
     */
    purchaseTest() {
        const player = this.player.player;

        // 如果符合以下条件，则阻止购买并提示玩家已获取此物品：
        // 1. 是镐子，检查镐子等级，若玩家等级非 tier - 1 则阻止购买
        // 2. 是斧头，检查斧头等级，若玩家等级非 tier - 1 则阻止购买
        // 3. 是盔甲，检查盔甲等级，若玩家等级大于等于 tier 则阻止购买
        // 4. 是剪刀，检查剪刀等级，若玩家有剪刀则阻止购买
        if (
            (this.isPickaxe && this.player.pickaxeTier != this.tier - 1)
            || (this.isAxe && this.player.axeTier != this.tier - 1)
            || (this.isArmor && this.player.armorTier >= this.tier)
            || (this.isShears && this.player.hasShears)
        ) {
            this.system.warnPlayer(player, { translate: `message.alreadyGotItem` });
            return false;
        }
        // 如果购买永久性物品（镐子、斧头、剪刀）时玩家没有空余空间，阻止购买
        else if (
            (this.isPickaxe || this.isAxe || this.isShears)
            && player.getComponent("minecraft:inventory").container.emptySlotsCount == 0
        ) {
            this.system.warnPlayer(player, { translate: `message.inventoryFull` });
            return false;
        }
        // 如果玩家资源不足，返回还需要多少资源
        else if (this.getResourceNeeded() > 0) {
            this.system.warnPlayer(player, { translate: `message.resourceNotEnough`, with: { rawtext: [{ translate: `item.${this.getResourceTypeId()}` }, { translate: `item.${this.getResourceTypeId()}` }, { text: `${this.resourceNeeded}` }] } });
            return false;
        }
        // 其他情况则允许购买，清除资源并提示玩家已购买
        else {
            lib.ItemUtil.removeItem(player, this.getResourceTypeId(), -1, this.resourceAmount);
            player.playSound("note.pling", { pitch: 2, location: player.location });
            player.sendMessage({ translate: `message.purchaseItemsSuccessfully`, with: { rawtext: [{ translate: `message.bedwars:shopitem_${this.id}` }] } });
            this.purchaseSuccess();
            return true;
        }
    };

    /** 成功购买物品时的函数
     * @override
     */
    purchaseSuccess() {
        const player = this.player.player;
        const playerData = this.player;
        // 移除已指定了的物品
        this.removeItem.forEach(itemId => lib.ItemUtil.removeItem(player, itemId));

        // 对于镐子、斧头、盔甲、剪刀（永久物品），更改状态并通过玩家数据给予
        if (this.isPickaxe) { playerData.pickaxeTier++; playerData.givePickaxe(); }
        else if (this.isAxe) { playerData.axeTier++; playerData.giveAxe(); }
        else if (this.isArmor) { playerData.armorTier = this.tier; playerData.giveArmor(); }
        else if (this.isShears) { playerData.hasShears = true; playerData.giveShears(); }
        // 对于其他物品，直接给予物品
        else lib.ItemUtil.giveItem(player, this.itemId, { amount: this.amount, itemLock: "inventory", enchantments: this.enchantment, lore: this.itemLore });
    };

};

/** 团队升级类商店物品，在接受商店物品后进行数据操作，并提供商店物品相关方法 */
class BedwarsUpgradeShopitem extends BedwarsShopitem {

    // ===== 描述 =====

    /** 商店物品类别 @type {"upgrade"|"trap"} */
    category = "upgrade";

    // ===== 组件 =====

    /** 商店物品 ID */
    shopitemId = "";

    /** 在购买此物品时，检查何种团队升级的等级 */
    checkUpgradeTier = "";

    /** 所有等级的描述 @type {string[]} */
    allTierDescriptions = [];

    /**
     * @param {BedwarsSystem} system 
     * @param {BedwarsPlayer} playerInfo 
     * @param {data.BedwarsUpgradeShopitemInfo} info 
     */
    constructor(system, playerInfo, info) {
        
        // ===== 继承类 =====
        super(system, playerInfo);

        // ===== 描述部分解析 =====
        this.category = info.description.category;
        if (info.description.description) this.description = info.description.description;

        // ===== 组件部分解析 =====
        /** @type {data.BedwarsUpgradeShopitemComponent} */
        const component = (() => {
            if (info.description.format == "item") return info.component;
            else return info.components.find(comp => this.team.teamUpgrades[comp.tier.checkUpgradeTier] == comp.tier?.tier - 1 ) ?? info.components[info.components.length - 1];
        })();
        
        // 物品 ID 和数量
        this.shopitemId = component.shopitemId;
        this.amount = component.amount;

        // 资源类型和资源数量
        this.resourceType = component.resource.type;
        this.resourceAmount = component.resource.amount;
        if (component.resource.amountInSolo && system.mode.map.isSolo) this.resourceAmount = component.resource.amountInSolo;

        // 等级
        if (component.tier?.tier) this.tier = component.tier.tier;
        if (component.tier?.checkUpgradeTier) this.checkUpgradeTier = component.tier.checkUpgradeTier;
        if (info.description.format == "itemGroup") this.allTierDescriptions = info.components.flatMap(comp => comp.tier.thisTierDescription ?? "");

    };

    /** 物品在商店内的备注信息
     * @override
     */
    getLore() {};

    /** 商店物品的购买检查，只有在检查该物品满足购买条件后才能购买，返回是否成功购买
     * @override
     */
    purchaseTest() {};

    /** 成功购买物品时的函数
     * @override
     */
    purchaseSuccess() {};

};

// --- 商人 ---

/** 起床战争商人的一般属性 */
class BedwarsTrader {

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 商人位置 @type {minecraft.Vector3} */
    location = { x: 0, y: 0, z: 0 };

    /** 商人旋转角度，为 0°~360° */
    rotation = 0;

    /** 商人信息 @type {"item"|"upgrade"} */
    type = "item";

    /** 商人名称 @type {"§b道具商店"|"§b团队模式升级"} */
    name;

    /** 皮肤 ID */
    skin = 0;

    /** 该商人是否正交易 */
    isTrading = false;

    /** 商人，需注意在游戏时才能调用到实体 @type {minecraft.Entity | undefined} */
    trader;

    /** 玩家，需注意在交互后才能调用到实体 @type {minecraft.Player | undefined} */
    player;

    /** 玩家起床战争信息，需注意在交互后才能调用到信息 @type {BedwarsPlayer | undefined} */
    playerInfo;

    /**
     * @param {BedwarsSystem} system
     * @param {data.TraderInfo} info
     */
    constructor(system, info) {
        this.system = system;
        this.location = info.location;
        this.rotation = info.rotation;
        this.type = info.type;
        if (info.skin) this.skin = info.skin; else this.skin = lib.JSUtil.randomInt(0, 21);
    };

    /** 生成商人 */
    spawn() {

        // 生成商人并确定朝向、类型和皮肤
        this.trader = lib.EntityUtil.add("bedwars:trader", lib.Vector3Util.center(this.location));
        this.trader.setRotation({ x: 0, y: this.rotation });
        this.trader.triggerEvent(`${this.type}_trader`);
        this.trader.triggerEvent(`skin_${this.skin}`);

        // 设定名字
        this.trader.nameTag = this.name;

        return this.trader;

    };

    /** 玩家与商人交互时
     * @param {minecraft.Player} player 与商人交互的玩家
     * @param {BedwarsPlayer} playerInfo 该玩家的起床战争信息
     */
    interacted(player, playerInfo) {

        // 检查该玩家上一个交易的商人，并立刻移除
        this.system.mode.map.removeTrader(playerInfo.tradeInfo.trader);

        // 隐藏商人
        const trader = this.trader;
        trader.teleport(lib.Vector3Util.add(trader.location, 0, -2, 0));
        trader.nameTag = "";
        trader.addEffect("invisibility", 20000000, { showParticles: true });
        trader.triggerEvent("bedwars:remove_gravity_when_interacted");

        // 记录基本信息
        this.player = player;
        this.playerInfo = playerInfo;
        this.isTrading = true;
        this.system.mode.map.addTradingTrader(this);

        // 向玩家数据登记商人信息
        playerInfo.tradeInfo.trader = trader;
        playerInfo.tradeInfo.rotation = player.getRotation();

        // 锁定玩家物品
        playerInfo.lockAllItems();

        // 重新召唤 NPC
        const newTraderInfo = this.system.mode.map.addTrader({ location: this.location, rotation: this.rotation, type: this.type, skin: this.skin });
        const newTrader = newTraderInfo.spawn();
        newTrader.setRotation(this.trader.getRotation());

        // 设置 NPC 的物品
        this.setShopitem();

    };

    /** 设置商店物品
     * @abstract
     */
    setShopitem() { };

}

/** 起床战争物品类商人，包括地图内商人的各种基本信息和方法，可通过 BedwarsMap 类获取 */
class BedwarsItemTrader extends BedwarsTrader {

    name = "§b道具商店";

    /** 商店物品 @type {BedwarsItemShopitem[]} */
    items = [];

    /** 快速购买商店物品 @type {BedwarsItemShopitem[]} */
    quickBuy = [];

    /** 方块商店物品 @type {BedwarsItemShopitem[]} */
    blocks = [];

    /** 近战商店物品 @type {BedwarsItemShopitem[]} */
    melee = [];

    /** 盔甲商店物品 @type {BedwarsItemShopitem[]} */
    armor = [];

    /** 工具商店物品 @type {BedwarsItemShopitem[]} */
    tools = [];

    /** 远程商店物品 @type {BedwarsItemShopitem[]} */
    ranged = [];

    /** 药水商店物品 @type {BedwarsItemShopitem[]} */
    potions = [];

    /** 实用物品商店物品 @type {BedwarsItemShopitem[]} */
    utility = [];

    /** 轮换物品商店物品 @type {BedwarsItemShopitem[]} */
    rotatingItems = [];

    /**
     * @param {BedwarsSystem} system
     * @param {data.TraderInfo} info
     */
    constructor(system, info) {
        super(system, info);
    };

    /** 设置物品类商人物品
     * @override
     */
    setShopitem() {

        // 录入物品数据
        this.items = this.system.mode.itemShopitemData.map(data => new BedwarsItemShopitem(this.system, this.playerInfo, data));
        this.quickBuy = this.items.filter(item => item.isQuickBuy);
        this.blocks = this.items.filter(item => item.category == data.ShopitemCategory.blocks);
        this.melee = this.items.filter(item => item.category == data.ShopitemCategory.melee);
        this.armor = this.items.filter(item => item.category == data.ShopitemCategory.armor);
        this.tools = this.items.filter(item => item.category == data.ShopitemCategory.tools);
        this.ranged = this.items.filter(item => item.category == data.ShopitemCategory.ranged);
        this.potions = this.items.filter(item => item.category == data.ShopitemCategory.potions);
        this.utility = this.items.filter(item => item.category == data.ShopitemCategory.utility);
        this.rotatingItems = this.items.filter(item => item.category == data.ShopitemCategory.rotatingItems);

        // 清除物品
        lib.InventoryUtil.getInventory(this.trader).container.clearAll();

        // 设置标签
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_quick_buy", 0);
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_blocks", 1, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_melee", 2, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_armor", 3, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_tools", 4, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_ranged", 5, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_potions", 6, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_utility", 7, { lore: ["§r§e点击查看！"] });
        lib.ItemUtil.replaceInventoryItem(this.trader, "bedwars:category_rotating_items", 8, { lore: ["§r§e点击查看！"] });

        // 设置标签内的物品
        this.getUsingCategory().forEach((item, index) => { lib.ItemUtil.replaceInventoryItem(this.trader, `bedwars:shopitem_${item.id}`, this.getRealSlot(index), { lore: item.getLore(), amount: item.amount }); });
    };

    /** 从物品信息的优先级中得到实际应当将物品放到何种槽位
     * @description 例如，羊毛在方块标签中为 0 号物品，则应该放到物品栏第 10 个槽位中去
     * @param {number} priority 
     */
    getRealSlot(priority) {
        // x  x  x  x  x  x  x  x  x 
        // x  0  1  2  3  4  5  6  x 
        // x  7  8  9  10 11 12 13 x 
        if (priority >= 0 && priority <= 6) return priority + 10;
        else return priority + 12;
    };

    /** 获取当前正使用的类别物品列表 */
    getUsingCategory() {
        switch (this.playerInfo.tradeInfo.category) {
            default: case data.ShopitemCategory.quickBuy: return this.quickBuy;
            case data.ShopitemCategory.blocks: return this.blocks;
            case data.ShopitemCategory.melee: return this.melee;
            case data.ShopitemCategory.armor: return this.armor;
            case data.ShopitemCategory.tools: return this.tools;
            case data.ShopitemCategory.ranged: return this.ranged;
            case data.ShopitemCategory.potions: return this.potions;
            case data.ShopitemCategory.utility: return this.utility;
            case data.ShopitemCategory.rotatingItems: return this.rotatingItems;
        }
    };

    /** 检查商人的分类物品是否被拿走，若是则更换分类信息并重新显示物品 */
    categoryChangeTest() {

        // 0 号位 -> 快速购买

        if (!lib.InventoryUtil.slotIsItem(this.trader, 0, "bedwars:category_quick_buy")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.quickBuy;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_quick_buy");
            this.setShopitem();
        }
        // 1 号位 -> 方块
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 1, "bedwars:category_blocks")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.blocks;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_blocks");
            this.setShopitem();
        }
        // 2 号位 -> 近战
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 2, "bedwars:category_melee")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.melee;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_melee");
            this.setShopitem();
        }
        // 3 号位 -> 盔甲
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 3, "bedwars:category_armor")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.armor;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_armor");
            this.setShopitem();
        }
        // 4 号位 -> 工具
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 4, "bedwars:category_tools")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.tools;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_tools");
            this.setShopitem();
        }
        // 5 号位 -> 远程
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 5, "bedwars:category_ranged")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.ranged;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_ranged");
            this.setShopitem();
        }
        // 6 号位 -> 药水
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 6, "bedwars:category_potions")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.potions;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_potions");
            this.setShopitem();
        }
        // 7 号位 -> 实用道具
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 7, "bedwars:category_utility")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.utility;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_utility");
            this.setShopitem();
        }
        // 8 号位 -> 轮换物品
        else if (!lib.InventoryUtil.slotIsItem(this.trader, 8, "bedwars:category_rotating_items")) {
            this.playerInfo.tradeInfo.category = data.ShopitemCategory.rotatingItems;
            lib.ItemUtil.removeItem(this.player, "bedwars:category_rotating_items");
            this.setShopitem();
        };

    };

    /** 检查商人的商店物品是否被拿走，若是则触发该物品的购买函数 */
    itemChangeTest() {
        this.getUsingCategory().forEach((item, index) => {
            const shopitemId = `bedwars:shopitem_${item.id}`
            if (!lib.InventoryUtil.slotIsItem(this.trader, this.getRealSlot(index), shopitemId, item.amount)) {
                lib.ItemUtil.removeItem(this.player, shopitemId);
                lib.ItemUtil.removeItemEntity(shopitemId);
                item.purchaseTest();
                this.setShopitem();
            }
        });
    };

};

/** 起床战争团队升级商人，包括地图内商人的各种基本信息和方法，可通过 BedwarsMap 类获取 */
class BedwarsUpgradeTrader extends BedwarsTrader {

    name = "§b团队模式升级";

    /**
     * @param {BedwarsSystem} system
     * @param {data.TraderInfo} info
     */
    constructor(system, info) {
        super(system, info);
    };

    /** 设置商店物品
     * @override
     */
    setShopitem() { };

};

// --- 地图 ---

/** 起床战争地图，包含各地图的各种基本信息和方法 */
class BedwarsMap {

    /** ID，它将控制地图的运行方式 */
    id = "";

    /** 名称，它将按照给定名称在游戏开始前显示出来 */
    name = "";

    /** 模式，该地图将按照什么模式执行 @type {"classic"|"capture"} */
    mode = "classic";

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 钻石生成点信息 */
    diamondSpawnerInfo = {

        /** 钻石点等级 */
        level: 1,

        /** 距离下次生成剩余的时长，单位：游戏刻 */
        countdown: 600,

        /** 钻石点位置与生成次数信息 @type {data.SpawnerInfo[]} */
        info: []

    };

    /** 绿宝石生成点信息 */
    emeraldSpawnerInfo = {

        /** 绿宝石点等级 */
        level: 1,

        /** 距离下次生成剩余的时长，单位：游戏刻 */
        countdown: 1300,

        /** 绿宝石点位置与生成次数信息 @type {data.SpawnerInfo[]} */
        info: []

    };

    /** 一次最多生成铁的数量 */
    ironSpawnTimes = 5;

    /** 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源 */
    distributeResource = true;

    /** 生成资源时是否清除向量，否则资源将会在生成时溅开 */
    clearVelocity = true;

    /** 重生点，重生时将按照旁观模式玩家的身份重生在此处 @type {minecraft.Vector3} */
    spawnpoint = { x: 0, y: 100, z: 0 };

    /** 队伍数，常见的有 2 队地图、4 队地图、8 队地图 */
    teamCount = 0;

    /** 队伍信息 @type {BedwarsTeam[]} */
    teams = [];

    /** 存活队伍信息 @type {BedwarsTeam[]} */
    aliveTeams = [];

    /** 旁观玩家信息 @type {BedwarsPlayer[]} */
    spectatorPlayers = [];

    /** 商人信息，包括位置、朝向、类型 @type {(BedwarsItemTrader | BedwarsUpgradeTrader)[]} */
    traders = [];

    /** 正在进行交易的商人信息 @type {(BedwarsItemTrader | BedwarsUpgradeTrader)[]} */
    tradingTraders = [];

    /** 队伍岛屿信息 @type {data.TeamIslandInfo[]} */
    teamIslands = [];

    /** 其他岛屿信息 @type {data.IslandInfo[]} */
    islands = [];

    /** 最高高度限制，在高于此高度的位置放置方块会阻止 */
    heightLimitMax = 110;

    /** 最低高度限制，在低于此高度的位置放置方块会阻止 */
    heightLimitMin = 50;

    /** 治愈池半径 */
    healPoolRadius = 20;

    /** 是否在本地图禁用旗帜 */
    disableTeamIslandFlag = false;

    /** 是否为单挑模式 */
    isSolo = false;

    /** 地图大小 */
    size = {

        /** x 方向半边长（地图的 x 最大值） */
        x: 105,

        /** x 方向半边长（地图的 x 最大值） */
        z: 105,

    };

    /** 安全区位置 */
    safeAreaLocation = {

        /** 重生点，5 格内禁止放置方块 @type {minecraft.Vector3[]} */
        spawnpoint: [],

        /** 商人，3 格内禁止放置方块 @type {minecraft.Vector3[]} */
        trader: [],

        /** 队伍资源点，5 格内禁止放置方块 @type {minecraft.Vector3[]} */
        teamResource: [],

        /** 钻石点，2 格内禁止放置方块 @type {minecraft.Vector3[]} */
        diamond: [],

        /** 绿宝石点，2 格内禁止放置方块 @type {minecraft.Vector3[]} */
        emerald: [],

    }

    /**
     * @param {BedwarsSystem} system 系统信息
     * @param {data.BedwarsMapInfo} info 地图信息
     */
    constructor(system, info) {
        this.system = system;
        this.id = info.id;
        this.name = info.name;
        this.mode = info.mode;
        info.teams.forEach(team => this.addTeam(team));
        this.teamIslands = info.teamIslands;
        this.islands = info.islands;
        info.traders.forEach(traderData => this.addTrader(traderData));
        info.diamondSpawnerLocation.forEach(location => this.addDiamondSpawner(location));
        info.emeraldSpawnerLocation.forEach(location => this.addEmeraldSpawner(location));
        if (info.ironSpawnTimes) this.ironSpawnTimes = info.ironSpawnTimes;
        if (info.distributeResource) this.distributeResource = info.distributeResource;
        if (info.clearVelocity) this.clearVelocity = info.clearVelocity;
        if (info.heightLimitMax) this.heightLimitMax = info.heightLimitMax;
        if (info.heightLimitMin) this.heightLimitMin = info.heightLimitMin;
        if (info.healPoolRadius) this.healPoolRadius = info.healPoolRadius;
        if (info.disableTeamIslandFlag) this.disableTeamIslandFlag = info.disableTeamIslandFlag;
        if (info.isSolo) this.isSolo = info.isSolo;

        // 注册安全区位置
        this.safeAreaLocation.spawnpoint = this.teams.flatMap(team => team.spawnpointLocation);
        this.safeAreaLocation.trader = this.traders.flatMap(trader => trader.location);
        this.safeAreaLocation.teamResource = this.teams.flatMap(team => team.resourceLocation);
        this.safeAreaLocation.diamond = this.diamondSpawnerInfo.info.flatMap(info => info.location);
        this.safeAreaLocation.emerald = this.emeraldSpawnerInfo.info.flatMap(info => info.location);
    };

    /** 为地图添加队伍
     * @param {data.BedwarsTeamInfo} teamInfo 
     */
    addTeam(teamInfo) {
        let team = new BedwarsTeam(this.system, teamInfo);
        this.teams.push(team);
        this.aliveTeams.push(team);
        this.teamCount += 1;
    };

    /** 添加新的钻石生成点
     * @param {minecraft.Vector3} location 
     */
    addDiamondSpawner(location) {
        /** @type {data.SpawnerInfo} */
        const spawnerInfo = { location: location, spawnedTimes: 1 };
        this.diamondSpawnerInfo.info.push(spawnerInfo);
    };

    /** 添加新的绿宝石生成点
     * @param {minecraft.Vector3} location 
     */
    addEmeraldSpawner(location) {
        /** @type {data.SpawnerInfo} */
        const spawnerInfo = { location: location, spawnedTimes: 1 };
        this.emeraldSpawnerInfo.info.push(spawnerInfo);
    };

    /** 获取地图结构加载完成需要的时间 */
    getStructureLoadTime() {
        return Math.ceil(this.teamIslands.reduce((sum, info) => sum + info.loadTime / this.getStructureLoadSpeed(), 0) + this.islands.reduce((sum, info) => sum + info.loadTime / this.getStructureLoadSpeed(), 0));
    };

    /** 获取结构加载速度 */
    getStructureLoadSpeed() {
        switch (this.system.settings.beforeGaming.reload.loadSpeed) {
            case 0: return 0.25;
            case 1: return 0.50;
            case 2: return 0.75;
            case 3: default: return 1.00;
            case 4: return 1.50;
            case 5: return 2.00;
            case 6: return 4.00;
        };
    };

    /** 分配玩家到队伍内 */
    assignTeam() {

        // ===== 变量准备 =====

        /** 当前总人数 */
        let playerAmount = lib.PlayerUtil.getAmount();

        /** 设置规定的上限人数 */
        let maxPlayerAmount = this.system.settings.beforeGaming.waiting.maxPlayerCount;

        /** 队伍分配模式，0：标准组队，1：随机组队，2：胜率组队 */
        const assignMode = this.system.settings.beforeGaming.teamAssign.mode;

        /** 所有队伍列表并打乱顺序 @type {BedwarsTeam[]} */
        let teams = lib.JSUtil.shuffleArray([...this.teams]);

        /** 所有玩家列表并打乱顺序 @type {minecraft.Player[]} */
        let players = lib.JSUtil.shuffleArray([...lib.PlayerUtil.getAll()]);

        /** 每队至少应当分配的玩家
         * @description 例：11人4队，一队最少分配11/4=2（向下取整）名玩家；13人8队，一队最少分配13/8=1（向下取整）名玩家
         */
        const minPlayerPerTeam = Math.floor(playerAmount / this.teamCount);

        // ===== (1) 为自主选队的玩家先选定队伍 =====
        // 如果启用了自主选队的玩家，则先选择队伍
        // 经过队伍选定后：
        // - players 剩余的玩家均为待随机分配的玩家；
        // - playerAmount 代表待随机分配的玩家数量；
        // - maxPlayerAmount 代表剩余的玩家中允许参与游戏的玩家数量

        if (this.system.settings.beforeGaming.teamAssign.playerSelectEnabled) {

            /** 队伍选择记分板 */
            const selectTeamObj = lib.ScoreboardObjectiveUtil.get("selectTeam");

            // 排除掉记分板中已经离线的玩家
            lib.ScoreboardPlayerUtil.getOfflinePlayers(selectTeamObj.id).forEach(player => selectTeamObj.removeParticipant(player));

            // 剩余的玩家，添加进队伍中
            selectTeamObj.getScores().filter(info => info.participant.type == "Player").forEach(info => {

                // 添加进选定的队伍中
                const player = info.participant.getEntity();
                const teamIndex = info.score;
                const bedwarsPlayer = this.teams[teamIndex].addPlayer(player);

                // 然后，在所有待分队的玩家中刨除该玩家，并且将数量和最大玩家数减掉 1
                players = players.filter(p => p.name != player.name);
                playerAmount--;
                maxPlayerAmount--;
            });

        };

        // ===== (2) 将多出的玩家随机设置为旁观 =====
        // 只保留maxPlayerAmount个玩家，剩下的玩家改为旁观模式

        if (playerAmount > maxPlayerAmount) {

            // 在已打乱的玩家数组中，保留前 maxPlayerAmount 个，剩下的玩家作为旁观模式的玩家
            const spectatorPlayers = players.splice(maxPlayerAmount);
            spectatorPlayers.forEach(player => this.spectatorPlayers.push(new BedwarsPlayer(this.system, { team: undefined, player: player })));

            // 然后，令玩家数等于最大玩家数
            playerAmount = maxPlayerAmount;

        };

        // ===== (3) 为每个队伍先分配 minPlayerPerTeam 个玩家 =====
        // 经过自主选队和筛选之后，不同的队伍目前会分配到不同的人数

        // 以下假设3种情况：
        // （1）11人4队，分别为3/3 2/2 0/2 1/2（minPlayerPerTeam = 2）
        // （2）16人2队，分别为5/8 3/8（minPlayerPerTeam = 8）
        // （3）14人8队，分别为0/1 0/1 0/1 ... 0/1 （minPlayerPerTeam = 1）

        // 1. 先找到游戏玩家为 currentPlayerAmount = 0 （条件1）并且人数小于 minPlayerPerTeam （条件2）的队伍
        // 2. 在这些队伍里插入玩家：
        // - (1) 3/3 2/2 0/2 1/2 -> 3/3 2/2 1/2 1/2
        // - (2) 5/8 3/8 -> 5/8 3/8
        // - (3) 0/1 0/1 ... 0/1 -> 1/1 1/1 ... 1/1 循环结束（players剩余5人）
        // 3. 然后，currentPlayerAmount++，重复步骤 1-2 并继续循环：
        // - (1) 3/3 2/2 1/2 1/2 -> 3/3 2/2 2/2 2/2 循环结束（players剩余2人）
        // - (2) 5/8 3/8 -> ... -> 5/8 4/8 -> 5/8 5/8 -> 6/8 6/8 -> ... -> 8/8 8/8 循环结束（players剩余0人）

        // 如果为按照胜率排序，则重新排序随机分配的玩家列表
        if (assignMode === 2) lib.Debug.sendMessage(`§c[BedwarsMap][警告] 未按照胜率重新排序玩家！`);

        // 从 0 个玩家的队伍开始分配，一直到有 minPlayerPerTeam - 1 个玩家的队伍分配完玩家为止
        for (let currentPlayerAmount = 0; currentPlayerAmount < minPlayerPerTeam; currentPlayerAmount++) {
            teams.filter(team => team.players.length == currentPlayerAmount).forEach(team => {
                team.addPlayer(players[0]);
                players.splice(0, 1);
            });
        };

        // ===== 四、多余的玩家执行的逻辑 =====

        // 1. 如果 players 还有剩余的玩家，则准备分配到剩余的队伍中去。
        // - (1) 3/3 2/2 2/2 2/2 （players剩余2人） 继续判断
        // - (2) 8/8 8/8 （players剩余0人） 停止判断，分队结束
        // - (3) 1/1 1/1 ... 1/1 （players剩余5人） 继续判断
        // 2. 视分配模式进行分配。在所有的队伍列表中，需要移除人数非 minPlayerPerTeam 的队伍：
        // - (1) 3/3 2/2 2/2 2/2 -> 2/2 2/2 2/2（players剩余2人）
        // - (2) 1/1 1/1 ... 1/1 -> 1/1 1/1 ... 1/1（players剩余5人）
        // 3. 每个队伍分配一个玩家。
        // - (1) 2/2 2/2 2/2 -> 3/3 3/3 2/2，分队结束
        // - (2) 1/1 1/1 ... 1/1 -> 2/2 2/2 ... 2/2 1/1 1/1 1/1，分队结束

        if (players.length != 0) {

            // 如果按照标准组队，则从红队 -> 蓝队 -> ...的顺序依次分配玩家
            if (assignMode == 0) {
                teams = this.teams.filter(team => team.players.length == minPlayerPerTeam);
            }
            // 如果按照随机组队或胜率组队，则随机选定队伍排序
            else {
                teams = teams.filter(team => team.players.length == minPlayerPerTeam);
            };

            // 剩下的队伍，挨个添加玩家
            teams.filter((team, index) => index < players.length).forEach((team, index) => team.addPlayer(players[index]));

        };

    };

    /** 从玩家信息获取起床战争玩家
     * @param {minecraft.Player} player 
     * @remarks 可以传入undefined，不会出现问题，最终会返回undefined
     */
    getBedwarsPlayer(player) {
        return this.teams.flatMap(team => team.players).concat(this.spectatorPlayers).find(bedwarsPlayer => bedwarsPlayer.player.id == player?.id);
    };

    /** 获取游戏开始介绍 */
    getStartIntro() {
        /** @type {data.StartIntro} */
        const startIntro = {
            title: { translate: `message.gameStartTitle.${this.mode}` },
            intro: { translate: `message.gameStartIntroduction.${this.mode}` }
        };
        return startIntro;
    };

    /** 播报床被破坏
     * @param {BedwarsTeam} team 被破坏床的队伍
     * @param {BedwarsPlayer} breakerInfo 破坏者的起床战争信息
     */
    informBedDestroyed(team, breakerInfo) {

        // 对于被破坏床的队伍
        team.players.forEach(playerInfo => {
            const player = playerInfo.player;
            lib.PlayerUtil.setTitle(player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed" })
            player.playSound("mob.wither.death");
            player.sendMessage(["\n", { translate: `message.bedDestroyed.${breakerInfo.killStyle}`, with: { rawtext: [{ translate: `message.selfBed` }, { text: breakerInfo.player.nameTag }] } }, "\n "])
        });

        // 对于其他队伍和旁观玩家
        this.teams.filter(otherTeam => otherTeam.id != team.id).flatMap(otherTeam => otherTeam.players).concat(this.spectatorPlayers).forEach(playerInfo => {
            const player = playerInfo.player;
            player.playSound("mob.enderdragon.growl", { location: lib.Vector3Util.add(player.location, 0, 12, 0) }); // 末影龙的麦很炸，所以提高 12 格
            player.sendMessage(["\n", { translate: `message.bedDestroyed.${breakerInfo.killStyle}`, with: { rawtext: [{ translate: `message.otherBed`, with: { rawtext: [{ translate: `team.${team.id}` }] } }, { text: breakerInfo.player.nameTag }] } }, "\n "]);
        });

    };

    /** 弹射物是否越界，如果越界则移除之，返回该弹射物是否越界
     * @param {minecraft.Entity} projectile 要移除的弹射物 ID
     * @param {number} range 检测的范围，默认值：0。例：若填写为 -5，则检测到离边界5格以内则移除。
     * @param {boolean} upFaceTest 是否测试顶面，如果为 false 则忽略顶面的测试
     */
    projectileOutOfBorder(projectile, range = 0, upFaceTest = true) {
        const { x, y, z } = projectile.location;
        if (
            Math.abs(x) > this.size.x + range // 越过 X 界限
            || Math.abs(z) > this.size.z + range // 越过 Z 界限
            || (upFaceTest && y > this.heightLimitMax + range) // 在检查顶面的情况下，越过 Y 上限
            || y < this.heightLimitMin - range // 越过 Y 下限
        ) {
            projectile.remove();
            return true;
        }
        return false;
    };

    /** 检查给定位置是否在安全区内
     * @param {minecraft.Vector3Util} location 
     */
    locationInSafeArea(location) {
        const safeArea = this.safeAreaLocation;
        return (
            safeArea.diamond.concat(safeArea.emerald).some(safeLocation => lib.Vector3Util.distance(location, safeLocation) <= 2)
            || safeArea.trader.some(safeLocation => lib.Vector3Util.distance(location, safeLocation) <= 3)
            || safeArea.spawnpoint.concat(safeArea.teamResource).some(safeLocation => lib.Vector3Util.distance(location, safeLocation) <= 5)
        );
    };

    /** 添加商人
     * @param {data.TraderInfo} traderInfo 
     */
    addTrader(traderInfo) {
        const traderData = (() => {
            if (traderInfo.type == "item") return new BedwarsItemTrader(this.system, traderInfo);
            else return new BedwarsUpgradeTrader(this.system, traderInfo);
        })()
        this.traders.push(traderData);
        return traderData;
    };

    /** 添加交易中的商人
     * @param {BedwarsItemTrader} traderInfo
     */
    addTradingTrader(traderInfo) {
        this.tradingTraders.push(traderInfo);
    };

    /** 从商人 ID 获取起床战争商人信息
     * @param {minecraft.Entity} trader
     * @remarks 可以传入undefined，不会出现问题，最终会返回undefined
     */
    getTrader(trader) {
        return this.traders.find(bedwarsTrader => bedwarsTrader.trader.id == trader?.id);
    };

    /** 移除商人
     * @param {minecraft.Entity} removingTrader
     */
    removeTrader(removingTrader) {
        const traderData = this.getTrader(removingTrader);
        if (traderData) {
            this.traders = this.traders.filter(trader => trader.trader?.id != removingTrader.id);
            this.tradingTraders = this.tradingTraders.filter(tradingTrader => tradingTrader.trader?.id != removingTrader.id);
            removingTrader.remove();
        }

    };

};

// ===== 队伍 =====
// 队伍规定了当前的队伍状态。
// 这些玩家的信息可以通过地图的队伍信息（BedwarsMap.teams）读取。

/** 起床战争队伍，代表每个队伍的状态 */
class BedwarsTeam {

    /** 游戏系统 @type {BedwarsSystem} */
    system;

    /** ID，代表一个独一无二的队伍 @type {data.ValidTeams} */
    id = "";

    /** 床的位置 @type {minecraft.Vector3} */
    bedLocation = { x: 0, y: 0, z: 0 };

    /** 床的旋转 @type {"None"|"Rotate90"|"Rotate180"|"Rotate270"} */
    bedRotation = "None";

    /** 资源点的位置，若为分散式生成资源应选取中心点 @type {minecraft.Vector3} */
    resourceLocation = { x: 0, y: 0, z: 0 };

    /** 重生点的位置，若玩家能够重生则重生到此位置上 @type {minecraft.Vector3} */
    spawnpointLocation = { x: 0, y: 0, z: 0 };

    /** 箱子的位置 @type {minecraft.Vector3} */
    chestLocation = { x: 0, y: 0, z: 0 };

    /** 队伍玩家 @type {BedwarsPlayer[]} */
    players = [];

    /** 仍存活的队伍玩家 @type {BedwarsPlayer[]} */
    alivePlayers = [];

    /** 队伍是否有效，开始时未分配到队员的队伍即为无效队伍 */
    isValid = true;

    /** 队伍是否被淘汰，即没有床并且没有存活队员 */
    isEliminated = false;

    /** 床是否仍然存在 */
    bedIsExist = true;

    /** 团队升级 */
    teamUpgrades = {

        /** 盔甲强化等级 @type {0|1|2|3|4} */
        reinforcedArmor: 0,

        /** 治愈池 */
        healPool: false,

        /** 疯狂矿工等级 @type {0|1|2} */
        maniacMiner: 0,

        /** 锋利附魔 */
        sharpenedSwords: false,

        /** 锻炉等级 @type {0|1|2|3|4} */
        forge: 0,

        /** 缓冲靴子 @type {0|1|2} */
        cushionedBoots: 0,

        /** 末影龙增益 */
        dragonBuff: false,

    };

    /** 陷阱 @type {("blindnessTrap"|"counterOffensiveTrap"|"revealTrap"|"minerFatigueTrap"|undefined)[]} */
    traps = [];

    /** 
     * @param {BedwarsSystem} system 
     * @param {data.BedwarsTeamInfo} info
     */
    constructor(system, info) {
        this.system = system;
        this.id = info.id;
        this.bedLocation = info.bedLocation;
        if (info.bedRotation) this.bedRotation = info.bedRotation;
        this.resourceLocation = info.resourceLocation;
        this.spawnpointLocation = info.spawnpointLocation;
        this.chestLocation = info.chestLocation;
    };

    /** 放置床 */
    placeBed() {
        let bedLocation = this.bedLocation;
        if (this.bedRotation == "Rotate180") bedLocation = lib.Vector3Util.add(this.bedLocation, -1, 0, 0);
        else if (this.bedRotation == "Rotate270") bedLocation = lib.Vector3Util.add(this.bedLocation, 0, 0, -1);
        lib.StructureUtil.placeAsync(`beds:${this.id}_bed`, "overworld", bedLocation, { rotation: this.bedRotation });
    };

    /** 自毁床 */
    destroyBed() {
        this.bedIsExist = false;
        const { x, y, z } = this.bedLocation;
        minecraft.world.getDimension("overworld").runCommand(`setblock ${x} ${y} ${z} air destroy`);
        lib.ItemUtil.removeItemEntity("minecraft:bed");
    };

    /** 添加队员
     * @param {minecraft.Player} player 待添加的玩家
     */
    addPlayer(player) {
        const bedwarsPlayer = new BedwarsPlayer(this.system, { team: this, player: player });
        this.players.push(bedwarsPlayer);
        if (this.bedIsExist) this.alivePlayers.push(bedwarsPlayer); // 防止在该队伍淘汰后将玩家添加到存活玩家名单中
        return bedwarsPlayer;
    };

    /** 移除队员 */
    removePlayer(playerName) {
        const playersIndex = this.players.findIndex(player => player.player.name == playerName);
        const alivePlayersIndex = this.alivePlayers.findIndex(alivePlayer => alivePlayer.player.name == playerName);
        this.players.splice(playersIndex, 1);
        this.alivePlayers.splice(alivePlayersIndex, 1);
        lib.Debug.printArray(this.players, "team.players");
        lib.Debug.printArray(this.alivePlayers, "team.alivePlayers");
    };

    /** 获取本队的队伍颜色代码 */
    getTeamColor() {
        switch (this.id) {
            case data.ValidTeams.red: default: return "§c";
            case data.ValidTeams.blue: return "§9";
            case data.ValidTeams.yellow: return "§e";
            case data.ValidTeams.green: return "§a";
            case data.ValidTeams.white: return "§f";
            case data.ValidTeams.cyan: return "§3";
            case data.ValidTeams.pink: return "§d";
            case data.ValidTeams.gray: return "§7";
            case data.ValidTeams.orange: return "§6";
            case data.ValidTeams.brown: return "§n";
            case data.ValidTeams.purple: return "§5";
        }
    };

    /** 获取本队的队伍名 */
    getTeamName() {
        switch (this.id) {
            case data.ValidTeams.red: return "红";
            case data.ValidTeams.blue: return "蓝";
            case data.ValidTeams.yellow: return "黄";
            case data.ValidTeams.green: return "绿";
            case data.ValidTeams.white: return "白";
            case data.ValidTeams.cyan: return "青";
            case data.ValidTeams.pink: return "粉";
            case data.ValidTeams.gray: return "灰";
            case data.ValidTeams.orange: return "橙";
            case data.ValidTeams.brown: return "棕";
            case data.ValidTeams.purple: default: return "紫";
        }
    };

    /** 获取本队的带颜色的队伍名
     * @description 例如："§c红"
     */
    getTeamNameWithColor() {
        return `${this.getTeamColor()}${this.getTeamName()}`;
    };

    /** 传送玩家到重生点
     * @param {minecraft.Player} player 
     */
    teleportPlayerToSpawnpoint(player) {
        player.teleport(this.spawnpointLocation, { facingLocation: this.bedLocation });
    };

    /** 标记为无效队伍 */
    setInvalid() {
        // 标记为无效和淘汰队伍
        this.isValid = false;
        this.setEliminated();
        // 设置床为不存在，并且移除床
        this.destroyBed();
    };

    /** 标记为已被淘汰 */
    setEliminated() {
        this.isEliminated = true;
        this.system.mode.map.aliveTeams.splice(this.system.mode.map.aliveTeams.findIndex(aliveTeam => aliveTeam.id == this.id), 1);
        minecraft.world.sendMessage(["\n", { translate: "message.teamEliminated", with: [`${this.getTeamNameWithColor()}`] }, "\n "])
    };

};

// ===== 玩家 =====
// 起床战争玩家（注意：请和 Minecraft 的 Player 类区分开）规定了起床战争中每个玩家的信息（包括旁观者）
// 这些玩家的信息可以通过各个队伍的玩家信息（BedwarsTeam.players）读取，也可以通过地图的旁观玩家信息（BedwarsMap.spectatorPlayers）读取。
// 此外，起床战争玩家还规定了击杀样式。

/** 起床战争玩家，代表起床战争内部的一个玩家 */
class BedwarsPlayer {

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 该玩家所属的队伍，若为 undefined 则为旁观模式 @type {BedwarsTeam | undefined} */
    team;

    /** 该玩家信息对应的玩家 @type {minecraft.Player} */
    player;

    /** 该玩家的击杀样式 @type {killStyle} */
    killStyle = data.KillStyle.default;

    /** 玩家是否已死亡 */
    isDead = false;

    /** 玩家在 Minecraft 意义上的死亡状态的持续时间，在死亡后会自动设为 0 秒，单位：秒 */
    keepDeathTime = -1;

    /** 玩家是否被淘汰 */
    isEliminated = false;

    /** 玩家是否为旁观者 */
    isSpectator = false;

    /** 击杀数 */
    killCount = 0;

    /** 最终击杀数 */
    finalKillCount = 0;

    /** 破坏床数 */
    destroyBedCount = 0;

    /** 游戏 ID，标识该玩家处在哪一局游戏中，如果玩家在前面的游戏中，可以通过退出重进检查防止玩家信息出现错误 */
    gameId = 0;

    /** 重生倒计时，玩家在死亡后需要多久才能重生，为 0 时触发重生函数，为负数时则代表该玩家不能重生，单位：秒 */
    respawnTime = 0;

    /** 死亡类型 @type {"entityAttack"|"projectile"|"fall"|"void"|"entityExplosion"|"other"} */
    deathType = "other";

    /** 是否为退出重进的玩家 */
    rejoined = false;

    /** 上一个攻击者 @type {minecraft.Player|undefined} */
    lastAttacker = undefined;

    /** 自上一次被攻击的计时，单位：秒 */
    timeSinceLastAttack = 10;

    /** 镐子的等级，0：无，1：木，2：铁，3：金，4：钻石 @type {0|1|2|3|4} */
    pickaxeTier = 0;

    /** 斧子的等级，0：无，1：木，2：铁，3：金，4：钻石 @type {0|1|2|3|4} */
    axeTier = 0;

    /** 盔甲的等级，1：皮革，2：锁链，3：铁，4：钻石 @type {1|2|3|4} */
    armorTier = 1;

    /** 是否有剪刀 */
    hasShears = false;

    /** 是否锁定了所有物品 */
    itemLocked = false;

    /** 玩家的交易信息 */
    tradeInfo = {

        /** 正与何商人交易，需交易后才能记录 @type {minecraft.Entity | undefined} */
        trader: void 0,

        /** 正在使用的类别 */
        category: data.ShopitemCategory.quickBuy,

        /** 玩家当前的旋转角度 @type {minecraft.Vector2 | undefined} */
        rotation: void 0,

    };

    /**
     * @param {BedwarsSystem} system 系统
     * @param {BedwarsPlayerInfo} info 起床战争玩家信息
     */
    constructor(system, info) {

        // ===== 变量初始化 =====
        this.system = system;
        this.team = info.team;
        this.player = info.player;
        if (info.killStyle) this.killStyle = info.killStyle;
        this.gameId = system.gameId;

        // ===== 其他功能设置 =====

        // 如果有队伍时，执行初始化
        if (this.team) {
            this.player.triggerEvent(`team_${this.team.id}`);
            this.player.nameTag = `${this.team.getTeamColor()}${this.player.name}`;
            this.player.setGameMode("Survival");
        }
        // 否则，按旁观玩家设置
        else {
            this.player.triggerEvent(`remove_team`);
            this.player.nameTag = this.player.name;
            this.player.setGameMode("Spectator");
            this.respawnTime = -1;
            this.isDead = true;
            this.isEliminated = true;
            this.isSpectator = true;
        };

    };

    /** 获取地图 */
    getMap() {
        return this.system.mode.map;
    };

    /** 击杀玩家后，获得的物资奖励
     * @param {BedwarsPlayer} killedPlayerInfo 
     */
    getBonus(killedPlayerInfo) {
        const killedPlayer = killedPlayerInfo.player;

        // 播放音效
        this.player.playSound("random.orb", { location: this.player.location });

        // 记录击杀数
        if (killedPlayerInfo.team.bedIsExist) this.killCount++;
        else this.finalKillCount++;

        // 击杀奖励
        const ironAmount = lib.InventoryUtil.hasItemAmount(killedPlayer, "bedwars:iron_ingot");
        if (ironAmount > 0) {
            lib.ItemUtil.giveItem(this.player, "bedwars:iron_ingot", { amount: ironAmount })
            this.player.sendMessage(`§f+${ironAmount}块铁锭`);
        };
        const goldAmount = lib.InventoryUtil.hasItemAmount(killedPlayer, "bedwars:gold_ingot");
        if (goldAmount > 0) {
            lib.ItemUtil.giveItem(this.player, "bedwars:gold_ingot", { amount: goldAmount })
            this.player.sendMessage(`§6+${goldAmount}块金锭`);
        };
        const diamondAmount = lib.InventoryUtil.hasItemAmount(killedPlayer, "bedwars:diamond");
        if (diamondAmount > 0) {
            lib.ItemUtil.giveItem(this.player, "bedwars:diamond", { amount: diamondAmount })
            this.player.sendMessage(`§b+${diamondAmount}钻石`);
        };
        const emeraldAmount = lib.InventoryUtil.hasItemAmount(killedPlayer, "bedwars:emerald");
        if (emeraldAmount > 0) {
            lib.ItemUtil.giveItem(this.player, "bedwars:emerald", { amount: emeraldAmount })
            this.player.sendMessage(`§2+${emeraldAmount}绿宝石`);
        };
    };

    /** 设置玩家为已死亡，同时检查床的存在性，如果没有床则设为已淘汰
     * @param {minecraft.EntityDamageCause} deathType 
     * @param {minecraft.Entity | undefined} killer 
     */
    setDead(deathType, killer) {

        // --- 设置为已死亡 ---
        this.isDead = true;
        this.keepDeathTime = 0;

        // --- 设置死亡类型 ---
        // 如果玩家死于：实体攻击、投射物、摔落、虚空、爆炸，则为了显示死亡信息应记录，其他类型统一记录为其他
        if (["entityAttack", "projectile", "fall", "void", "entityExplosion"].includes(deathType)) this.deathType = deathType;
        else this.deathType = "other";

        // --- 根据床的存在性设置重生时间，或设置是否淘汰 ---
        if (!this.team) null;
        else if (this.team.bedIsExist) {

            // 如果是退出重进的玩家，按照退出重进玩家的时间设置重生时间
            if (this.rejoined) {
                this.respawnTime = this.system.settings.gaming.respawnTime.rejoinedPlayers;
                this.rejoined = false;
            }
            else {
                this.respawnTime = this.system.settings.gaming.respawnTime.normalPlayers;
            }

        }
        else {

            // 设置为淘汰状态
            this.respawnTime = -1;
            this.isEliminated = true;

            // 通知该玩家已淘汰
            this.player.sendMessage({ translate: "message.eliminated" });

            // 将该玩家从该队伍的存活名单中移除出去
            this.team.alivePlayers.splice(this.team.alivePlayers.findIndex(alivePlayerData => alivePlayerData.player.id == this.player.id), 1);

            // 如果已经被移除的玩家是该队最后一名存活玩家，并且该队伍仍未被淘汰，则淘汰整个队伍
            if (this.team.alivePlayers.length == 0 && !this.team.isEliminated) this.team.setEliminated();

        };

        // --- 广播玩家被击杀的消息，并给予击杀者奖励 ---

        /** 本次击杀是否为最终击杀 */
        const isFinalKill = this.team.bedIsExist ? "" : "message.finalKill";

        /** 普通死亡样式
         * @param {"died"|"fellIntoVoid"} type 死亡类型
         */
        const defaultDeath = (type = "died") => {
            minecraft.world.sendMessage([{ translate: `message.kill.${type}`, with: [this.player.nameTag] }, { translate: isFinalKill }]);
        }

        /** 被其他玩家击杀样式，同时给予击杀者奖励
         * @param {"beKilled"|"beKilledVoid"|"beShot"|"beKilledFall"|"beKilledGolem"} type 触发的消息样式
         * @param {BedwarsPlayer} killerData 击杀者的起床战争信息
         */
        const killedByOthers = (type, killerData) => {
            const killer = killerData.player;
            minecraft.world.sendMessage([{ translate: `message.kill.${type}.${killerData.killStyle}`, with: [this.player.nameTag, killer.nameTag] }, { translate: isFinalKill }]);
            killerData.getBonus(this);
        };

        // 当该玩家已被淘汰时
        if (this.isEliminated) null;

        // 当玩家被其他玩家当场击杀时
        else if (killer && killer.typeId == "minecraft:player") {

            // 获取击杀者的起床战争信息
            const killerData = this.getMap().getBedwarsPlayer(killer);

            if (!killerData || !killerData.team) defaultDeath(); // 如果击杀者起床信息不存在，或击杀者起床信息的队伍不存在，则触发普通死亡样式（虽然实际运行过程中应该不太可能，但万一呢？）
            else if (this.deathType == "projectile") killedByOthers("beShot", killerData); // 被射杀
            else killedByOthers("beKilled", killerData); // 其他

        }

        // 当玩家被其他实体（例如蠹虫或铁傀儡）当场击杀时
        else if (killer) {

            // 获取该实体是否拥有主人信息
            /** @type {minecraft.Player|undefined} */
            const owner = killer.owner;
            const ownerData = this.getMap().getBedwarsPlayer(owner);

            if (!owner) defaultDeath(); // 如果不存在主人（比如万一是个僵尸呢），触发普通死亡样式
            else killedByOthers("beKilledGolem", ownerData); // 否则，是被其主人的傀儡击杀，给予其主人奖励

        }

        // 当玩家未被实际存在的实体击杀，但是有上一次攻击的玩家时
        else if (this.lastAttacker) {

            /** 上一个攻击者的起床战争信息 */
            const attackerData = this.getMap().getBedwarsPlayer(this.lastAttacker);

            if (this.deathType == "entityExplosion") killedByOthers("beKilled", attackerData); // 被其他玩家活活炸死（例如用火焰弹不断爆破）
            else if (this.deathType == "fall") killedByOthers("beKilledFall", attackerData); // 被其他玩家扔下去摔死
            else if (this.deathType == "void") killedByOthers("beKilledVoid", attackerData); // 被其他玩家扔到虚空
            else defaultDeath();

        }
        else if (this.deathType == "void") defaultDeath("fellIntoVoid"); // 如果自走虚空
        else defaultDeath(); // 其余所有情况

        // --- 其它功能 ---
        lib.ItemUtil.removeItem(this.player);
        this.player.setGameMode("Spectator");
        this.resetAttackedInfo();

    };

    /** 玩家受伤，并移除玩家的隐身状态
     * @param {minecraft.Player} attacker 伤害者，必须是拥有有效起床战争信息，且有队伍归属的玩家
     */
    beAttacked(attacker) {

        // 调整状态
        this.lastAttacker = attacker;
        this.timeSinceLastAttack = 0;

        // 移除隐身状态[debug]
        // if ( player.getComponent( "minecraft:is_sheared" ) ) {
        //     player.triggerEvent( "show_armor" );
        //     player.sendMessage( { translate: "message.beHitWhenInvisibility" } );
        // }

    };

    /** 重置受伤信息 */
    resetAttackedInfo() {
        this.lastAttacker = undefined;
        this.timeSinceLastAttack = 10;
    };

    /** 重生玩家 */
    respawn() {

        // 设置为非死亡状态
        this.isDead = false;
        this.respawnTime = 0;

        // 重置受伤信息
        this.resetAttackedInfo();

        // 工具降级并给予物品
        if (this.axeTier > 1) this.axeTier--;
        if (this.pickaxeTier > 1) this.pickaxeTier--;
        lib.ItemUtil.removeItem(this.player);
        this.giveEquipmentWhileSpawn();

        // 提醒玩家已经重生
        lib.PlayerUtil.setTitle(this.player, { translate: "title.respawned" }, "", { fadeInDuration: 0 });
        this.player.sendMessage({ translate: "message.respawned" });

        // 其他功能
        this.player.setGameMode("Survival");
        this.team.teleportPlayerToSpawnpoint(this.player);

    };

    // ===== 物品锁定 =====

    /** 锁定玩家物品栏的全部物品 */
    lockAllItems() {
        if (!this.itemLocked) {
            this.itemLocked = true;
            lib.InventoryUtil.lockAllItems(this.player, minecraft.ItemLockMode.inventory);
        }
    };

    /** 解锁玩家物品栏的全部物品 */
    unlockAllItems() {
        if (this.itemLocked) {
            this.itemLocked = false;
            lib.InventoryUtil.lockAllItems(this.player, minecraft.ItemLockMode.none);
            // 重新锁定特殊物品
            const stillLockItems = [
                "bedwars:map_settings",
                "bedwars:wooden_sword",
                "bedwars:wooden_pickaxe",
                "bedwars:iron_pickaxe",
                "bedwars:golden_pickaxe",
                "bedwars:diamond_pickaxe",
                "bedwars:wooden_axe",
                "bedwars:stone_axe",
                "bedwars:iron_axe",
                "bedwars:diamond_axe",
                "bedwars:shears",
            ];
            lib.InventoryUtil.getValidSlots(this.player).forEach(slot => {
                if (stillLockItems.includes(slot.slotContainer.getItem().typeId)) slot.slotContainer.lockMode = minecraft.ItemLockMode.inventory;
            });
        }
    }

    // ===== 物品 =====

    /** 生成时（游戏刚开始和重生时）给予装备 */
    giveEquipmentWhileSpawn() {
        /** @type {lib.EnchantmentInfo[]} */
        let enchantment = [];
        if (this.team.teamUpgrades.sharpenedSwords) enchantment = [{ id: "sharpness", level: 1 }];

        lib.ItemUtil.giveItem(this.player, "bedwars:wooden_sword", { itemLock: "inventory", enchantments: enchantment })
        if (this.pickaxeTier > 0) this.givePickaxe();
        if (this.axeTier > 0) this.giveAxe();
        this.giveShears();
        this.giveArmor();

    };

    /** 给予玩家镐子 */
    givePickaxe() {
        // 按照镐子等级给予玩家物品
        switch (this.pickaxeTier) {
            default:
                break;
            case 1:
                lib.ItemUtil.giveItem(this.player, "bedwars:wooden_pickaxe", { enchantments: [{ id: "efficiency", level: 1 }], itemLock: "inventory" });
                break;
            case 2:
                lib.ItemUtil.giveItem(this.player, "bedwars:iron_pickaxe", { enchantments: [{ id: "efficiency", level: 2 }], itemLock: "inventory" });
                break;
            case 3:
                lib.ItemUtil.giveItem(this.player, "bedwars:golden_pickaxe", { enchantments: [{ id: "efficiency", level: 3 }], itemLock: "inventory" });
                break;
            case 4:
                lib.ItemUtil.giveItem(this.player, "bedwars:diamond_pickaxe", { enchantments: [{ id: "efficiency", level: 3 }], itemLock: "inventory" });
                break;
        };
    };

    /** 给予玩家斧头 */
    giveAxe() {
        // 检查是否有锋利附魔团队升级
        let enchantment = (() => {
            switch (this.axeTier) {
                default: return [];
                case 1: return [{ id: "efficiency", level: 1 }];
                case 2: case 3: return [{ id: "efficiency", level: 2 }];
                case 4: return [{ id: "efficiency", level: 3 }];
            }
        })();
        if (this.team.teamUpgrades.sharpenedSwords) enchantment.push({ id: "sharpness", level: 1 });
        // 按照斧头等级给予玩家物品
        switch (this.axeTier) {
            default:
                break;
            case 1:
                lib.ItemUtil.giveItem(this.player, "bedwars:wooden_axe", { enchantments: enchantment, itemLock: "inventory" });
                break;
            case 2:
                lib.ItemUtil.giveItem(this.player, "bedwars:stone_axe", { enchantments: enchantment, itemLock: "inventory" });
                break;
            case 3:
                lib.ItemUtil.giveItem(this.player, "bedwars:iron_axe", { enchantments: enchantment, itemLock: "inventory" });
                break;
            case 4:
                lib.ItemUtil.giveItem(this.player, "bedwars:diamond_axe", { enchantments: enchantment, itemLock: "inventory" });
                break;
        };
    };

    /** 给予玩家剪刀 */
    giveShears() {
        if (this.hasShears) lib.ItemUtil.giveItem(this.player, "bedwars:shears", { itemLock: "inventory" });
    };

    /** 给予玩家盔甲 */
    giveArmor() {
        const armorTier = this.armorTier;

        // 附魔等级
        const protectionTier = this.team.teamUpgrades.reinforcedArmor;
        const featherFallingTier = this.team.teamUpgrades.cushionedBoots;
        /** @type {lib.EnchantmentInfo[]} */ let enchantment = [];
        /** @type {lib.EnchantmentInfo[]} */ let enchantmentForBoots = [];
        if (protectionTier > 0) enchantment.push({ id: "protection", level: protectionTier });
        if (featherFallingTier > 0) enchantmentForBoots.push({ id: "feather_falling", level: featherFallingTier });

        // 头盔与胸甲供应
        lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:${this.team.id}_helmet`, minecraft.EquipmentSlot.Head, { itemLock: "slot", enchantments: enchantment });
        lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:${this.team.id}_chestplate`, minecraft.EquipmentSlot.Chest, { itemLock: "slot", enchantments: enchantment });

        // 护腿与靴子供应
        switch (armorTier) {
            case 1: default:
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:${this.team.id}_leggings`, minecraft.EquipmentSlot.Legs, { itemLock: "slot", enchantments: enchantment });
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:${this.team.id}_boots`, minecraft.EquipmentSlot.Feet, { itemLock: "slot", enchantments: enchantmentForBoots });
                break;
            case 2:
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:chainmail_leggings`, minecraft.EquipmentSlot.Legs, { itemLock: "slot", enchantments: enchantment });
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:chainmail_boots`, minecraft.EquipmentSlot.Feet, { itemLock: "slot", enchantments: enchantmentForBoots });
                break;
            case 3:
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:iron_leggings`, minecraft.EquipmentSlot.Legs, { itemLock: "slot", enchantments: enchantment });
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:iron_boots`, minecraft.EquipmentSlot.Feet, { itemLock: "slot", enchantments: enchantmentForBoots });
                break;
            case 4:
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:diamond_leggings`, minecraft.EquipmentSlot.Legs, { itemLock: "slot", enchantments: enchantment });
                lib.ItemUtil.replaceEquipmentItem(this.player, `bedwars:diamond_boots`, minecraft.EquipmentSlot.Feet, { itemLock: "slot", enchantments: enchantmentForBoots });
                break;
        }

    };

};

// ===== 进入游戏后，开始运行系统 =====

minecraft.world.afterEvents.worldLoad.subscribe(() => {
    let bedwarsSystem = new BedwarsSystem();
    bedwarsSystem.settings.beforeGaming.waiting.minPlayerCount = 1;
    bedwarsSystem.settings.beforeGaming.waiting.gameStartWaitingTime = 1;
});
