/** 地图类，及地图相关信息 */

import { world } from "@minecraft/server";
import { BedwarsTeam, eachTeam } from "./bedwarsTeam"
import { settings } from "./bedwarsSettings";

import { randomInt, shuffleArray } from "./number";
import { getPlayerAmount, eachPlayer, setPlayerGamemode } from "./playerManager";
import { availableKillStyles, BedwarsPlayer, eachValidPlayer, initPlayer } from "./bedwarsPlayer";
import { overworld, positionManager, Vector } from "./positionManager";
import { eventManager } from "../events/eventManager";
import { getQuitPlayers, getScore, getScoreboard, removeAllScoreboards, resetScore, setScore, tryAddScoreboard } from "./scoreboardManager";
import { tickToSecond } from "./time";
import { shopitems } from "./bedwarsShopitem";

/**
 * @typedef islandInfo 岛屿信息
 * @property { Vector } pos 岛屿加载起点位置（x、y、z的最小值）
 * @property { "team_island" | "diamond_island" | "center_island" | "side_island" | "diamond_island_1" | "diamond_island_2" | "center_island_1" | "center_island_2" | "center_island_3" | "center_island_4" } type 岛屿类型
 * @property { "None" | "Rotate90" | "Rotate180" | "Rotate270" } rotation 岛屿按照旋转加载
 * @property { "None" | "X" | "Z" | "XZ" } mirror 岛屿按照镜像加载
 */

/**
 * @typedef teamIslandColorInfo 队伍岛屿颜色信息
 * @property { import("./bedwarsTeam.js").validTeams | "lime" } color 设置的羊毛颜色（备注：如果为绿队，请使用lime而非green！）
 * @property { Vector } pos1 在/fill的替换命令中，设置的坐标起点
 * @property { Vector } pos2 在/fill的替换命令中，设置的坐标终点
 */

/**
 * @typedef traderInfo 商人信息
 * @property { "blocks_and_items" | "weapon_and_armor" | "team_upgrade" | "weapon_and_armor_capture" } type - 商人类型
 * @property { Vector } pos - 新增的商人位置
 * @property { Number } direction - 商人的初始朝向，为 0 ~ 360
 */

/**
 * @typedef spawnerInfo 资源点信息
 * @property { "diamond" | "emerald" } type 资源点类型
 * @property { Vector } pos 资源点位置，需传入钻石块或绿宝石块的位置
 */

/** 【类】地图类，控制地图全局的运行方式 */
export class BedwarsMap{

