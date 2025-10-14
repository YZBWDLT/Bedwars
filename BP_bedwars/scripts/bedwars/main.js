// ===== 模块导入 =====

import * as minecraft from "@minecraft/server"
import * as lib from "./lib";

// ===== 系统类定义 =====

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
    gameId = lib.js.randomInt(1000, 9999);

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

        /** 地图信息 @type {BedwarsMapInfo[]} */
        let maps = [];

        if (this.settings.mapEnabled.classicTwoTeamsEnabled) {
            for (let classicTwoTeamsMapName in mapData.classic.TwoTeams) {
                let bedwarsMap = mapData.classic.TwoTeams[classicTwoTeamsMapName];
                maps.push(bedwarsMap);
            };
        };

        let randomMap = maps[lib.js.randomInt(0, maps.length - 1)];
        if (randomMap.mode == "classic") {
            this.mode = new BedwarsClassicMode(this, new BedwarsMap(this, randomMap));
        }

    };

    /** 注册时间线
     * @param {BedwarsTimeline} timeline 待注册的时间线
     */
    subscribeTimeline(timeline) {
        lib.debug.sendMessage(`[系统] 已添加名为${timeline.typeId}的时间线。`);
        this.systemTimelines.push(timeline);
    };

    /** 注册事件
     * @param {BedwarsEvent} event 
     */
    subscribeEvent(event) {
        lib.debug.sendMessage(`[系统] 已添加名为${event.typeId}的事件。`);
        this.systemEvents.push(event);
    }

    /** 停止特定 ID 的时间线
     * @param {string} timelineTypeId 时间线 ID
    */
    unsubscribeTimeline(timelineTypeId) {
        let index = this.systemTimelines.findIndex(timeline => timeline.typeId == timelineTypeId);
        if (index != -1) {
            minecraft.system.clearRun(this.systemTimelines[index].id);
            this.systemTimelines.splice(index, 1);
            lib.debug.sendMessage(`[系统] 清除完毕！已销毁名为${timelineTypeId}的时间线。`);
        }
        else {
            lib.debug.sendMessage(`§e[系统] 未找到typeId为${timelineTypeId}的时间线。`);
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
            lib.debug.sendMessage(`[系统] 清除完毕！已销毁名为${eventTypeId}的事件。`);
        }
        else {
            lib.debug.sendMessage(`§e[系统] 未找到typeId为${eventTypeId}的事件。`);
        }

    };

    /** 停止所有时间线 */
    unsubscribeAllTimelines() {
        this.systemTimelines.forEach(timeline => {
            minecraft.system.clearRun(timeline.id);
        });
        this.systemTimelines = [];
        lib.debug.sendMessage(`[系统] 清除完毕！已销毁所有时间线。`);
    };

    /** 停止所有事件 */
    unsubscribeAllEvents() {
        this.systemEvents.forEach(systemEvent => {
            systemEvent.eventName.unsubscribe(systemEvent.id);
        });
        this.systemEvents = [];
        lib.debug.sendMessage(`[系统] 清除完毕！已销毁所有事件。`);
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

            /** 清除地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 */
            clearSpeed: 3,

            /** 加载地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 */
            loadSpeed: 3,

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

            /** 普通玩家重生的时长，单位：游戏刻 */
            normalPlayers: 110,

            /** 重进玩家重生的时长，单位：游戏刻 */
            rejoinedPlayers: 200

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

    /** 显示游戏前的信息板 */
    showBeforeGamingInfoBoardTimeline() {
        return new BedwarsTimeline(
            "showBeforeGamingInfoboard",
            minecraft.system.runInterval(() => {
                lib.player.getAll().forEach(player => this.beforeGamingInfoboard(player))
            }, 20)
        );
    };

    /** 对玩家显示信息板
     * @param {minecraft.Player} player 
     */
    beforeGamingInfoboard(player) {

        /** 当前进度文本 */
        let progressText = (() => {

            /** 文本库 */
            let progressTexts = [
                `§f清除原地图中... §7${Math.ceil(this.clearingLayer * 6 / 20 / this.getLayerClearSpeed())}秒§r`, // 清除地图状态使用
                `§f生成地图中... §7${this.loadTimeCountdown}秒§r`, // 生成地图状态使用
                `§f等待中...§7还需${this.system.settings.beforeGaming.waiting.minPlayerCount - lib.player.getAmount()}人§r`, // 等待状态（玩家不足时）使用
                `§f即将开始： §a${this.gameStartCountdown}秒§r`, // 等待状态（玩家充足）使用
            ];

            // 在文本库中选择文本
            if (this.system.gameStage == 0) return progressTexts[0];
            else if (this.system.gameStage == 1) return progressTexts[1];
            else {
                if (lib.player.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) return progressTexts[2];
                else return progressTexts[3]
            }
        })();

        let infoboardTexts = [
            "§l§e     起床战争     ",
            `§8${this.system.gameId}`,
            "",
            `§f地图： §a${this.map.name}`,
            `§f玩家： §a${lib.player.getAmount()}/${this.system.settings.beforeGaming.waiting.maxPlayerCount}`,
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
                lib.player.getAll().forEach(player => {
                    // 如果不是管理员玩家，则设置为冒险模式，并在超出限制区域时拉回来
                    if (player.playerPermissionLevel < 2) {
                        player.setGameMode("Adventure");
                        if (!lib.entity.isInVolume(player, new minecraft.BlockVolume({ x: -12, y: 119, z: -12 }, { x: 12, y: 129, z: 12 }))) player.teleport({ x: 0, y: 121, z: 0 });
                    }
                    // 反之，如果是管理员玩家，则在没有设置物品时给予一个设置物品
                    else {
                        if (!lib.inventory.hasItem(player, "bedwars:map_settings")) lib.item.giveItem(player, "bedwars:map_settings", { itemLock: "inventory" });
                    }
                    // 如果启用了自主选队和击杀样式，则在玩家没有对应物品时给予物品
                    if (!lib.inventory.hasItem(player, "bedwars:select_team") && this.system.settings.beforeGaming.teamAssign.playerSelectEnabled) lib.item.giveItem(player, "bedwars:select_team", { itemLock: "inventory" });
                    if (!lib.inventory.hasItem(player, "bedwars:kill_style") && this.system.settings.gaming.killStyle.isEnabled) lib.item.giveItem(player, "bedwars:kill_style", { itemLock: "inventory" });
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
                        bedwarsLib.warnPlayer(breaker, { translate: "message.breakingInvalidBlocks" });
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
        player.runCommand(`clear @s`);

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
        lib.entity.removeAll();

        // 初始化玩家
        lib.player.getAll().forEach(player => this.initPlayer(player));

        // 移除除 data、killStyle 之外的记分板
        lib.scoreboard.objective.getAll().filter(obj => !["data", "killStyle"].includes(obj.id)).forEach(obj => minecraft.world.scoreboard.removeObjective(obj));

        // 如果没有 data、health、killStyle 和 selectTeam 记分板，则新增之
        lib.scoreboard.objective.add("data", "数据");
        lib.scoreboard.objective.add("killStyle", "击杀样式");
        lib.scoreboard.objective.add("selectTeam", "选队数据");
        lib.scoreboard.objective.add("health", "§c❤");

        // 地图大小同步
        lib.debug.sendMessage(`§c[系统][警告] 未同步地图大小！`)
        // let prevX = getScore( "data", "mapSize.prevX" );
        // let prevZ = getScore( "data", "mapSize.prevZ" );
        // if ( prevX !== undefined ) { this.mapSize.prevX = prevX }
        // if ( prevZ !== undefined ) { this.mapSize.prevZ = prevZ }
        // setScore( "data", "mapSize.prevX", this.mapSize.x );
        // setScore( "data", "mapSize.prevZ", this.mapSize.z );

        // 加载等待区结构
        lib.structure.placeAsync("hypixel:waiting_hall", "overworld", { x: -12, y: 117, z: -12 });

        // 设置世界出生点
        minecraft.world.setDefaultSpawnLocation({ x: 0, y: 121, z: 0 });

        // 注册时间线
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧信息板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块

        // 在有玩家进入前，等待玩家进入后清除，有玩家时则直接清除
        if (lib.player.getAmount() < 1) this.system.subscribeEvent(this.playerSpawnWhenClearingMapEvent()); // 当有玩家进入后，再清除地图
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

    }

    /** 清空地图状态的时间线 */
    clearMapTimeline() {
        return new BedwarsTimeline(
            "clearMap",
            minecraft.system.runInterval(() => { // 每 6 * clearLayer 刻执行 1 次
                // 清除对应层数，每次执行时层数递减
                this.clearingLayer--;
                for (let i of [-1, 1]) {
                    for (let j of [-1, 1]) {
                        /** 填充起始点 @type {import("@minecraft/server").Vector3} */
                        let from = { x: 0, y: this.clearingLayer, z: 0 };
                        /** 填充终止点 @type {import("@minecraft/server").Vector3} */
                        let to = { x: i * this.map.size.x, y: this.clearingLayer, z: j * this.map.size.z };
                        lib.dimension.fillBlock("overworld", from, to, "minecraft:air");
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
        lib.debug.sendMessage(`§c[系统][警告] 未恢复设置数据！`);
    };

    // ===== 生成地图状态 =====

    /** 进入生成地图状态，仅在进入此状态时执行一次 */
    entryGenerateMapState() {

        // 加载边界
        for (let i of [-1, 1]) {
            for (let j of [-1, 1]) {
                /** 填充起始点 @type {import("@minecraft/server").Vector3} */
                let from = { x: i * this.map.size.x, y: 0, z: i * this.map.size.z };
                /** 填充终止点 @type {import("@minecraft/server").Vector3} */
                let to = { x: j * this.map.size.x, y: 0, z: j * this.map.size.z * (-1) };
                lib.dimension.fillBlock("overworld", from, to, "minecraft:border_block");
            }
        };

        // 加载结构（异步加载，依次加载）
        (async () => {

            // 加载队伍岛屿
            for (const teamIsland of this.map.teamIslands) {
                await lib.structure.placeAsync(`${this.map.id}:team_island`, "overworld", teamIsland.location, { animationMode: "Layers", animationSeconds: teamIsland.loadTime / this.map.getStructureLoadSpeed(), rotation: teamIsland.rotation, mirror: teamIsland.mirror });
                if (!this.map.disableTeamIslandFlag) lib.dimension.replaceBlock("overworld", teamIsland.flagLocationFrom, teamIsland.flagLocationTo, ["minecraft:white_wool"], `minecraft:${teamIsland.teamId}_wool`);
            }

            // 加载普通岛屿
            for (const island of this.map.islands) {
                await lib.structure.placeAsync(`${this.map.id}:${island.structureName}`, "overworld", island.location, { animationMode: "Layers", animationSeconds: island.loadTime / this.map.getStructureLoadSpeed(), rotation: island.rotation, mirror: island.mirror });
            }

            // 加载床
            this.map.teams.forEach(team => team.placeBed());

            // 移除其他实体
            lib.entity.removeAll();

            // 加载完毕后，离开此状态
            this.exitGenerateMapState();

        })();

        // 注册时间线
        this.system.subscribeTimeline(this.calculateLoadTimeCountdownTimeline()); // 倒计时显示
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧信息板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块

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
        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块

        // 人数检查的时间线和事件
        if (lib.player.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) // 人数不足时注册的时间线和事件
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
                if (lib.player.getAmount() >= this.system.settings.beforeGaming.waiting.minPlayerCount) {
                    lib.debug.sendMessage(`[系统] 符合转换条件！开始游戏倒计时。`);

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
                if (lib.player.getAmount() < this.system.settings.beforeGaming.waiting.minPlayerCount) {
                    // 重置倒计时
                    this.gameStartCountdown = this.system.settings.beforeGaming.waiting.gameStartWaitingTime;
                    // 提醒玩家倒计时已取消
                    lib.player.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.needsMorePlayer" });
                        player.onScreenDisplay.setTitle({ translate: "title.needsMorePlayer" }, { fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 0 });
                        player.playSound("note.hat", { location: player.location });
                    })
                    lib.debug.sendMessage(`[系统] 符合转换条件！中止游戏倒计时。`)
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
                lib.player.getAll().forEach(player => this.beforeGamingInfoboard(player));
                // 提醒玩家还有多长时间开始游戏
                if (this.gameStartCountdown == 20) {
                    lib.player.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`20`] });
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown == 10) {
                    lib.player.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`§610`] });
                        player.onScreenDisplay.setTitle(`§a10`, { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 })
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown <= 5 && this.gameStartCountdown > 0) {
                    lib.player.getAll().forEach(player => {
                        player.sendMessage({ translate: "message.gameStart", with: [`§c${this.gameStartCountdown}`] });
                        player.onScreenDisplay.setTitle(`§c${this.gameStartCountdown}`, { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 })
                        player.playSound("note.hat", { location: player.location });
                    });
                }
                else if (this.gameStartCountdown <= 0) {
                    lib.debug.sendMessage(`[系统] 符合条件！已退出等待状态。`)
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
        }

        // 如果没有 killStyle 和 selectTeam 记分板，则新增之，防止后续代码报错
        lib.scoreboard.objective.add("killStyle", "击杀样式");
        lib.scoreboard.objective.add("selectTeam", "选队数据");

        // 设置为允许 PVP
        minecraft.world.gameRules.pvp = true;

        // 设置商人
        this.map.setTraders();

        // 移除等待大厅
        lib.dimension.fillBlock("overworld", { x: -12, y: 117, z: -12 }, { x: 12, y: 127, z: 12 }, "minecraft:air");

        // 在重生点下方放置一块屏障（防止薛定谔玩家复活时判定失败）
        minecraft.world.getDimension("overworld").setBlockType({ x: 0, y: this.map.spawnpoint.y - 2, z: 0 }, "minecraft:barrier")

        // 令每队的玩家初始化
        this.map.teams.forEach(team => team.players.forEach(playerInfo => {
            let player = playerInfo.player;

            // 传送玩家
            team.teleportPlayerToSpawnpoint(player);

            // 设置游戏模式
            player.setGameMode("Survival");

            // 提示玩家游戏玩法
            /** @type {(import("@minecraft/server").RawMessage | string)[]} */
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
            let killStyles = Object.keys(killStyle);
            if (!this.system.settings.gaming.killStyle.isEnabled) playerInfo.killStyle = killStyle.default;
            else if (this.system.settings.gaming.killStyle.randomKillStyle) playerInfo.killStyle = killStyles[lib.js.randomInt(0, killStyles - 1)];
            else playerInfo.killStyle = killStyles[lib.scoreboard.player.getOrSetDefault("killStyle", player, 0)];

            // 移除玩家的设置物品
            player.runCommand(`clear @s bedwars:kill_style`);
            player.runCommand(`clear @s bedwars:select_team`);

        }));

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块

        // 床虱击中事件
        this.system.subscribeEvent(this.bedBugHitBlockEvent());
        this.system.subscribeEvent(this.bedBugHitEntityEvent());

    };

    /** 离开游戏状态，仅在退出此状态时执行一次 */
    exitGamingState() {
    };

    // --- 床虱 ---

    /** 床虱击中方块事件，击中后生成床虱 */
    bedBugHitBlockEvent() {
        return new BedwarsEvent(
            "bedBugHitBlock",
            minecraft.world.afterEvents.projectileHitBlock,
            minecraft.world.afterEvents.projectileHitBlock.subscribe(event => this.summonBedBug(event))
        )
    };

    /** 床虱击中实体事件，击中后生成床虱 */
    bedBugHitEntityEvent() {
        return new BedwarsEvent(
            "bedBugHitEntity",
            minecraft.world.afterEvents.projectileHitEntity,
            minecraft.world.afterEvents.projectileHitEntity.subscribe(event => this.summonBedBug(event))
        )

    };

    /** 床虱计时器，用于设定床虱的名字和倒计时 */
    bedBugCountdownTimeline() {
        return new BedwarsTimeline(
            "bedBugCountdown",
            minecraft.system.runInterval(() => {
                const silverfishes = minecraft.world.getDimension("overworld").getEntities({ type: "minecraft:silverfish" }).filter(silverfish => silverfish.killTimer != undefined);
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
                    const index = Math.floor(silverfish.killTimer / 60);
                    const bars = "■■■■■";
                    const timePassedColor = silverfish.team.id === "gray" ? "§8" : "§7";
                    if (index >= 0 && index <= 4) {
                        return bars.slice(0, 5 - index) + timePassedColor + bars.slice(5 - index);
                    }
                    return `${timePassedColor}■■■■■`;
                };
            };

            // 当没有床虱时间线时，触发床虱时间线
            if (this.system.getTimeline("bedBugCountdown") != undefined) this.system.subscribeTimeline(this.bedBugCountdownTimeline());

        };
    };

    playerBreakBedEvent() {
        return new BedwarsEvent(
            "playerBreakBed",
            minecraft.world.afterEvents.playerBreakBlock,
            minecraft.world.afterEvents.playerBreakBlock.subscribe(event => {

            }, { blockTypes: ["minecraft:bed"] })
        );
    };

    // ===== 结束状态 =====

    /** 进入结束状态，仅在进入此状态时执行一次 */
    entryGameOverState() {
        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
    };

    /** 离开结束状态，仅在退出此状态时执行一次 */
    exitGameOverState() {
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

// ===== 其他类定义 =====

/** @enum {string} 所有可用的队伍 */
const validTeams = {
    red: "red",
    blue: "blue",
    yellow: "yellow",
    green: "green",
    pink: "pink",
    cyan: "cyan",
    white: "white",
    gray: "gray",
    purple: "purple",
    brown: "brown",
    orange: "orange",
};

/**
 * @typedef BedwarsMapInfo 地图信息
 * @property {string} id ID，它将控制地图的运行方式
 * @property {string} name 名称，它将按照给定名称在游戏开始前显示出来
 * @property {"classic"|"capture"} mode 模式，该地图将按照什么模式执行
 * @property {BedwarsTeamInfo[]} teams 队伍信息
 * @property {TraderInfo[]} traders 商人信息，包括位置、朝向、类型
 * @property {TeamIslandInfo[]} teamIslands 队伍岛屿信息
 * @property {IslandInfo[]} islands 其他岛屿信息
 * @property {import("@minecraft/server").Vector3[]} diamondSpawnerLocation 钻石生成点位置
 * @property {import("@minecraft/server").Vector3[]} emeraldSpawnerLocation 绿宝石生成点位置
 * @property {number} [sizeX] 地图的 x 方向半边长大小
 * @property {number} [sizeZ] 地图的 z 方向半边长大小
 * @property {boolean} [clearVelocity] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源
 * @property {boolean} [distributeResource] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源
 * @property {number} [ironSpawnTimes] 一次最多生成铁的数量
 * @property {number} [heightLimitMax] 最高高度限制，在高于此高度的位置放置方块会阻止
 * @property {number} [heightLimitMin] 最低高度限制，在低于此高度的位置放置方块会阻止
 * @property {number} [healPoolRadius] 治愈池半径
 * @property {boolean} [disableTeamIslandFlag] 是否在本地图禁用旗帜
 */

/**
 * @typedef SpawnerInfo 资源生成点信息
 * @property {import("@minecraft/server").Vector3} location 资源点位置
 * @property {number} spawnedTimes 生成次数
 */

/**
 * @typedef TraderInfo 商人信息
 * @property {import("@minecraft/server").Vector3} location 商人位置
 * @property {number} rotation 商人旋转角度，为 0°~360°
 * @property {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"} type 商人信息
 */

/** 
 * @typedef TeamIslandInfo 队伍岛屿信息
 * @property {validTeams} teamId 队伍 ID，决定生成何种颜色的羊毛
 * @property {import("@minecraft/server").Vector3} location 岛屿结构加载位置
 * @property {number} loadTime 加载结构所需时间，单位：秒
 * @property {import("@minecraft/server").Vector3} [flagLocationFrom] 旗帜位置起始点
 * @property {import("@minecraft/server").Vector3} [flagLocationTo] 旗帜位置终止点
 * @property {boolean} [disableFlag] 是否禁止本地图的旗帜
 * @property {"X"|"Z"|"XZ"} [mirror] 岛屿是否镜像加载
 * @property {"None"|"Rotate90"|"Rotate180"|"Rotate270"} [rotation] 岛屿是否镜像加载
 */

/** 
 * @typedef IslandInfo 其他岛屿信息
 * @property {string|"diamond_island"|"center_island"|"side_island"} structureName 结构名称，预设的有：diamond_island、center_island、side_island，也可能有其他搭配，见详细结构配置
 * @property {import("@minecraft/server").Vector3} location 岛屿结构加载位置
 * @property {number} loadTime 加载结构所需时间，单位：秒
 * @property {"X"|"Z"|"XZ"} [mirror] 岛屿是否镜像加载
 * @property {"None"|"Rotate90"|"Rotate180"|"Rotate270"} [rotation] 岛屿是否镜像加载
 */

/**
 * @typedef StartIntro 开始游戏时的介绍
 * @property {import("@minecraft/server").RawMessage} title 开始游戏时的标题，例如“起床战争（经典模式）”
 * @property {import("@minecraft/server").RawMessage} intro 开始游戏时的玩法内容，例如“保护你的床并摧毁敌人的床……”
 */

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

        /** 钻石点位置与生成次数信息 @type {SpawnerInfo[]} */
        info: []

    };

    /** 绿宝石生成点信息 */
    emeraldSpawnerInfo = {

        /** 绿宝石点等级 */
        level: 1,

        /** 距离下次生成剩余的时长，单位：游戏刻 */
        countdown: 1300,

        /** 绿宝石点位置与生成次数信息 @type {SpawnerInfo[]} */
        info: []

    };

    /** 一次最多生成铁的数量 */
    ironSpawnTimes = 5;

    /** 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源 */
    distributeResource = true;

    /** 生成资源时是否清除向量，否则资源将会在生成时溅开 */
    clearVelocity = true;

    /** 重生点，重生时将按照旁观模式玩家的身份重生在此处 @type {import("@minecraft/server").Vector3} */
    spawnpoint = { x: 0, y: 100, z: 0 };

    /** 队伍数，常见的有 2 队地图、4 队地图、8 队地图 */
    teamCount = 0;

    /** 队伍信息 @type {BedwarsTeam[]} */
    teams = [];

    /** 旁观玩家信息 @type {BedwarsPlayer[]} */
    spectatorPlayers = [];

    /** 商人信息，包括位置、朝向、类型 @type {TraderInfo[]} */
    traders = [];

    /** 队伍岛屿信息 @type {TeamIslandInfo[]} */
    teamIslands = [];

    /** 其他岛屿信息 @type {IslandInfo[]} */
    islands = [];

    /** 最高高度限制，在高于此高度的位置放置方块会阻止 */
    heightLimitMax = 110;

    /** 最低高度限制，在低于此高度的位置放置方块会阻止 */
    heightLimitMin = 50;

    /** 治愈池半径 */
    healPoolRadius = 20;

    /** 是否在本地图禁用旗帜 */
    disableTeamIslandFlag = false;

    /** 地图大小 */
    size = {

        /** x 方向半边长（地图的 x 最大值） */
        x: 105,

        /** x 方向半边长（地图的 x 最大值） */
        z: 105,

    };

    /**
     * @param {BedwarsSystem} system 系统信息
     * @param {BedwarsMapInfo} info 地图信息
     */
    constructor(system, info) {
        this.system = system;
        this.id = info.id;
        this.name = info.name;
        this.mode = info.mode;
        info.teams.forEach(team => this.addTeam(team));
        this.teamIslands = info.teamIslands;
        this.islands = info.islands;
        this.traders = info.traders;
        info.diamondSpawnerLocation.forEach(location => this.addDiamondSpawner(location));
        info.emeraldSpawnerLocation.forEach(location => this.addEmeraldSpawner(location));
        if (info.ironSpawnTimes) this.ironSpawnTimes = info.ironSpawnTimes;
        if (info.distributeResource) this.distributeResource = info.distributeResource;
        if (info.clearVelocity) this.clearVelocity = info.clearVelocity;
        if (info.heightLimitMax) this.heightLimitMax = info.heightLimitMax;
        if (info.heightLimitMin) this.heightLimitMin = info.heightLimitMin;
        if (info.healPoolRadius) this.healPoolRadius = info.healPoolRadius;
        if (info.disableTeamIslandFlag) this.disableTeamIslandFlag = info.disableTeamIslandFlag;
    };

    /** 为地图添加队伍
     * @param {BedwarsTeamInfo} teamInfo 
     */
    addTeam(teamInfo) {
        this.teams.push(new BedwarsTeam(this.system, teamInfo));
        this.teamCount += 1;
    };

    /** 添加新的钻石生成点
     * @param {import("@minecraft/server").Vector3} location 
     */
    addDiamondSpawner(location) {
        /** @type {SpawnerInfo} */
        const spawnerInfo = { location: location, spawnedTimes: 1 };
        this.diamondSpawnerInfo.info.push(spawnerInfo);
    };

    /** 添加新的绿宝石生成点
     * @param {import("@minecraft/server").Vector3} location 
     */
    addEmeraldSpawner(location) {
        /** @type {SpawnerInfo} */
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
        let playerAmount = lib.player.getAmount();

        /** 设置规定的上限人数 */
        let maxPlayerAmount = this.system.settings.beforeGaming.waiting.maxPlayerCount;

        /** 队伍分配模式，0：标准组队，1：随机组队，2：胜率组队 */
        const assignMode = this.system.settings.beforeGaming.teamAssign.mode;

        /** 所有队伍列表并打乱顺序 @type {BedwarsTeam[]} */
        let teams = lib.js.shuffleArray([...this.teams]);

        /** 所有玩家列表并打乱顺序 @type {minecraft.Player[]} */
        let players = lib.js.shuffleArray([...minecraft.world.getPlayers()]);

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
            const selectTeamObj = lib.scoreboard.objective.get("selectTeam");

            // 排除掉记分板中已经离线的玩家
            lib.scoreboard.player.getOfflinePlayers(selectTeamObj.id).forEach(player => selectTeamObj.removeParticipant(player));

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
        if (assignMode === 2) lib.debug.sendMessage(`§c[系统][警告] 未按照胜率重新排序玩家！`);

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
     */
    getBedwarsPlayer(player) {
        let result = this.teams.map(team => team.players.find(bedwarsPlayer => bedwarsPlayer.player.id == player.id))[0];
        lib.debug.printObject(result);
        if (result !== undefined) return result;
        else return this.spectatorPlayers.find(bedwarsPlayer => bedwarsPlayer.player.id == player.id);
    };

    /** 设置商人 */
    setTraders() {

        this.traders.forEach(traderData => {

            // 生成商人并确定朝向、类型和皮肤
            let trader = minecraft.world.getDimension("overworld").spawnEntity("bedwars:trader", lib.position3.center(traderData.location));
            trader.setRotation({ x: 0, y: traderData.rotation });
            trader.triggerEvent(`${traderData.type}_trader`);
            trader.triggerEvent(`assign_skin_randomly`);

            // 设定名字
            if (traderData.type === "blocks_and_items") trader.nameTag = `§a方块与物品`;
            else if (traderData.type === "weapon_and_armor") trader.nameTag = `§c武器与盔甲`;
            else trader.nameTag = `§b团队升级`;

        });

    };

    /** 获取游戏开始介绍 */
    getStartIntro() {
        /** @type {StartIntro} */
        const startIntro = {
            title: { translate: `message.gameStartTitle.${this.mode}` },
            intro: { translate: `message.gameStartIntroduction.${this.mode}` }
        };
        return startIntro;
    };

};

/** 所有地图数据 */
const mapData = {

    /** 经典模式地图数据 */
    classic: {

        /** 2 队地图 */
        TwoTeams: {

            /** 地图：神秘 @type {BedwarsMapInfo} */
            cryptic: {
                id: "cryptic",
                name: "神秘",
                mode: "classic",
                teams: [
                    {
                        id: validTeams.red,
                        bedLocation: { x: 2, y: 77, z: 73 },
                        bedRotation: "Rotate90",
                        resourceLocation: { x: 2, y: 78, z: 90 },
                        spawnpointLocation: { x: 2, y: 78, z: 85 },
                        chestLocation: { x: -1, y: 78, z: 81 },
                    },
                    {
                        id: validTeams.blue,
                        bedLocation: { x: 2, y: 77, z: -73 },
                        bedRotation: "Rotate270",
                        resourceLocation: { x: 2, y: 78, z: -90 },
                        spawnpointLocation: { x: 2, y: 78, z: -85 },
                        chestLocation: { x: -1, y: 78, z: -81 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: validTeams.red,
                        location: { x: -12, y: 61, z: 63 },
                        loadTime: 2,
                        flagLocationFrom: { x: 8, y: 84, z: 78 },
                        flagLocationTo: { x: -4, y: 87, z: 92 },
                    },
                    {
                        teamId: validTeams.blue,
                        location: { x: -12, y: 61, z: -95 },
                        loadTime: 2,
                        mirror: "X",
                        flagLocationFrom: { x: -4, y: 84, z: 78 },
                        flagLocationTo: { x: 8, y: 87, z: -92 },
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: 53, y: 49, z: -15 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -75, y: 54, z: -15 },
                        loadTime: 2,
                        mirror: "Z",
                    },
                    {
                        structureName: "center_island_1",
                        location: { x: -33, y: 41, z: -29 },
                        loadTime: 17,
                    },
                    {
                        structureName: "center_island_2",
                        location: { x: 31, y: 41, z: -29 },
                        loadTime: 1,
                    },

                ],
                traders: [
                    {
                        location: { x: -2, y: 78, z: 87 },
                        rotation: 270,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: 6, y: 78, z: -87 },
                        rotation: 90,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: -2, y: 78, z: 85 },
                        rotation: 270,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: 6, y: 78, z: -85 },
                        rotation: 90,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: 6, y: 78, z: 86 },
                        rotation: 90,
                        type: "team_upgrade"
                    },
                    {
                        location: { x: -3, y: 78, z: -86 },
                        rotation: 270,
                        type: "team_upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: -70, y: 78, z: 0 },
                    { x: 70, y: 73, z: 0 }
                ],
                emeraldSpawnerLocation: [
                    { x: 21, y: 68, z: 0 },
                    { x: -25, y: 81, z: 0 }
                ],
                heightLimitMax: 102,
                heightLimitMin: 67,
                healPoolRadius: 25,
                distributeResource: false,
            },

            /** 地图：极寒 @type {BedwarsMapInfo} */
            frost: {
                id: "frost",
                name: "极寒",
                mode: "classic",
                teams: [
                    {
                        id: validTeams.red,
                        bedLocation: { x: 0, y: 72, z: 59 },
                        bedRotation: "Rotate90",
                        resourceLocation: { x: 0, y: 72, z: 75 },
                        spawnpointLocation: { x: 0, y: 72, z: 70 },
                        chestLocation: { x: 4, y: 72, z: 68 },
                    },
                    {
                        id: validTeams.blue,
                        bedLocation: { x: 0, y: 72, z: -59 },
                        bedRotation: "Rotate270",
                        resourceLocation: { x: 0, y: 72, z: -75 },
                        spawnpointLocation: { x: 0, y: 72, z: -70 },
                        chestLocation: { x: 4, y: 72, z: -68 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: validTeams.red,
                        location: { x: -13, y: 55, z: 55 },
                        loadTime: 2,
                    },
                    {
                        teamId: validTeams.blue,
                        location: { x: -13, y: 55, z: -81 },
                        loadTime: 2,
                        mirror: "X",
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: 29, y: 60, z: -20 },
                        loadTime: 1,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -46, y: 60, z: -2 },
                        rotation: "Rotate180",
                        loadTime: 1,
                    },
                    {
                        structureName: "center_island",
                        location: { x: -13, y: 56, z: -22 },
                        loadTime: 4,
                    },

                ],
                traders: [
                    {
                        location: { x: -6, y: 72, z: 72 },
                        rotation: 270,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: 6, y: 72, z: -72 },
                        rotation: 90,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: -6, y: 72, z: 70 },
                        rotation: 270,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: 6, y: 72, z: -70 },
                        rotation: 90,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: 6, y: 72, z: 71 },
                        rotation: 90,
                        type: "team_upgrade"
                    },
                    {
                        location: { x: -6, y: 72, z: -71 },
                        rotation: 270,
                        type: "team_upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: 38, y: 75, z: -10 },
                    { x: -38, y: 73, z: 10 }
                ],
                emeraldSpawnerLocation: [
                    { x: 0, y: 76, z: -12 },
                    { x: 0, y: 76, z: 12 }
                ],
                heightLimitMax: 97,
                heightLimitMin: 69,
                healPoolRadius: 15,
                distributeResource: false,
                disableTeamIslandFlag: true
            },

            /** 地图：花园 @type {BedwarsMapInfo} */
            garden: {
                id: "garden",
                name: "花园",
                mode: "classic",
                teams: [
                    {
                        id: validTeams.red,
                        bedLocation: { x: 79, y: 77, z: 0 },
                        resourceLocation: { x: 98, y: 79, z: 0 },
                        spawnpointLocation: { x: 94, y: 79, z: 0 },
                        chestLocation: { x: 91, y: 79, z: 4 },
                    },
                    {
                        id: validTeams.blue,
                        bedLocation: { x: -79, y: 77, z: 0 },
                        bedRotation: "Rotate180",
                        resourceLocation: { x: -98, y: 79, z: 0 },
                        spawnpointLocation: { x: -94, y: 79, z: 0 },
                        chestLocation: { x: -91, y: 79, z: 4 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: validTeams.red,
                        location: { x: 73, y: 69, z: -15 },
                        loadTime: 2,
                        flagLocationFrom: { x: 91, y: 79, z: -8 },
                        flagLocationTo: { x: 91, y: 84, z: 8 },
                    },
                    {
                        teamId: validTeams.blue,
                        location: { x: -104, y: 69, z: -15 },
                        loadTime: 2,
                        mirror: "Z",
                        flagLocationFrom: { x: -91, y: 79, z: 8 },
                        flagLocationTo: { x: -91, y: 84, z: -8 },
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -20, y: 64, z: -65 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -20, y: 64, z: 60 },
                        loadTime: 2,
                        mirror: "X",
                    },
                    {
                        structureName: "center_island",
                        location: { x: -30, y: 54, z: -30 },
                        loadTime: 12,
                    },

                ],
                traders: [
                    {
                        location: { x: 95, y: 79, z: 8 },
                        rotation: 180,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: -95, y: 79, z: -8 },
                        rotation: 0,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: 93, y: 79, z: 8 },
                        rotation: 180,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: -93, y: 79, z: -8 },
                        rotation: 0,
                        type: "weapon_and_armor"
                    },
                    {
                        location: { x: 94, y: 79, z: -8 },
                        rotation: 0,
                        type: "team_upgrade"
                    },
                    {
                        location: { x: -94, y: 79, z: 8 },
                        rotation: 180,
                        type: "team_upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: 0, y: 77, z: -52 },
                    { x: 0, y: 77, z: 52 }
                ],
                emeraldSpawnerLocation: [
                    { x: -21, y: 76, z: -21 },
                    { x: 21, y: 76, z: 21 }
                ],
                heightLimitMax: 97,
                heightLimitMin: 67,
                healPoolRadius: 21,
            },

            /** 地图：狮庙 @type {BedwarsMapInfo} */
            lionTemple: {
                id: "lion_temple",
                name: "狮庙",
                mode: "classic",
                teams: [
                    {
                        id: validTeams.red,
                        bedLocation: { x: -2, y: 73, z: 58 },
                        bedRotation: "Rotate90",
                        resourceLocation: { x: -2, y: 75, y: 78 },
                        spawnpointLocation: { x: -2, y: 75, y: 73 },
                        chestLocation: { x: 2, y: 75, z: 68 },
                    },
                    {
                        id: validTeams.blue,
                        bedLocation: { x: -2, y: 73, z: -58 },
                        bedRotation: "Rotate270",
                        resourceLocation: { x: -2, y: 75, y: -78 },
                        spawnpointLocation: { x: -2, y: 75, y: -73 },
                        chestLocation: { x: 2, y: 75, z: -68 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: validTeams.red,
                        location: { x: -13, y: 61, z: 53 },
                        loadTime: 2,
                        flagLocationFrom: { x: 6, y: 74, z: 65 },
                        flagLocationTo: { x: -10, y: 86, z: 81 },
                    },
                    {
                        teamId: validTeams.blue,
                        location: { x: -13, y: 61, z: -84 },
                        mirror: "X",
                        loadTime: 2,
                        flagLocationFrom: { x: -10, y: 74, z: -65 },
                        flagLocationTo: { x: 6, y: 86, z: -81 },
                    }
                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -69, y: 66, z: -13 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: 43, y: 66, z: -13 },
                        loadTime: 2,
                        rotation: "Rotate180",
                    },
                    {
                        structureName: "center_island",
                        location: { x: -34, y: 55, z: -25 },
                        loadTime: 11,
                    }
                ],
                traders: [
                    {
                        location: { x: -7, y: 75, z: 73 },
                        rotation: 270,
                        type: "blocks_and_items",
                    },
                    {
                        location: { x: 3, y: 75, z: -73 },
                        rotation: 90,
                        type: "blocks_and_items"
                    },
                    {
                        location: { x: -7, y: 75, z: 71 },
                        rotation: 270,
                        type: "weapon_and_armor",
                    },
                    {
                        location: { x: 3, y: 75, z: -71 },
                        rotation: 90,
                        type: "weapon_and_armor",
                    },
                    {
                        location: { x: 3, y: 75, z: 72 },
                        rotation: 90,
                        type: "team_upgrade",
                    },
                    {
                        location: { x: -7, y: 75, z: -72 },
                        rotation: 270,
                        type: "team_upgrade",
                    }
                ],
                diamondSpawnerLocation: [
                    { x: 53, y: 83, z: 0 },
                    { x: -58, y: 83, z: 0 }
                ],
                emeraldSpawnerLocation: [
                    { x: -20, y: 77, z: 0 },
                    { x: 17, y: 82, z: 0 }
                ],
                heightLimitMax: 100,
                heightLimitMin: 69,
                healPoolRadius: 18,
                distributeResource: false,
                ironSpawnTimes: 1,
            },

            // picnic: {},
            // ruins: {}

        },

        /** 4 队地图 */
        FourTeams: {
            aquarium: {},
            archway: {},
            boletum: {},
            carapace: {},
            chained: {},
            eastwood: {},
            orchid: {},
        },

        /** 8 队地图 */
        EightTeams: {
            amazon: {},
            deadwood: {},
            glacier: {},
            lighthouse: {},
            playground: {},
            rooftop: {},
            waterfall: {}
        },

    },

    capture: {
        TwoTeams: {
            picnic: {}
        }
    },

};

