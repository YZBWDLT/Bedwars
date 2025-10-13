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

        for (let classicTwoTeamsMapName in mapData.classic.TwoTeams) {
            let bedwarsMap = mapData.classic.TwoTeams[classicTwoTeamsMapName];
            maps.push(bedwarsMap);
        }

        let randomMap = maps[lib.js.randomInt(0, maps.length - 1)];
        if (randomMap.mode == "classic") {
            this.mode = new BedwarsClassicMode(this, new BedwarsMap(this, randomMap));
        }

    };

    /** 注册时间线
     * @param {BedwarsTimeline} timeline 待注册的时间线
     */
    subscribeTimeline(timeline) {
        this.systemTimelines.push(timeline);
    };

    /** 注册事件
     * @param {BedwarsEvent} event 
     */
    subscribeEvent(event) {
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
            lib.debug.sendMessage(`§c[系统] 未找到typeId为${timelineTypeId}的时间线。`);
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
            lib.debug.sendMessage(`§c[系统] 未找到typeId为${eventTypeId}的事件。`);
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
            clearSpeed: 6,

            /** 加载地图的速度，0：非常慢，1：慢，2：较慢，3：中等，4：较快，5：快，6：非常快 */
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
    playerJoinBeforeGameEvent() {
        return new BedwarsEvent(
            "playerJoinWhenWaiting",
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
        lib.debug.sendMessage(`§c[系统] 未同步地图大小！`)
        // let prevX = getScore( "data", "mapSize.prevX" );
        // let prevZ = getScore( "data", "mapSize.prevZ" );
        // if ( prevX !== undefined ) { this.mapSize.prevX = prevX }
        // if ( prevZ !== undefined ) { this.mapSize.prevZ = prevZ }
        // setScore( "data", "mapSize.prevX", this.mapSize.x );
        // setScore( "data", "mapSize.prevZ", this.mapSize.z );

        // 加载等待区结构
        lib.structure.placeAsync("hypixel:waiting_hall", "overworld", { x: -12, y: 117, z: -12 });

        // 设置世界出生点
        minecraft.world.setDefaultSpawnLocation({x: 0, y: 121, z: 0});

        // 注册时间线
        this.system.subscribeTimeline(this.clearMapTimeline()); // 清空地图状态的主时间线
        this.system.subscribeTimeline(this.showBeforeGamingInfoBoardTimeline()); // 右侧信息板
        this.system.subscribeTimeline(this.beforeGamingTimeline()); // 游戏前时间线

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块
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
        lib.debug.sendMessage(`§c[系统] 未恢复设置数据！`)
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
            this.system.subscribeEvent(this.playerJoinWhenWaitingEvent());
        else {  // 人数足够时注册的时间线和事件
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
    playerJoinWhenWaitingEvent() {
        return new BedwarsEvent(
            "playerJoinWhenWaiting",
            minecraft.world.afterEvents.playerSpawn,
            minecraft.world.afterEvents.playerSpawn.subscribe(() => {
                // 如果人数充足，检查玩家人数是否会又不足，并开始游戏倒计时
                if (lib.player.getAmount() >= this.system.settings.beforeGaming.waiting.minPlayerCount) {
                    lib.debug.sendMessage(`[系统] 符合转换条件！开始游戏倒计时。`)
                    // 注册或销毁时间线或事件
                    this.system.subscribeTimeline(this.gameStartCountdownTimeline());
                    this.system.subscribeEvent(this.playerLeaveWhenWaitingEvent());
                    this.system.unsubscribeEvent("playerJoinWhenWaiting");
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
                    this.system.subscribeEvent(this.playerJoinWhenWaitingEvent());
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

        // 注册事件
        this.system.subscribeEvent(this.stopPlayerBreakBlockEvent()); // 阻止玩家破坏方块

    };

    /** 离开游戏状态，仅在退出此状态时执行一次 */
    exitGamingState() {
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

    }

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
        this.teams.push(new BedwarsTeam(teamInfo));
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
            
            // lionTemple: {},
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

    /** @param {BedwarsTeamInfo} info  */
    constructor(info) {
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
    }

};

/** 起床战争玩家，代表起床战争内部的一个玩家 */
class BedwarsPlayer {

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

};

// ===== 进入游戏后，开始运行系统 =====

minecraft.world.afterEvents.worldLoad.subscribe(() => {
    let bedwarsSystem = new BedwarsSystem();
});