    /** 地图 ID，它将控制地图的运行方式 */ id = "";
    /** 地图的显示名称 */ name = "";
    /** 地图的钻石点与绿宝石点信息、全地图中所有类型资源生成间隔的基准信息、资源生成方式信息 */
    spawnerInfo = {
        /** 钻石点等级 */ diamondLevel: 1,
        /** 绿宝石点等级 */ emeraldLevel: 1,
        /** 钻石生成倒计时，单位：游戏刻 */ diamondCountdown: 600,
        /** 绿宝石生成倒计时，单位：游戏刻 */ emeraldCountdown: 1300,
        /** 每次生成铁的数目 */ ironSpawnTimes: 5,
        /** 钻石点位置与生成次数信息 @type {{ pos: Vector, spawned: Number }[]} */ diamondInfo: [],
        /** 绿宝石点位置与生成次数信息 @type {{ pos: Vector, spawned: Number }[]} */ emeraldInfo: [],
        /** 是否在每次生成时，在3*3范围内分散式地生成资源 */ distributeResource: true,
        /** 是否清除生成资源的向量 */ clearResourceVelocity: true
    };
    /** 地图重生点，玩家死亡后将重生于此 */ spawnpointPos = new Vector( 0, 100, 0 );
    /** 队伍数，在使用addTeams方法时，此数值将自加 */ teamCount = 0;
    /** 全体队伍信息 @type {BedwarsTeam[]} */ teamList = [];
    /** 游戏ID，只有ID与本局游戏相同的玩家允许进入游戏 */ gameId = randomInt( 1000, 9999 )
    /** 游戏阶段，0：游戏前；1：游戏中；2：游戏结束 @type {0|1|2|3|4} */ gameStage = 0;
    /** 游戏结束后，自动开启下一场游戏的倒计时，单位：游戏刻 */ nextGameCountdown = 200;
    /** 游戏开始倒计时 */ gameStartCountdown = settings.beforeGaming.waiting.gameStartWaitingTime;
    /** 商人信息，包括位置、朝向、类型 @type {traderInfo[]} */ traderInfo = [];
    /** 玩家是否可以进入商店 */ playerCouldIntoShop = true;
    /** 游戏事件，包括下一个事件的倒计时、下一个事件的ID、下一个事件的名称 */
    gameEvent = {
        /** 当前处于第几个事件中 */ currentId: 0,
        /** 下一个事件的倒计时，单位：游戏刻 */ nextEventCountdown: 7200,
        /** 下一个事件的名称 */ nextEventName: "钻石生成点 II 级"
    };
    /** 治愈池范围 */ healPoolRadius = 20;
    /** 地图加载信息 */
    loadInfo = {
        /** 地图是否正在加载 */ isLoading: false,
        /** 加载状态，0：准备工作，1：清空地图时，2：加载结构时，3：设置队伍岛屿颜色和床所需时 @type { 0 | 1 | 2 | 3 }  */
        loadStage: 0,
        /** 地图清空 */
        mapClear: {
            /** 正在清除的层数 */ currentLayer: 116,
            /** 间隔多长时间清除下一层，单位：游戏刻 */ timeCostPerLayer: 6,
            /** 倒计时，单位：游戏刻 */ countdown: 690,
            /** 移除本层并使层数自减 */ clear: () => {
                this.loadInfo.mapClear.currentLayer--;
                for ( let i of [ 1, -1 ] ) { for ( let j of [ 1, -1 ] ) {
                    overworld.runCommand( `fill 0 ${this.loadInfo.mapClear.currentLayer} 0 ${i*this.mapSize.x} ${this.loadInfo.mapClear.currentLayer} ${j*this.mapSize.z} air` )
                } }
            },
        },
        /** 结构加载 */
        mapReload: {
            /** 全部岛屿信息 @type { islandInfo[] } */ islands: [ ],
            /** 加载结构所需的时间，单位：游戏刻 */ totalTime: 300,
            /** 加载倒计时，单位：游戏刻 */ countdown: 300,
            /** 加载岛屿 */ loadStructure: () => {
                this.loadInfo.mapReload.islands.forEach( island => {
                    const { pos, rotation, mirror, type } = island;
                    world.structureManager.place( `${this.id}:${type}`, overworld, pos, { animationMode: "Blocks", animationSeconds: tickToSecond( this.loadInfo.mapReload.totalTime, "float" ), mirror, rotation, } )
                } )
            },
            /** 设置边界 */ loadBorder: () => {
                for ( let i of [ 1, -1 ] ) { for ( let j of [ 1, -1 ] ) {
                    overworld.runCommand( `fill ${i*this.mapSize.x} 0 ${i*this.mapSize.z} ${j*this.mapSize.x} 0 ${j*this.mapSize.z*(-1)} border_block` );
                } }
            },

        },
        /** 设置队伍岛屿的羊毛颜色 */
        teamIslandColor: {
            /** 是否设置队伍羊毛颜色 */ isEnabled: true,
            /** 设置队伍岛屿颜色和床阶段的倒计时，单位：游戏刻 */ countdown: 20,
            /** 队伍岛屿的颜色信息 @type {teamIslandColorInfo[]} */ colors: [],
            /** 设置队伍岛屿的羊毛颜色 */ load: () => {
                this.loadInfo.teamIslandColor.colors.forEach( info => {
                    let { color, pos1, pos2 } = info;
                    const { x: x1, y: y1, z: z1 } = pos1;
                    const { x: x2, y: y2, z: z2 } = pos2;
                    overworld.runCommand( `fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${color}_wool replace white_wool` );    
                } )
            }
        },

    };
    /** 地图大小信息 */
    mapSize = {
        /** x 方向半边长大小 */ x: 105,
        /** z 方向半边长大小 */ z: 105,
        /** 上一张地图的 x 方向半边长大小 */ prevX: 105,
        /** 上一张地图的 z 方向半边长大小 */ prevZ: 105,
    }
    /** 高度限制信息 */
    heightLimit = {
        /** 最高高度限制 */ max: 110,
        /** 最低高度限制 */ min: 50
    };
    /** @type {"classic"|"capture"} 地图模式，classic=经典，capture=夺点模式 */ mode = "classic";
    /** 夺点模式信息 */
    captureInfo = {
        /** 所有有效点位 @type {Vector[]} */ validBedPoints: [ ],
        /** 游戏结束倒计时，单位：秒 */ gameOverCountdown: 1500,
        /** 优势方 @type {import("./bedwarsTeam.js").validTeams|"none"} */ dominantTeam: "none",
    };
    /** 地图版本 */ version = "Alpha 1.1_01";
    /** 地图允许的商店物品 */ validShopitems = [ ...shopitems.blocksAndItems, ...shopitems.weaponAndArmor, ...shopitems.teamUpgrade, ];