/**
 * @typedef BedwarsTeamInfo 队伍信息
 * @property {validTeams} id ID，代表一个独一无二的队伍
 * @property {import("@minecraft/server").Vector3} bedLocation 床的位置
 * @property {"None"|"Rotate90"|"Rotate180"|"Rotate270"} [bedRotation] 床的旋转
 * @property {import("@minecraft/server").Vector3} resourceLocation 资源点的位置，若为分散式生成资源应选取中心点
 * @property {import("@minecraft/server").Vector3} spawnpointLocation 重生点的位置，若玩家能够重生则重生到此位置上
 * @property {import("@minecraft/server").Vector3} chestLocation 箱子的位置
 */

/** 起床战争队伍，代表每个队伍的状态 */
class BedwarsTeam {

    /** 游戏系统 @type {BedwarsSystem} */
    system;

    /** ID，代表一个独一无二的队伍 @type {validTeams} */
    id = "";

    /** 床的位置 @type {import("@minecraft/server").Vector3} */
    bedLocation = { x: 0, y: 0, z: 0 };

    /** 床的旋转 @type {"None"|"Rotate90"|"Rotate180"|"Rotate270"} */
    bedRotation = "None";

    /** 资源点的位置，若为分散式生成资源应选取中心点 @type {import("@minecraft/server").Vector3} */
    resourceLocation = { x: 0, y: 0, z: 0 };

