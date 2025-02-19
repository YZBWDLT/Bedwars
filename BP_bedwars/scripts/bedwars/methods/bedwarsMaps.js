/** 地图类，及地图相关信息 */

import { world } from "@minecraft/server";
import { BedwarsTeam, eachTeam } from "./bedwarsTeam.js"
import { settings } from "./bedwarsSettings.js";

import { randomInt, shuffleArray } from "./number.js";
import { getPlayerAmount, eachPlayer, setPlayerGamemode } from "./playerManager.js";
import { BedwarsPlayer, eachValidPlayer, initPlayer } from "./bedwarsPlayer.js";
import { overworld, positionManager, Vector } from "./positionManager.js";
import { eventManager } from "../events/eventManager.js";
import { getScore, removeAllScoreboards, setScore, tryAddScoreboard } from "./scoreboardManager.js";

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

    /** 地图 ID，它将控制地图的运行方式 */
    id = "";

    /** 地图的显示名称 */
    name = "";

    /** 地图的钻石点与绿宝石点信息、全地图中所有类型资源生成间隔的基准信息、资源生成方式信息 */
    spawnerInfo = {
        /** 平均每个铁的基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔*每次生成的铁锭数/(1+速度加成)） */ ironInterval: 6,
        /** 金基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔/(1+速度加成) */ goldInterval: 75,
        /** 钻石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ diamondInterval: 800,
        /** 绿宝石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ emeraldInterval: 1500,
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

    /** 地图重生点，玩家死亡后将重生于此 */
    spawnpointPos = new Vector( 0, 100, 0 );

    /** 队伍数，在使用addTeams方法时，此数值将自加 */
    teamCount = 0;

    /** 全体队伍信息 @type {BedwarsTeam[]} */
    teamList = [];

    /** 游戏ID，只有ID与本局游戏相同的玩家允许进入游戏 */
    gameId = randomInt( 1000, 9999 )

    /** 游戏阶段，0：游戏前；1：游戏中；2：游戏结束
     * @type {0|1|2|3|4}
     */
    gameStage = 0;

    /** 游戏结束后，自动开启下一场游戏的倒计时，单位：游戏刻 */
    nextGameCountdown = 200;

    /** 游戏开始倒计时 */
    gameStartCountdown = settings.gameStartWaitingTime;

    /** 商人信息，包括位置、朝向、类型 @type {traderInfo[]} */ 
    traderInfo = [];

    /** 玩家是否可以进入商店 */
    playerCouldIntoShop = true;

    /** 游戏事件，包括下一个事件的倒计时、下一个事件的ID、下一个事件的名称 */
    gameEvent = {
        /** 当前处于第几个事件中 */ currentId: 0,
        /** 下一个事件的倒计时，单位：游戏刻 */ nextEventCountdown: 7200,
        /** 下一个事件的名称 */ nextEventName: "钻石生成点 II 级"
    };

    /** 治愈池范围 */
    healPoolRadius = 20;

    /** 地图加载信息 */
    loadInfo = {
        /** 地图是否正在加载 */ isLoading: false,
        /** 加载状态
         * @description 0：准备工作，1：清空地图时，2：加载结构时，3：设置队伍岛屿颜色和床所需时间
         * @type { 0 | 1 | 2 | 3 }
         */
        loadStage: 0,

        /** 地图清空 */
        mapClear: {
            /** 正在清除的层数 */ currentLayer: 116,
            /** 间隔多长时间清除下一层，单位：游戏刻 */ timeCostPerLayer: 3,
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
            /** 加载结构所需的时间，单位：游戏刻 */ totalTime: 100,
            /** 加载倒计时，单位：游戏刻 */ countdown: 100,
            /** 加载岛屿 */ loadStructure: () => {
                this.loadInfo.mapReload.islands.forEach( island => {
                    const { pos, rotation, mirror, type } = island;
                    world.structureManager.place( `${this.id}:${type}`, overworld, pos, { animationMode: "Layers", animationSeconds: parseFloat( ( this.loadInfo.mapReload.totalTime / 20 ).toFixed( 2 ) ), mirror, rotation, } )
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

    /** @type {"classic"|"capture"} 地图模式，classic=经典，capture=夺点模式 */
    mode = "classic";

    /** 夺点模式信息 */
    captureInfo = {
        /** 所有有效点位 @type {Vector[]} */ validBedPoints: [ ],
        /** 游戏结束倒计时，单位：秒 */ gameOverCountdown: 1500,
        /** 优势方 @type {import("./bedwarsTeam.js").validTeams|"none"} */ dominantTeam: "none",
    };

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

    /** ===== 基本方法 ===== */

    /** 添加队伍信息
     * @param {...BedwarsTeam} teams 要加入的队伍信息
     */
    addTeams( ...teams ) {
        const currentTeams = [ ...this.teamList, ...teams ];
        this.teamList = currentTeams;
        this.teamCount = currentTeams.length;
    };

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

    /** 添加商人信息
     * @param {...traderInfo} traders 商人信息
     */
    addTraders( ...traders ) {
        traders.forEach( trader => {
            const { pos, direction, type } = trader;
            this.traderInfo.push( { pos: positionManager.center( pos ), direction, type } );
        } )
    }

    /** 设置下一个事件
     * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
     * @param {String} nextEventName 下一个事件的名称
     */
    setNextEvent( nextEventCountdown, nextEventName ) {
        this.gameEvent.currentId++;
        this.gameEvent.nextEventCountdown = nextEventCountdown;
        this.gameEvent.nextEventName = nextEventName;
    };

    /** 获取未被淘汰的队伍 */
    getAliveTeam( ) {
        return this.teamList.filter( team => team.isEliminated === false )
    };

    /** 移除边界外的实体
     * @param {String} entityId 要移除的实体ID
     * @param {number} range 检测的范围，默认值：0。例：若填写为-5，则检测到离边界5格以内则移除。
     */
    removeEntityOutOfBorder( entityId, range = 0 ) {
        overworld.getEntities( { type: entityId } ).forEach( entity => {    
            /** 如果该实体将欲出界，移除之 */
            if ( Math.abs( entity.location.x ) > 105 + range || Math.abs( entity.location.z ) > 105 + range || entity.location.y > map().heightLimit.max + range || entity.location.y < 0 + range ) {
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
        eachPlayer( player => {
            initPlayer( player )
        } );
        // 移除多余记分板并添加新的记分板
        const scoreboardWhitelist = [ "data" ];
        removeAllScoreboards( obj => !scoreboardWhitelist.includes( obj.displayName ) )
        tryAddScoreboard( "data", "数据" );
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

        /** 随机分配玩家的队伍
         * @description 分配逻辑为，现在有玩家数目playerAmount、分配队伍数teamCount和随机玩家列表Player[]，先用玩家数目除以分配队伍数，playerAmount / teamCount = a ... b，然后，先为所有队伍分配 a 人，这样还剩下 b 人，将这 b 人每人随机插入到随机队伍中，插入后即移除该队伍以防止某个队伍比别队多出2人或更多人
         */
        let assignPlayersRandomly = () => {
            let players = shuffleArray( world.getPlayers() );
            let copiedTeamList = shuffleArray( [ ...this.teamList ] );
            let a = getPlayerAmount() / this.teamCount;
            eachTeam( team => {
                for ( let i = 0; i < a; i++ ) { new BedwarsPlayer( players[i].name, team.id ); };
                players.splice( 0, a );
            } );
            if ( players.length !== 0 ) {
                players.forEach( player => { 
                    new BedwarsPlayer( player.name, copiedTeamList[0].id ); 
                    copiedTeamList.splice( 0, 1 );
                } );
            };
        };

        /** 生成商人
         * @description 按照设定的商人数据，设置其位置、朝向、类型、皮肤、名字。
         */
        let setTrader = () => {
            this.traderInfo.forEach( traderInfo => {
                let trader = overworld.spawnEntity( "bedwars:trader", traderInfo.pos );
                trader.setRotation( new Vector( 0, traderInfo.direction ) );
                trader.triggerEvent( `${traderInfo.type}_trader` );
                trader.triggerEvent( `assign_skin_randomly` );
                if ( traderInfo.type === "blocks_and_items" ) { trader.nameTag = `§a方块与物品`; }
                else if ( traderInfo.type === "weapon_and_armor" ) { trader.nameTag = `§c武器与盔甲`; }
                else if ( traderInfo.type === "weapon_and_armor_capture" ) { trader.nameTag = `§c武器与盔甲`; }
                else { trader.nameTag = `§b团队升级`; }
            } )
        };
    

        /** 设置地图阶段 */ this.gameStage = 1;
        /** 触发游戏时事件 */
        eventManager.classicEvents();
        if ( this.mode === "capture" ) { eventManager.captureEvents(); }

        /** 设置为允许 PVP */ world.gameRules.pvp = true;
        /** 随机分配玩家队伍 */ assignPlayersRandomly();
        /** 安置商人 */ setTrader();
        /** 移除等待大厅 */ overworld.runCommand( `fill -12 117 -12 12 127 12 air` );
        /** 在重生点下方放置一块屏障（防止薛定谔玩家复活时判定失败） */ overworld.runCommand( `setblock 0 ${this.spawnpointPos.y - 2} 0 barrier` );
        /** 如果一个队伍没有分配到人，则设置为无效的队伍 */ eachTeam( team => { if ( team.getTeamMember().length === 0 ) { team.setTeamInvalid(); }; } );
        /** 玩家命令 */ eachValidPlayer( ( player, playerInfo ) => {
            /** 将玩家传送到队伍中 */ playerInfo.teleportPlayerToSpawnpoint();
            /** 调整玩家的游戏模式 */ setPlayerGamemode( player, "survival" );
            /** 播报消息 */ player.sendMessage( [ { translate: "message.greenLine" }, "\n", this.getStartIntro().title, "\n\n", this.getStartIntro().intro, "\n\n", { translate: "message.greenLine" } ] )
        } )
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