    /** 【构建器】
     * @param {String} id 地图 ID
     * @param {String} name 地图名称
     * @param {islandInfo[]} islands 岛屿信息
     * @param {teamIslandColorInfo[]} teamIslandColor 队伍岛屿信息
     */
    constructor( id, name, islands, teamIslandColor ) {
        this.id = id;
        this.name = name;
        this.loadInfo.mapReload.islands = islands;
        this.loadInfo.teamIslandColor.colors = teamIslandColor;

        this.spawnpointPos = new Vector( 0, this.heightLimit.max + 7, 0 );
    };

    // ===== 队伍操作 =====

    /** 添加队伍信息
     * @param {...BedwarsTeam} teams 要加入的队伍信息
     */
    addTeams( ...teams ) {
        const currentTeams = [ ...this.teamList, ...teams ];
        this.teamList = currentTeams;
        this.teamCount = currentTeams.length;
    };

    /** 从队伍 ID 获取队伍信息
     * @param {import("./bedwarsTeam.js").validTeams} id 输入队伍的 ID
     */
    getTeam( id ) {
        return this.teamList.find( team => team.id === id );
    };

    /** 获取未被淘汰的队伍 */
    getAliveTeam( ) {
        return this.teamList.filter( team => team.isEliminated === false )
    };

    /** 使每个队伍都执行一个函数
     * @param {function(BedwarsTeam)} func - 一个接受 BedwarsTeam 类型参数的函数
     */
    eachTeam( func ) {
        this.teamList.forEach( team => { func( team ) } )
    };

    // ===== 资源点操作 =====

    /** 添加资源点信息
     * @param {...spawnerInfo} spawners 资源点信息
     */
    addSpawners( ...spawners ) {
        spawners.forEach( spawner => {
            const { type, pos } = spawner;
            const changedPos = positionManager.add( positionManager.center( pos ), 0, 2, 0 );
            this.spawnerInfo[`${type}Info`].push( { pos: changedPos, spawned: 0, } );
        } );
    };

    // ===== 商人操作 =====

    /** 添加商人信息
     * @param {...traderInfo} traders 商人信息
     */
    addTraders( ...traders ) {
        traders.forEach( trader => {
            const { pos, direction, type } = trader;
            this.traderInfo.push( { pos: positionManager.center( pos ), direction, type } );
        } )
    };

    /** 设置商人 */
    setTraders() {
        this.traderInfo.forEach( traderInfo => {
            // 生成商人并确定朝向、类型和皮肤
            let trader = overworld.spawnEntity( "bedwars:trader", traderInfo.pos );
            trader.setRotation( new Vector( 0, traderInfo.direction ) );
            trader.triggerEvent( `${traderInfo.type}_trader` );
            trader.triggerEvent( `assign_skin_randomly` );
            // 设定名字
            if ( traderInfo.type === "blocks_and_items" ) { trader.nameTag = `§a方块与物品`; }
            else if ( traderInfo.type === "weapon_and_armor" ) { trader.nameTag = `§c武器与盔甲`; }
            else if ( traderInfo.type === "weapon_and_armor_capture" ) { trader.nameTag = `§c武器与盔甲`; }
            else { trader.nameTag = `§b团队升级`; }
        } )
    };

    /** 获取具有特定家族的商人
     * @param {import("./bedwarsShopitem.js").traderType} traderType 
     */
    getTraders( traderType ) {
        return overworld.getEntities( { type: "bedwars:trader" } ).filter( trader => trader.getComponent( "minecraft:type_family" ).hasTypeFamily( `${traderType}_trader` ) );
    };

    /** 设置下一个事件
     * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
     * @param {String} nextEventName 下一个事件的名称
     */
    setNextEvent( nextEventCountdown, nextEventName ) {
        this.gameEvent.currentId++;
        this.gameEvent.nextEventCountdown = nextEventCountdown;
        this.gameEvent.nextEventName = nextEventName;
    };