    /** 重生点的位置，若玩家能够重生则重生到此位置上 @type {import("@minecraft/server").Vector3} */
    spawnpointLocation = { x: 0, y: 0, z: 0 };

    /** 箱子的位置 @type {import("@minecraft/server").Vector3} */
    chestLocation = { x: 0, y: 0, z: 0 };

    /** 队伍玩家 @type {BedwarsPlayer[]} */
    players = [];

    /** 队伍是否有效，开始时未分配到队员的队伍即为无效队伍 */
    isValid = true;

    /** 队伍是否被淘汰，即没有床并且没有存活队员 */
    isEliminated = false;

    /** 床是否仍然存在 */
    bedIsExist = true;

    /** 
     * @param {BedwarsSystem} system 
     * @param {BedwarsTeamInfo} info
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
        if (this.bedRotation == "Rotate180") bedLocation = lib.position3.add(this.bedLocation, -1, 0, 0);
        else if (this.bedRotation == "Rotate270") bedLocation = lib.position3.add(this.bedLocation, 0, 0, -1);
        lib.structure.placeAsync(`beds:${this.id}_bed`, "overworld", bedLocation, { rotation: this.bedRotation });
    };

    /** 自毁床 */
    destroyBed() {
        this.bedIsExist = false;
        const {x, y, z} = this.bedLocation;
        minecraft.world.getDimension("overworld").runCommand(`setblock ${x} ${y} ${z} air destroy`);
        lib.item.removeItemEntity("minecraft:bed");
    };