    /** 移除边界外的实体
     * @param {String} entityId 要移除的实体ID
     * @param {number} range 检测的范围，默认值：0。例：若填写为-5，则检测到离边界5格以内则移除。
     * @param {boolean} upTest 是否测试顶面，如果为false则忽略顶面的测试
     */
    removeEntityOutOfBorder( entityId, range = 0, upTest = true ) {
        overworld.getEntities( { type: entityId } ).forEach( entity => {    
            /** 如果该实体将欲出界，移除之 */
            if (
                ( upTest && Math.abs( entity.location.x ) > 105 + range )
                || Math.abs( entity.location.z ) > 105 + range
                || entity.location.y > map().heightLimit.max + range
                || entity.location.y < 0 + range
            ) {
                entity.remove();
            }
        } )
    };

    /** ===== 游戏阶段转换方法 ===== */

    /** 进行地图初始化
     * @description 基础功能：设置地图阶段为0，触发游戏前事件。
     * @description 额外功能：禁止PVP，移除实体，移除玩家信息等
     */
    gameReady() {
        // 设置地图阶段
        this.gameStage = 0;
        // 触发游戏前事件
        eventManager.classicBeforeEvents();

        // 设置为正在加载新地图
        this.loadInfo.isLoading = true;
        // 设置为禁止 PVP
        world.gameRules.pvp = false;
        // 移除多余实体
        overworld.getEntities().filter( entity => { return entity.typeId !== "minecraft:player" } ).forEach( entity => entity.remove() );
        // 移除玩家的bedwarsInfo，还原玩家名字颜色
        eachPlayer( player => { initPlayer( player ) } );
        // 移除多余记分板并添加新的记分板
        const scoreboardWhitelist = [ "data", "killStyle" ];
        removeAllScoreboards( obj => !scoreboardWhitelist.includes( obj.id ) );
        tryAddScoreboard( "data", "数据" );
        tryAddScoreboard( "killStyle", "击杀样式" );
        tryAddScoreboard( "selectTeam", "选队数据" );
        // 地图大小同步
        // 先从记分板获取上一张地图的大小，然后将本地图的大小设置到记分板上
        let prevX = getScore( "data", "mapSize.prevX" );
        let prevZ = getScore( "data", "mapSize.prevZ" );
        if ( prevX !== undefined ) { this.mapSize.prevX = prevX }
        if ( prevZ !== undefined ) { this.mapSize.prevZ = prevZ }
        setScore( "data", "mapSize.prevX", this.mapSize.x );
        setScore( "data", "mapSize.prevZ", this.mapSize.z );

        // 执行初始化命令函数
        overworld.runCommand( `function lib/init/map` );
    };