    /** 添加队员
     * @param {minecraft.Player} player 待添加的玩家
     */
    addPlayer(player) {
        const bedwarsPlayer = new BedwarsPlayer(this.system, { team: this, player: player });
        this.players.push(bedwarsPlayer);
        return bedwarsPlayer;
    };

    /** 获取本队的队伍颜色代码 */
    getTeamColor() {
        switch (this.id) {
            case validTeams.red: default: return "§c";
            case validTeams.blue: return "§9";
            case validTeams.yellow: return "§e";
            case validTeams.green: return "§a";
            case validTeams.white: return "§f";
            case validTeams.cyan: return "§3";
            case validTeams.pink: return "§d";
            case validTeams.gray: return "§7";
            case validTeams.orange: return "§6";
            case validTeams.brown: return "§n";
            case validTeams.purple: return "§5";
        }
    };

    /** 获取本队的队伍名 */
    getTeamName() {
        switch (this.id) {
            case validTeams.red: return "红";
            case validTeams.blue: return "蓝";
            case validTeams.yellow: return "黄";
            case validTeams.green: return "绿";
            case validTeams.white: return "白";
            case validTeams.cyan: return "青";
            case validTeams.pink: return "粉";
            case validTeams.gray: return "灰";
            case validTeams.orange: return "橙";
            case validTeams.brown: return "棕";
            case validTeams.purple: default: return "紫";
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
        this.isEliminated = true;
        // 设置床为不存在，并且移除床
        this.destroyBed();
    };

};

/**
 * @typedef BedwarsPlayerInfo
 * @property {BedwarsTeam | undefined} team 该玩家所属的队伍，若为 undefined 则为旁观模式
 * @property {minecraft.Player} player 该玩家信息所对应的玩家
 * @property {killStyle} [killStyle] 该玩家所采用的击杀信息
 */

/** 起床战争玩家，代表起床战争内部的一个玩家 */
class BedwarsPlayer {