    /** 游戏开始
     * @description 基础功能：设置地图阶段为1，触发游戏时事件。
     * @description 额外功能：允许PVP，随机分配队伍，安置实体等
     */
    gameStart() {

        /** 组队功能 */
        const assignPlayers = () => {

            // ===== 变量准备 =====

            /** 当前总人数 */
            let playerCount = getPlayerAmount();
            /** 上限人数 */
            let maxPlayerCount = settings.beforeGaming.waiting.maxPlayerCount;
            /** 分配模式 */
            const assignMode = settings.beforeGaming.teamAssign.mode;
            /** 所有队伍列表并打乱顺序（copy，不影响原数组） */
            let teams = [ ...this.teamList ]; teams = shuffleArray( teams );
            /** 所有玩家列表并打乱顺序（copy，不影响原数组） */
            let players = [ ...world.getPlayers() ]; players = shuffleArray( players );
            /** 每队至少应当分配的玩家 */
            // 例：11人4队，一队最少分配11/4=2（向下取整）名玩家；13人8队，一队最少分配13/8=1（向下取整）名玩家
            const minPlayerPerTeam = Math.floor( playerCount / this.teamCount );

            // ===== 一、为自主选队的玩家先选定队伍 =====
            // 如果启用了自主选队的玩家，则先选择队伍
            // 经过队伍选定后：
            // - players剩余的玩家均为待随机分配的玩家；
            // - playerCount代表待随机分配的玩家数量；
            // - maxPlayerCount代表剩余的玩家中允许参与游戏的玩家数量
            if ( settings.beforeGaming.teamAssign.playerSelectEnabled ) {
                try {
                    getScoreboard( "selectTeam" ).getScores().filter( info => info.participant.type === "Player" ).forEach( info => {
                        const thisPlayer = info.participant.getEntity();
                        const teamIndex = info.score;
                        new BedwarsPlayer( thisPlayer.name, this.teamList[teamIndex].id ); // 添加该玩家到队伍中
                        players = players.filter( player => player.name !== thisPlayer.name ); // players剩余的玩家为随机分配的
                        playerCount--; maxPlayerCount--; // 将这些选择了队伍的玩家从玩家数量和总玩家中剔除出去
                    });
                } catch {}
            }

            // ===== 二、将多出的玩家随机设置为旁观 =====
            // 只保留maxPlayerCount个玩家，剩下的玩家改为旁观模式
            if ( playerCount > maxPlayerCount ) {
                let spectatorPlayers = players.splice( maxPlayerCount );
                spectatorPlayers.forEach( spectatorPlayer => {
                    new BedwarsPlayer( spectatorPlayer.name, undefined )
                } );
                playerCount = maxPlayerCount;
            }

            // ===== 三、为每个队伍先分配 minPlayerPerTeam 个玩家 =====
            // 经过自主选队和筛选之后，不同的队伍目前会分配到不同的人数

            // 以下假设3种情况：
            // （1）11人4队，分别为3/3 2/2 0/2 1/2（minPlayerPerTeam = 2）
            // （2）16人2队，分别为5/8 3/8（minPlayerPerTeam = 8）
            // （3）14人8队，分别为0/1 0/1 0/1 ... 0/1 （minPlayerPerTeam = 1）

            // 1. 先找到游戏玩家为 currentPlayerCount = 0 （条件1）并且人数小于 minPlayerPerTeam （条件2）的队伍
            // 2. 在这些队伍里插入玩家：
            // - (1) 3/3 2/2 0/2 1/2 -> 3/3 2/2 1/2 1/2
            // - (2) 5/8 3/8 -> 5/8 3/8
            // - (3) 0/1 0/1 ... 0/1 -> 1/1 1/1 ... 1/1 循环结束（players剩余5人）
            // 3. 然后，currentPlayerCount++，重复步骤 1-2 并继续循环：
            // - (1) 3/3 2/2 1/2 1/2 -> 3/3 2/2 2/2 2/2 循环结束（players剩余2人）
            // - (2) 5/8 3/8 -> ... -> 5/8 4/8 -> 5/8 5/8 -> 6/8 6/8 -> ... -> 8/8 8/8 循环结束（players剩余0人）

            // 如果为按照胜率排序，则重新排序随机分配的玩家列表
            if ( assignMode === 2 ) { }
            for ( let currentPlayerCount = 0; /** 条件2 -> */ currentPlayerCount < minPlayerPerTeam; currentPlayerCount++ ) {
                teams.filter( team => /** 条件1 -> */ team.getTeamMember().length === currentPlayerCount ).forEach( team => {
                    new BedwarsPlayer( players[0].name, team.id );
                    players.splice( 0, 1 );
                } )
            }

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

            if ( players.length !== 0 ) {
                if ( assignMode === 0 ) {
                    teams = this.teamList.filter( team => team.getTeamMember().length === minPlayerPerTeam )
                }
                else {
                    teams = teams.filter( team => team.getTeamMember().length === minPlayerPerTeam );
                }

                teams.forEach( ( team, index ) => {
                    if ( index < players.length ) { // 防止加玩家加过界
                        new BedwarsPlayer( players[index].name, team.id );
                    }
                } )
            }
        }
    
        /** 设置地图阶段 */
        this.gameStage = 1;
        /** 触发游戏时事件 */
        eventManager.classicEvents();
        if ( this.mode === "capture" ) { eventManager.captureEvents(); }

        // 设置为允许 PVP
        world.gameRules.pvp = true;
        // 分配玩家队伍
        assignPlayers();
        // 安置商人
        this.setTraders();
        // 移除等待大厅
        overworld.runCommand( `fill -12 117 -12 12 127 12 air` );
        // 在重生点下方放置一块屏障（防止薛定谔玩家复活时判定失败）
        overworld.runCommand( `setblock 0 ${this.spawnpointPos.y - 2} 0 barrier` );
        // 继续尝试重新添加killStyle记分板
        tryAddScoreboard( "killStyle", "击杀样式" );
        tryAddScoreboard( "selectTeam", "选队数据" );
        getQuitPlayers( "selectTeam" ).forEach( quitPlayer => resetScore( "selectTeam", quitPlayer ) ); // 移除记分板中的玩家下线
        // 如果一个队伍没有分配到人，则设置为无效的队伍
        if ( settings.gaming.invalidTeam.enableTest ) {
            eachTeam( team => { if ( team.getTeamMember().length === 0 ) { team.setTeamInvalid(); }; } );
        }
        // 玩家命令
        eachValidPlayer( ( player, playerInfo ) => {
            if ( !playerInfo.isSpectator ) {
                /** 将玩家传送到队伍中 */ playerInfo.teleportPlayerToSpawnpoint();
                /** 调整玩家的游戏模式 */ setPlayerGamemode( player, "survival" );
                /** 播报消息 */ player.sendMessage( [ { translate: "message.greenLine" }, "\n", this.getStartIntro().title, "\n\n", this.getStartIntro().intro, "\n\n", { translate: "message.greenLine" } ] );

                // 玩家击杀样式
                if ( settings.gaming.killStyle.isEnabled ) {
                    playerInfo.killStyle = settings.gaming.killStyle.randomKillStyle ? availableKillStyles[randomInt(0,availableKillStyles.length-1)] : availableKillStyles[getScore( "killStyle", player, 0 )];
                }
                else {
                    playerInfo.killStyle = "default";
                }
                // 移除玩家的设置物品
                player.runCommand( `clear @s bedwars:kill_style` );
                player.runCommand( `clear @s bedwars:select_team` );
                
            }
        } );
    };

    /** 游戏结束
     * @description 基础功能：设置地图阶段为1，触发游戏时事件。
     * @description 额外功能：设置下一场游戏的倒计时，清除所有的末影龙。
     */
    gameOver() {
        /** 设置地图阶段 */ this.gameStage = 2;
        /** 触发游戏后事件 */
        eventManager.classicAfterEvents();
        if ( this.mode === "capture" ) { eventManager.captureAfterEvents(); }

        /** 设置下一场游戏的倒计时 */ this.nextGameCountdown = 200;
        /** 清除所有的末影龙 */ overworld.getEntities( { type: "minecraft:ender_dragon" } ).forEach( dragon => { dragon.kill(); } );
    };

    /** ===== 不同模式适配方法 ===== */

    /** 获取地图是否为solo模式 */
    isSolo( ) {
        return this.teamCount > 4
    };
    
    /** 获取地图模式名 */
    modeName( ) {
        if ( this.mode === "classic" ) { return "经典"; } else { return "夺点" }
    };

    /** 获取游戏开始介绍 @returns { { title: import("@minecraft/server").RawMessage, intro: import("@minecraft/server").RawMessage } } */
    getStartIntro() {
        return { title: { translate: `message.gameStartTitle.${this.mode}` }, intro: { translate: `message.gameStartIntroduction.${this.mode}` } }
    };

    /** ===== 夺点模式方法 ===== */

    /** 获取夺点模式优势方信息和游戏结束倒计时
     * @description 优势方：返回距离淘汰倒计时最久的队伍，如果有队伍一样最久，则返回"none"。例如，红队500秒后淘汰，蓝队350秒后淘汰，则返回"red"。
     * @description 游戏结束倒计时：返回距离淘汰倒计时最近的队伍。例如上例，返回350。
     */
    getCaptureInfo( ) {
        /** 各队伍数据 @type {{[id:String]:Number}} */ let teamData = {};
        eachTeam( team => {
            teamData[team.id] = Math.ceil(team.captureInfo.score/team.captureInfo.otherTeamBedAmount); // 令某队的游戏结束倒计时等于其分数除以其他队床数，向上取整。例如：752分，对面3床，则本队还有251秒分数归零。
        } )
        /** 所有倒计时数据 */ let countdownDatas = Object.values( teamData );
        /** 获取所有队伍中的所有优势方 */ let dominantTeams = Object.keys(teamData).filter(key => teamData[key] === Math.max(...countdownDatas));
        /** 获取优势方，如果有多个则返回"none" */ let dominantTeam = dominantTeams.length > 1 ? "none" : dominantTeams[0];
        /** 获取游戏结束倒计时 */ let gameOverCountdown = countdownDatas.reduce( ( a, b ) => Math.min( a, b ) );
        this.captureInfo.dominantTeam = dominantTeam;
        this.captureInfo.gameOverCountdown = gameOverCountdown;
        return { dominantTeam, gameOverCountdown };
    };

}

/** 地图信息 @return {BedwarsMap} */
export let map = () => { return world.bedwarsMap };