    /** 系统 @type {BedwarsSystem} */
    system;

    /** 该玩家所属的队伍，若为 undefined 则为旁观模式 @type {BedwarsTeam | undefined} */
    team;

    /** 该玩家信息对应的玩家 @type {minecraft.Player} */
    player;

    /** 该玩家的击杀样式 @type {killStyle} */
    killStyle = killStyle.default;

    /**
     * @param {BedwarsSystem} system 系统
     * @param {BedwarsPlayerInfo} info 起床战争玩家信息
     */
    constructor(system, info) {
        this.system = system;
        this.team = info.team;
        this.player = info.player;
        if (info.killStyle) this.killStyle = info.killStyle;
    }
};

/** @enum {string} 所有可用的击杀样式 */
const killStyle = {
    default: "default",
    flame: "flame",
    west: "west",
    glory: "glory",
    pirate: "pirate",
    love: "love",
    christmas: "christmas",
    meme: "meme",
    pack: "pack",
    newThreeKingdom: "newThreeKingdom"
}

/** 起床战争基本方法 */
const bedwarsLib = {

    /** 警告玩家并播放音效
     * @param {Player} player 玩家信息
     * @param {import("@minecraft/server").RawMessage} rawtext 输入的 rawtext
     */
    warnPlayer(player, rawtext) {
        player.playSound("mob.shulker.teleport", { pitch: 0.5, location: player.location });
        player.sendMessage(rawtext);
    },

    /** 从玩家信息获取起床战争玩家
     * @param {BedwarsMap} map 地图信息
     * @param {minecraft.Player} player 
     */
    getBedwarsPlayer(map, player) {
        return map.teams.map(team => team.players.find(bedwarsPlayer => bedwarsPlayer.player.id == player.id))[0];
    }

};

// ===== 进入游戏后，开始运行系统 =====

minecraft.world.afterEvents.worldLoad.subscribe(() => {
    let bedwarsSystem = new BedwarsSystem();
    bedwarsSystem.settings.beforeGaming.waiting.gameStartWaitingTime = 1;
    bedwarsSystem.settings.beforeGaming.reload.loadSpeed = 6;
});
