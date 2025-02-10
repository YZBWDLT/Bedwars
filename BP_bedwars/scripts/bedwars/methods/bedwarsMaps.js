/** 地图类，及地图相关信息 */

import { world } from "@minecraft/server";
import { BedwarsTeam, validTeams, eachTeam } from "./bedwarsTeam.js"
import { settings } from "./bedwarsSettings.js";

import { randomInt, shuffleArray } from "./number.js";
import { getPlayerAmount, eachPlayer } from "./playerManager.js";
import { BedwarsPlayer, initPlayer } from "./bedwarsPlayer.js";
import { overworld, positionManager, Vector } from "./positionManager.js";
import { eventManager } from "../events/eventManager.js";

/** 
 * @typedef mapOptions 地图设置选项
 * @property {Number} ironInterval 平均每个铁的基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔*每次生成的铁锭数/(1+速度加成)）
 * @property {Number} goldInterval 金基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔/(1+速度加成)
 * @property {Number} diamondInterval 钻石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级）
 * @property {Number} emeraldInterval 绿宝石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级）
 * @property {Vector} spawnpointPos 地图重生点，玩家死亡后将重生于此
 * @property {Number} healPoolRadius 治愈池范围
 * @property {Number} maxHeightLimit 最高高度限制
 * @property {Number} minHeightLimit 最低高度限制
 * @property {Boolean} distributeResource 是否在每次生成时，在3*3范围内分散式地生成资源
 * @property {Boolean} clearResourceVelocity 是否清除生成资源的向量
 * @property {Number} ironSpawnTimes 每次生成铁的数目
 * @property {Boolean} playerCouldIntoShop 玩家是否可以进入商店
 * @property {"classic" | "capture"} mode 地图模式，classic=经典，capture=夺点模式
 * 
 */

/** 可用 2 队地图列表 */
export const validMapsFor2Teams = [ "cryptic", "frost", "garden", "ruins", "picnic", "lion_temple" ];

/** 可用 4 队地图列表 */
export const validMapsFor4Teams = [ "orchid", "chained", "boletum", "carapace", "archway", "aquarium" ];

/** 可用 8 队地图列表 */
export const validMapsFor8Teams = [ "glacier", "rooftop", "amazon", "deadwood" ];

/** 可用夺点模式地图列表 */
export const validMapsForCaptureMode = [ "picnic_capture" ]

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

    /** 队伍数，在使用addTeam方法时，此数值将自加 */
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

    /** 商人信息，包括位置、朝向、类型
     * @type {{ pos: Vector, direction: Number, type: "blocks_and_items" | "weapon_and_armor" | "team_upgrade" | "weapon_and_armor_capture" }[]}
     */
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
        /** 地图是否正在加载 */ isLoading: true,
        /** 清空地图时，正在清除的高度层 */ clearingLayer: 116,
        /** 清空地图时，间隔多长时间清除下一层，单位：游戏刻 */ clearTimePerLayer: 3,
        /** 加载结构所需的时间，单位：游戏刻 */ structureLoadTime: 100,
        /** 设置队伍岛屿颜色和床所需的时间，单位：游戏刻 */ setTeamIslandTime: 20
    };

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
        /** 优势方 @type {"red"|"blue"|"none"} */ dominantTeam: "none",
    };

    /** 【构建器】
     * @param {String} id 地图 ID
     * @param {String} name 地图名称
     * @param {mapOptions} options 可选项
     */
    constructor( id, name, options = {} ) {
        this.id = id;
        this.name = name;
        if ( options.ironInterval !== undefined ) { this.spawnerInfo.ironInterval = options.ironInterval; }
        if ( options.goldInterval !== undefined ) { this.spawnerInfo.goldInterval = options.goldInterval; }
        if ( options.diamondInterval !== undefined ) { this.spawnerInfo.diamondInterval = options.diamondInterval; }
        if ( options.emeraldInterval !== undefined ) { this.spawnerInfo.emeraldInterval = options.emeraldInterval; }
        if ( options.ironSpawnTimes !== undefined ) { this.spawnerInfo.ironSpawnTimes = options.ironSpawnTimes; }
        if ( options.distributeResource !== undefined ) { this.spawnerInfo.distributeResource = options.distributeResource; }
        if ( options.clearResourceVelocity !== undefined ) { this.spawnerInfo.clearResourceVelocity = options.clearResourceVelocity; }
        if ( options.spawnpointPos !== undefined ) { this.spawnpointPos = options.spawnpointPos; }
        if ( options.healPoolRadius !== undefined ) { this.healPoolRadius = options.healPoolRadius; }
        if ( options.maxHeightLimit !== undefined ) { this.heightLimit.max = options.maxHeightLimit; }
        if ( options.minHeightLimit !== undefined ) { this.heightLimit.min = options.minHeightLimit; }
        if ( options.playerCouldIntoShop !== undefined ) { this.playerCouldIntoShop = options.playerCouldIntoShop; }
        if ( options.mode !== undefined ) { this.mode = options.mode; }
        this.spawnpointPos = new Vector( 0, this.heightLimit.max + 5, 0 );
    };

    /** 进行地图初始化 */
    init( ) {
        /** 设置地图阶段 */ this.gameStage = 0;
        /** 移除玩家的bedwarsInfo，还原玩家名字颜色 */ eachPlayer( player => { initPlayer( player ) } )
        /** 设置为禁止 PVP */ world.gameRules.pvp = false;
        /** 移除多余实体 */ overworld.getEntities().filter( entity => { return entity.typeId !== "minecraft:player" } ).forEach( entity => { entity.remove() } )
        /** 移除多余记分板 */ world.scoreboard.getObjectives().forEach( objective => { if ( objective !== undefined ) { world.scoreboard.removeObjective( objective ) } } )
        /** 进行初始化命令函数 */ overworld.runCommand( `function lib/init/map` );
        /** 重新开始游戏 */ eventManager.classicBeforeEvents();
    }

    /** 生成地图 */
    generateMap( ) {
        overworld.runCommand( `function maps/${this.id}/generate` )
        overworld.runCommand( `function lib/modify_data/set_border` )
    }

    /** 设置队伍岛的羊毛颜色与床 */
    teamIslandInit( ) {
        /** 羊毛颜色 */ overworld.runCommand( `function maps/${this.id}/team_island` )
        /** 放置床 */ eachTeam( team => { team.setBed( ) } )
    }

    /** 随机分配玩家的队伍 */
    assignPlayersRandomly(  ){

        /**
         * 分配逻辑为，现在有玩家数目playerAmount、分配队伍数teamCount和随机玩家列表Player[]，
         * 先用玩家数目除以分配队伍数，playerAmount / teamCount = a ... b
         * 然后，先为所有队伍分配 a 人，这样还剩下 b 人，将这 b 人每人随机插入到随机队伍中，插入后即移除该队伍以防止某个队伍比别队多出2人或更多人
         */

        /** 获取所有玩家和队伍 */
        let players = world.getPlayers(); players = shuffleArray( players );
        let copiedTeamList = [ ...this.teamList ]; copiedTeamList = shuffleArray( copiedTeamList );

        let a = getPlayerAmount() / this.teamCount;
        eachTeam( team => {
            for ( let i = 0; i < a; i++ ) {
                new BedwarsPlayer( players[i].name, team.id );
            };
            players.splice( 0, a );
        } )
        if ( players.length !== 0 ) {
            players.forEach( player => {
                new BedwarsPlayer( player.name, copiedTeamList[0].id )
                copiedTeamList.splice( 0, 1 );
            } )
        }

    };

    /** 将本地图中可能需要用于检测的队伍加入到地图信息中
     * @param {BedwarsTeam} team - 要加入的队伍信息
     */
    addTeam( team ){
        /** 检查要加入的内容是否为有效的队伍 */
        if ( team === undefined || team.id === undefined ) {
            world.sendMessage( { translate: "message.invalidTeam" } );
        }
        /** 若为有效的队伍，且为合理的 ID 时，则添加队伍 */ 
        else if ( validTeams.includes( team.id ) ) {
            this.teamList.push( team );
            this.teamCount = this.teamList.length;
        }
        /** 如果不是合理的ID，则报错 */
        else {
            world.sendMessage( { translate: "message.invalidTeamId", with: [team.id] } );
        }
    };

    /** 添加商人信息
     * @param {Vector} pos - 新增的商人位置
     * @param {Number} direction - 商人的初始朝向，为 0 ~ 360
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade" | "weapon_and_armor_capture"} type - 商人类型
     */
    addTrader( pos, direction, type ) {
        this.traderInfo.push( { pos: positionManager.center( pos ) , direction: direction, type: type } )
    }

    /** 添加资源点信息
     * @param {"diamond"|"emerald"} resourceType - 欲添加的资源点类型
     * @param {Vector} pos - 资源点的位置
     */
    addSpawner( resourceType, pos ) {
        switch ( resourceType ) {
            case "diamond": this.spawnerInfo.diamondInfo.push( { pos: positionManager.center( pos ), spawned: 0 } ); break;
            case "emerald": this.spawnerInfo.emeraldInfo.push( { pos: positionManager.center( pos ), spawned: 0 } ); break;
            default: break;
        }
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

    /** 生成商人 */
    setTrader() {

        this.traderInfo.forEach( traderInfo => {

            /** 设置新的商人的位置和朝向 */
            let trader = overworld.spawnEntity( "bedwars:trader", traderInfo.pos );
            trader.setRotation( new Vector( 0, traderInfo.direction ) );

            /** 设置商人的类型和皮肤 */
            trader.triggerEvent( `${traderInfo.type}_trader` );
            trader.triggerEvent( `assign_skin_randomly` );
    
            /** 设置商人的名字 <lang> */
            if ( traderInfo.type === "blocks_and_items" ) { trader.nameTag = `§a方块与物品`; }
            else if ( traderInfo.type === "weapon_and_armor" ) { trader.nameTag = `§c武器与盔甲`; }
            else if ( traderInfo.type === "weapon_and_armor_capture" ) { trader.nameTag = `§c武器与盔甲`; }
            else { trader.nameTag = `§b团队升级`; }

        } )

    };

    /** 游戏结束事件 */
    gameOver( ) {
        this.gameStage = 2;
        this.nextGameCountdown = 200;
    };

    /** 获取未被淘汰的队伍 */
    getAliveTeam( ) {
        return this.teamList.filter( team => team.isEliminated === false )
    };

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

/** 重新生成地图并启用经典模式的游戏前事件
 * @param {String} mapId - 如果提供了此参数，则将生成这张固定的地图
 */
export function regenerateMap( mapId = undefined ) {

    /** 获取所有可用地图 */
    let mapList = [];
    if (settings.randomMap.allow2Teams) { mapList = mapList.concat(validMapsFor2Teams).concat(validMapsForCaptureMode); };
    if (settings.randomMap.allow4Teams) { mapList = mapList.concat(validMapsFor4Teams); };
    if (settings.randomMap.allow8Teams) { mapList = mapList.concat(validMapsFor8Teams); };

    /** 在所有可用地图中选择一个 */
    let randomMap = mapList[ Math.floor( Math.random() * mapList.length ) ];

    /** 如果已经传入参数并确定生成的地图，则使用确定的地图 */
    if ( mapList.includes( mapId ) ) { randomMap = mapId };

    /** 生成之 */
    switch ( randomMap ) {

        case "orchid": createMapOrchid(); break;
        case "chained": createMapChained(); break;
        case "boletum": createMapBoletum(); break;
        case "carapace": createMapCarapace(); break;
        case "archway": createMapArchway(); break;
        case "aquarium": createMapAquarium(); break;

        case "cryptic": createMapCryptic(); break;
        case "frost": createMapFrost(); break;
        case "garden": createMapGarden(); break;
        case "ruins": createMapRuins(); break;
        case "picnic": createMapPicnic(); break;
        case "lion_temple": createMapLionTemple(); break;

        case "glacier": createMapGlacier(); break;
        case "rooftop": createMapRooftop(); break;
        case "amazon": createMapAmazon(); break;
        case "deadwood": createMapDeadwood(); break;

        case "picnic_capture": createMapPicnicCapture(); break;
    }
}

/** 地图信息 @return {BedwarsMap} */
export let map = () => { return world.bedwarsMap };

/** ===== 4队地图 ===== */

/** 【4队】兰花 */
function createMapOrchid( ) {

    /** 队伍信息初始化 */
    let mapOrchid = new BedwarsMap( "orchid", "兰花", { maxHeightLimit: 95, healPoolRadius: 21, playerCouldIntoShop: false } );
    let teamRed = new BedwarsTeam( "red", new Vector( 41, 71, -50 ), 0, new Vector( 62, 71, -50 ), new Vector( 58, 71, -49 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 41, 71, 50 ), 0, new Vector( 62, 71, 50 ), new Vector( 58, 71, 49 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( -41, 71, 50 ), 2, new Vector( -62, 71, 50 ), new Vector( -58, 71, 49 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( -41, 71, -50 ), 2, new Vector( -62, 71, -50 ), new Vector( -58, 71, -49 ) );

    /** 移除多余实体，进行初始化 */
    mapOrchid.init()

    /** 设置地图的队伍 */
    mapOrchid.addTeam( teamRed ); 
    mapOrchid.addTeam( teamBlue ); 
    mapOrchid.addTeam( teamGreen ); 
    mapOrchid.addTeam( teamYellow );

    /** 设置地图钻石和绿宝石生成点 */
    mapOrchid.addSpawner( "diamond", new Vector( 0, 72, -76 ) );
    mapOrchid.addSpawner( "diamond", new Vector( 56, 72, 0 ) );
    mapOrchid.addSpawner( "diamond", new Vector( 0, 72, 76 ) );
    mapOrchid.addSpawner( "diamond", new Vector( -56, 72, 0 ) );
    mapOrchid.addSpawner( "emerald", new Vector( 0, 72, -8 ) );
    mapOrchid.addSpawner( "emerald", new Vector( 0, 72, 8 ) );

    /** 设置地图商人 */
    mapOrchid.addTrader( new Vector( 59, 71, -45 ), 180, "blocks_and_items" );
    mapOrchid.addTrader( new Vector( 57, 71, 45 ), 0, "blocks_and_items" );
    mapOrchid.addTrader( new Vector( -59, 71, 45 ), 0, "blocks_and_items" );
    mapOrchid.addTrader( new Vector( -57, 71, -45 ), 180, "blocks_and_items" );
    mapOrchid.addTrader( new Vector( 57, 71, -45 ), 180, "weapon_and_armor" );
    mapOrchid.addTrader( new Vector( 59, 71, 45 ), 0, "weapon_and_armor" );
    mapOrchid.addTrader( new Vector( -57, 71, 45 ), 0, "weapon_and_armor" );
    mapOrchid.addTrader( new Vector( -59, 71, -45 ), 180, "weapon_and_armor" );
    mapOrchid.addTrader( new Vector( 55, 71, -54 ), 270, "team_upgrade" );
    mapOrchid.addTrader( new Vector( 55, 71, 54 ), 270, "team_upgrade" );
    mapOrchid.addTrader( new Vector( -55, 71, 54 ), 90, "team_upgrade" );
    mapOrchid.addTrader( new Vector( -55, 71, -54 ), 90, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapOrchid;

}

/** 【4队】铁索连环 */
function createMapChained( ) {

    /** 队伍信息初始化 */
    let mapChained = new BedwarsMap( "chained", "铁索连环", { maxHeightLimit: 90 } );
    let teamRed = new BedwarsTeam( "red", new Vector( 69, 65, 0 ), 0, new Vector( 86, 64, 0 ), new Vector( 81, 64, 0 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 0, 65, 69 ), 1, new Vector( 0, 64, 86 ), new Vector( 0, 64, 81 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( -69, 65, 0 ), 2, new Vector( -86, 64, 0 ), new Vector( -81, 64, 0 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 0, 65, -69 ), 3, new Vector( 0, 64, -86 ), new Vector( 0, 64, -81 ) );
    
    /** 移除多余实体，进行初始化 */
    mapChained.init()
    
    /** 设置地图的队伍 */
    mapChained.addTeam( teamRed ); 
    mapChained.addTeam( teamBlue ); 
    mapChained.addTeam( teamGreen ); 
    mapChained.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapChained.addSpawner( "diamond", new Vector( 36, 67, 34 ) );
    mapChained.addSpawner( "diamond", new Vector( -34, 67, 36 ) );
    mapChained.addSpawner( "diamond", new Vector( -36, 67, -34 ) );
    mapChained.addSpawner( "diamond", new Vector( 34, 67, -36 ) );
    mapChained.addSpawner( "emerald", new Vector( -11, 67, 0 ) );
    mapChained.addSpawner( "emerald", new Vector( 11, 67, 0 ) );
    
    /** 设置地图商人 */
    mapChained.addTrader( new Vector( 84, 64, 8 ), 180, "blocks_and_items" );
    mapChained.addTrader( new Vector( -8, 64, 84 ), 270, "blocks_and_items" );
    mapChained.addTrader( new Vector( -84, 64, -8 ), 0, "blocks_and_items" );
    mapChained.addTrader( new Vector( 8, 64, -84 ), 90, "blocks_and_items" );
    mapChained.addTrader( new Vector( 82, 64, 8 ), 180, "weapon_and_armor" );
    mapChained.addTrader( new Vector( -8, 64, 82 ), 270, "weapon_and_armor" );
    mapChained.addTrader( new Vector( -82, 64, -8 ), 0, "weapon_and_armor" );
    mapChained.addTrader( new Vector( 8, 64, -82 ), 90, "weapon_and_armor" );
    mapChained.addTrader( new Vector( 83, 64, -8 ), 0, "team_upgrade" );
    mapChained.addTrader( new Vector( 8, 64, 83 ), 90, "team_upgrade" );
    mapChained.addTrader( new Vector( -83, 64, 8 ), 180, "team_upgrade" );
    mapChained.addTrader( new Vector( -8, 64, -83 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapChained;
    
}

/** 【4队】蘑菇岛 */
function createMapBoletum( ) {

    /** 队伍信息初始化 */
    let mapBoletum = new BedwarsMap( "boletum", "蘑菇岛", { maxHeightLimit: 94 } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 69, 66 ), 1, new Vector( 0, 68, 82 ), new Vector( 0, 68, 78 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( -68, 69, 0 ), 2, new Vector( -84, 68, 0 ), new Vector( -80, 68, 0 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( -2, 69, -68 ), 3, new Vector( -2, 68, -84 ), new Vector( -2, 68, -80 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 66, 69, -2 ), 0, new Vector( 82, 68, -2 ), new Vector( 78, 68, -2 ) );
    
    /** 移除多余实体，进行初始化 */
    mapBoletum.init()
    
    /** 设置地图的队伍 */
    mapBoletum.addTeam( teamRed ); 
    mapBoletum.addTeam( teamBlue ); 
    mapBoletum.addTeam( teamGreen ); 
    mapBoletum.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapBoletum.addSpawner( "diamond", new Vector( 43, 70, -43 ) );
    mapBoletum.addSpawner( "diamond", new Vector( 43, 70, 43 ) );
    mapBoletum.addSpawner( "diamond", new Vector( -43, 70, 43 ) );
    mapBoletum.addSpawner( "diamond", new Vector( -43, 70, -43 ) );
    mapBoletum.addSpawner( "emerald", new Vector( -11, 74, -12 ) );
    mapBoletum.addSpawner( "emerald", new Vector( 9, 74, 12 ) );
    
    /** 设置地图商人 */
    mapBoletum.addTrader( new Vector( -5, 68, 80 ), 180, "blocks_and_items" );
    mapBoletum.addTrader( new Vector( -82, 68, -5 ), 270, "blocks_and_items" );
    mapBoletum.addTrader( new Vector( 3, 68, -82 ), 0, "blocks_and_items" );
    mapBoletum.addTrader( new Vector( 80, 68, 3 ), 90, "blocks_and_items" );
    mapBoletum.addTrader( new Vector( -5, 68, 79 ), 180, "weapon_and_armor" );
    mapBoletum.addTrader( new Vector( -81, 68, -5 ), 270, "weapon_and_armor" );
    mapBoletum.addTrader( new Vector( 3, 68, -81 ), 0, "weapon_and_armor" );
    mapBoletum.addTrader( new Vector( 79, 68, 3 ), 90, "weapon_and_armor" );
    mapBoletum.addTrader( new Vector( 6, 68, 80.5 ), 0, "team_upgrade" );
    mapBoletum.addTrader( new Vector( -81.5, 68, 6 ), 90, "team_upgrade" );
    mapBoletum.addTrader( new Vector( -8, 68, -81.5 ), 180, "team_upgrade" );
    mapBoletum.addTrader( new Vector( 80.5 , 68, -8 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapBoletum;
    
}

/** 【4队】甲壳 */
function createMapCarapace( ) {

    /** 队伍信息初始化 */
    let mapCarapace = new BedwarsMap( "carapace", "甲壳", { maxHeightLimit: 91, distributeResource: false, clearResourceVelocity: false, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 66, -48 ), 3, new Vector( 0, 66, -64 ), new Vector( 0, 66, -58 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 48, 66, 0 ), 0, new Vector( 64, 66, 0 ), new Vector( 58, 66, 0 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 0, 66, 48 ), 1, new Vector( 0, 66, 64 ), new Vector( 0, 66, 58 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( -48, 66, 0 ), 2, new Vector( -64, 66, 0 ), new Vector( -58, 66, 0 ) );
    
    /** 移除多余实体，进行初始化 */
    mapCarapace.init()
    
    /** 设置地图的队伍 */
    mapCarapace.addTeam( teamRed ); 
    mapCarapace.addTeam( teamBlue ); 
    mapCarapace.addTeam( teamGreen ); 
    mapCarapace.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCarapace.addSpawner( "diamond", new Vector( 31, 67, -30 ) );
    mapCarapace.addSpawner( "diamond", new Vector( 30, 67, 31 ) );
    mapCarapace.addSpawner( "diamond", new Vector( -31, 67, 30 ) );
    mapCarapace.addSpawner( "diamond", new Vector( -30, 67, -31 ) );
    mapCarapace.addSpawner( "emerald", new Vector( 0, 67, 0 ) );
    mapCarapace.addSpawner( "emerald", new Vector( 0, 75, 0 ) );
    
    /** 设置地图商人 */
    mapCarapace.addTrader( new Vector( 5, 66, -59 ), 180, "blocks_and_items" );
    mapCarapace.addTrader( new Vector( 59, 66, 5 ), 270, "blocks_and_items" );
    mapCarapace.addTrader( new Vector( -5, 66, 59 ), 0, "blocks_and_items" );
    mapCarapace.addTrader( new Vector( -59, 66, -5 ), 90, "blocks_and_items" );
    mapCarapace.addTrader( new Vector( 5, 66, -57 ), 180, "weapon_and_armor" );
    mapCarapace.addTrader( new Vector( 57, 66, 5 ), 270, "weapon_and_armor" );
    mapCarapace.addTrader( new Vector( -5, 66, 57 ), 0, "weapon_and_armor" );
    mapCarapace.addTrader( new Vector( -57, 66, -5 ), 90, "weapon_and_armor" );
    mapCarapace.addTrader( new Vector( -5, 66, -58 ), 0, "team_upgrade" );
    mapCarapace.addTrader( new Vector( 58, 66, -5 ), 90, "team_upgrade" );
    mapCarapace.addTrader( new Vector( 5, 66, 58 ), 180, "team_upgrade" );
    mapCarapace.addTrader( new Vector( -58, 66, 5 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCarapace;
    
}

/** 【4队】拱形廊道 */
function createMapArchway( ) {
    /** 队伍信息初始化 */
    let mapArchway = new BedwarsMap( "archway", "拱形廊道", { maxHeightLimit: 91, healPoolRadius: 15, distributeResource: false, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -15, 66, -66 ), 3, new Vector( -14, 65, -79 ), new Vector( -14, 65, -75 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 66, 66, -15 ), 0, new Vector( 79, 65, -14 ), new Vector( 75, 65, -14 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 15, 66, 66 ), 1, new Vector( 14, 65, 79 ), new Vector( 14, 65, 75 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( -66, 66, 15 ), 2, new Vector( -79, 65, 14 ), new Vector( -75, 65, 14 ) );
    
    /** 移除多余实体，进行初始化 */
    mapArchway.init()
    
    /** 设置地图的队伍 */
    mapArchway.addTeam( teamRed ); 
    mapArchway.addTeam( teamBlue ); 
    mapArchway.addTeam( teamGreen ); 
    mapArchway.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapArchway.addSpawner( "diamond", new Vector( 34, 67, -49 ) );
    mapArchway.addSpawner( "diamond", new Vector( 49, 67, 34 ) );
    mapArchway.addSpawner( "diamond", new Vector( -34, 67, 49 ) );
    mapArchway.addSpawner( "diamond", new Vector( -49, 67, -34 ) );
    mapArchway.addSpawner( "emerald", new Vector( 0, 66, 0 ) );
    mapArchway.addSpawner( "emerald", new Vector( 0, 76, 0 ) );
    
    /** 设置地图商人 */
    mapArchway.addTrader( new Vector( -9, 65, -76 ), 90, "blocks_and_items" );
    mapArchway.addTrader( new Vector( 76, 65, -9 ), 180, "blocks_and_items" );
    mapArchway.addTrader( new Vector( 9, 65, 76 ), 270, "blocks_and_items" );
    mapArchway.addTrader( new Vector( -76, 65, 9 ), 90, "blocks_and_items" );
    mapArchway.addTrader( new Vector( -9, 65, -75 ), 90, "weapon_and_armor" );
    mapArchway.addTrader( new Vector( 75, 65, -9 ), 180, "weapon_and_armor" );
    mapArchway.addTrader( new Vector( 9, 65, 75 ), 270, "weapon_and_armor" );
    mapArchway.addTrader( new Vector( -75, 65, 9 ), 90, "weapon_and_armor" );
    mapArchway.addTrader( new Vector( -19, 65, -75.5 ), 270, "team_upgrade" );
    mapArchway.addTrader( new Vector( 75.5, 65, -19 ), 90, "team_upgrade" );
    mapArchway.addTrader( new Vector( 19, 65, 75.5 ), 90, "team_upgrade" );
    mapArchway.addTrader( new Vector( -75.5, 65, 19 ), 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapArchway;

}

/** 【4队】水族馆 */
function createMapAquarium( ) {
    /** 队伍信息初始化 */
    let mapAquarium = new BedwarsMap( "aquarium", "水族馆", { maxHeightLimit: 112, minHeightLimit: 78, healPoolRadius: 20, distributeResource: true } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 87, -48 ), 3, new Vector( 0, 87, -64 ), new Vector( 0, 87, -58 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 48, 87, 0 ), 0, new Vector( 64, 87, 0 ), new Vector( 58, 87, 0 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 0, 87, 48 ), 1, new Vector( 0, 87, 64 ), new Vector( 0, 87, 58 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( -48, 87, 0 ), 2, new Vector( -64, 87, 0 ), new Vector( -58, 87, 0 ) );
    
    /** 移除多余实体，进行初始化 */
    mapAquarium.init()
    
    /** 设置地图的队伍 */
    mapAquarium.addTeam( teamRed ); 
    mapAquarium.addTeam( teamBlue ); 
    mapAquarium.addTeam( teamGreen ); 
    mapAquarium.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapAquarium.addSpawner( "diamond", new Vector( -41, 83, -39 ) );
    mapAquarium.addSpawner( "diamond", new Vector( 39, 83, -41 ) );
    mapAquarium.addSpawner( "diamond", new Vector( 41, 83, 39 ) );
    mapAquarium.addSpawner( "diamond", new Vector( -39, 83, 41 ) );
    mapAquarium.addSpawner( "emerald", new Vector( -10, 96, -11 ) );
    mapAquarium.addSpawner( "emerald", new Vector( 8, 96, 11 ) );
    
    /** 设置地图商人 */
    mapAquarium.addTrader( new Vector( 5, 87, -60 ), 90, "blocks_and_items" );
    mapAquarium.addTrader( new Vector( 60, 87, 5 ), 180, "blocks_and_items" );
    mapAquarium.addTrader( new Vector( -5, 87, 60 ), 270, "blocks_and_items" );
    mapAquarium.addTrader( new Vector( -60, 87, -5 ), 0, "blocks_and_items" );
    mapAquarium.addTrader( new Vector( 5, 87, -59 ), 90, "weapon_and_armor" );
    mapAquarium.addTrader( new Vector( 59, 87, 5 ), 180, "weapon_and_armor" );
    mapAquarium.addTrader( new Vector( -5, 87, 59 ), 270, "weapon_and_armor" );
    mapAquarium.addTrader( new Vector( -59, 87, -5 ), 0, "weapon_and_armor" );
    mapAquarium.addTrader( new Vector( 5, 87, -57 ), 90, "team_upgrade" );
    mapAquarium.addTrader( new Vector( 57, 87, 5 ), 180, "team_upgrade" );
    mapAquarium.addTrader( new Vector( -5, 87, 57 ), 270, "team_upgrade" );
    mapAquarium.addTrader( new Vector( -57, 87, -5 ), 0, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapAquarium;

}

/** ===== 2队地图 ===== */

/** 【2队】神秘 */
function createMapCryptic( ) {

    /** 队伍信息初始化 */
    let mapCryptic = new BedwarsMap( "cryptic", "神秘", { maxHeightLimit: 102, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", new Vector( 2, 77, 73 ), 1, new Vector( 2, 78, 90 ), new Vector( 2, 78, 85 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 2, 77, -73 ), 3, new Vector( 2, 78, -90 ), new Vector( 2, 78, -85 ) );
    
    /** 移除多余实体，进行初始化 */
    mapCryptic.init()
    
    /** 设置地图的队伍 */
    mapCryptic.addTeam( teamRed ); 
    mapCryptic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCryptic.addSpawner( "diamond", new Vector( -70, 80, 0 ) );
    mapCryptic.addSpawner( "diamond", new Vector( 70, 75, 0 ) );
    mapCryptic.addSpawner( "emerald", new Vector( 21, 70, 0 ) );
    mapCryptic.addSpawner( "emerald", new Vector( -25, 83, 0 ) );
    
    /** 设置地图商人 */
    mapCryptic.addTrader( new Vector( -2, 78, 87 ), 270, "blocks_and_items" );
    mapCryptic.addTrader( new Vector( 6, 78, -87 ), 90, "blocks_and_items" );
    mapCryptic.addTrader( new Vector( -2, 78, 85 ), 270, "weapon_and_armor" );
    mapCryptic.addTrader( new Vector( 6, 78, -85 ), 90, "weapon_and_armor" );
    mapCryptic.addTrader( new Vector( 6, 78, 86 ), 90, "team_upgrade" );
    mapCryptic.addTrader( new Vector( -3, 78, -86 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCryptic;
    
}

/** 【2队】极寒 */
function createMapFrost( ) {

    /** 队伍信息初始化 */
    let mapFrost = new BedwarsMap( "frost", "极寒", { maxHeightLimit: 97 } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 72, 59 ), 1, new Vector( 0, 72, 75 ), new Vector( 0, 72, 70 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 0, 72, -59 ), 3, new Vector( 0, 72, -75 ), new Vector( 0, 72, -70 ) );
    
    /** 移除多余实体，进行初始化 */
    mapFrost.init()
    
    /** 设置地图的队伍 */
    mapFrost.addTeam( teamRed ); 
    mapFrost.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapFrost.addSpawner( "diamond", new Vector( 38, 77, -10 ) );
    mapFrost.addSpawner( "diamond", new Vector( -38, 77, 10 ) );
    mapFrost.addSpawner( "emerald", new Vector( 0, 78, -12 ) );
    mapFrost.addSpawner( "emerald", new Vector( 0, 78, 12 ) );
    
    /** 设置地图商人 */
    mapFrost.addTrader( new Vector( -6, 72, 72 ), 270, "blocks_and_items" );
    mapFrost.addTrader( new Vector( 6, 72, -72 ), 90, "blocks_and_items" );
    mapFrost.addTrader( new Vector( -6, 72, 70 ), 270, "weapon_and_armor" );
    mapFrost.addTrader( new Vector( 6, 72, -70 ), 90, "weapon_and_armor" );
    mapFrost.addTrader( new Vector( 6, 72, 71 ), 90, "team_upgrade" );
    mapFrost.addTrader( new Vector( -6, 72, -71 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapFrost;
    
}

/** 【2队】花园 */
function createMapGarden( ) {

    /** 队伍信息初始化 */
    let mapGarden = new BedwarsMap( "garden", "花园", { maxHeightLimit: 97 } );
    let teamRed = new BedwarsTeam( "red", new Vector( 79, 77, 0 ), 0, new Vector( 98, 79, 0 ), new Vector( 94, 79, 0 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( -79, 77, 0 ), 2, new Vector( -98, 79, 0 ), new Vector( -94, 79, 0 ) );
    
    /** 移除多余实体，进行初始化 */
    mapGarden.init()
    
    /** 设置地图的队伍 */
    mapGarden.addTeam( teamRed ); 
    mapGarden.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapGarden.addSpawner( "diamond", new Vector( 0, 79, -52 ) );
    mapGarden.addSpawner( "diamond", new Vector( 0, 79, 52 ) );
    mapGarden.addSpawner( "emerald", new Vector( -21, 78, -21 ) );
    mapGarden.addSpawner( "emerald", new Vector( 21, 78, 21 ) );
    
    /** 设置地图商人 */
    mapGarden.addTrader( new Vector( 95, 79, 8 ), 180, "blocks_and_items" );
    mapGarden.addTrader( new Vector( -95, 79, -8 ), 0, "blocks_and_items" );
    mapGarden.addTrader( new Vector( 93, 79, 8 ), 180, "weapon_and_armor" );
    mapGarden.addTrader( new Vector( -93, 79, -8 ), 0, "weapon_and_armor" );
    mapGarden.addTrader( new Vector( 94, 79, -8 ), 0, "team_upgrade" );
    mapGarden.addTrader( new Vector( -94, 79, 8 ), 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapGarden;
    
}

/** 【2队】废墟 */
function createMapRuins( ) {

    /** 队伍信息初始化 */
    let mapRuins = new BedwarsMap( "ruins", "废墟", { maxHeightLimit: 96 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -4, 71, -64 ), 3, new Vector( 0, 72, -82 ), new Vector( 0, 72, -78 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 4, 71, 64 ), 1, new Vector( 0, 72, 82 ), new Vector( 0, 72, 78 ) );
    
    /** 移除多余实体，进行初始化 */
    mapRuins.init()
    
    /** 设置地图的队伍 */
    mapRuins.addTeam( teamRed ); 
    mapRuins.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapRuins.addSpawner( "diamond", new Vector( -47, 71, -10 ) );
    mapRuins.addSpawner( "diamond", new Vector( 47, 71, 10 ) );
    mapRuins.addSpawner( "emerald", new Vector( 17, 71, -6 ) );
    mapRuins.addSpawner( "emerald", new Vector( -17, 71, 6 ) );
    
    /** 设置地图商人 */
    mapRuins.addTrader( new Vector( 6, 72, -80 ), 90, "blocks_and_items" );
    mapRuins.addTrader( new Vector( -6, 72, 80 ), 270, "blocks_and_items" );
    mapRuins.addTrader( new Vector( 6, 72, -79 ), 90, "weapon_and_armor" );
    mapRuins.addTrader( new Vector( -6, 72, 79 ), 270, "weapon_and_armor" );
    mapRuins.addTrader( new Vector( -6, 72, -79.5 ), 270, "team_upgrade" );
    mapRuins.addTrader( new Vector( 6, 72, 79.5 ), 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapRuins;
    
}

/** 【2队】野餐 */
function createMapPicnic( ) {

    /** 队伍信息初始化 */
    let mapPicnic = new BedwarsMap( "picnic", "野餐", { maxHeightLimit: 90, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 65, -62 ), 3, new Vector( 0, 64, -78 ), new Vector( 0, 64, -74 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 0, 65, 61 ), 1, new Vector( 0, 64, 77 ), new Vector( 0, 64, 73 ) );
    
    /** 移除多余实体，进行初始化 */
    mapPicnic.init()
    
    /** 设置地图的队伍 */
    mapPicnic.addTeam( teamRed ); 
    mapPicnic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapPicnic.addSpawner( "diamond", new Vector( 48, 65, 10 ) );
    mapPicnic.addSpawner( "diamond", new Vector( -48, 65, -10 ) );
    mapPicnic.addSpawner( "emerald", new Vector( -7, 70, -11 ) );
    mapPicnic.addSpawner( "emerald", new Vector( 8, 70, 12 ) );

    /** 设置地图商人 */
    mapPicnic.addTrader( new Vector( 6, 64, -76 ), 90, "blocks_and_items" );
    mapPicnic.addTrader( new Vector( -6, 64, 75 ), 270, "blocks_and_items" );
    mapPicnic.addTrader( new Vector( 6, 64, -75 ), 90, "weapon_and_armor" );
    mapPicnic.addTrader( new Vector( -6, 64, 74 ), 270, "weapon_and_armor" );
    mapPicnic.addTrader( new Vector( -6, 64, -75.5 ), 270, "team_upgrade" );
    mapPicnic.addTrader( new Vector( 6, 64, 74.5 ), 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapPicnic;
    
}

/** 【2队】狮庙 */
function createMapLionTemple( ) {

    /** 队伍信息初始化 */
    let mapLionTemple = new BedwarsMap( "lion_temple", "狮庙", { maxHeightLimit: 100, distributeResource: false, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -2, 73, 58 ), 1, new Vector( -2, 75, 78 ), new Vector( -2, 75, 73 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( -2, 73, -58 ), 3, new Vector( -2, 75, -78 ), new Vector( -2, 75, -73 ) );
    /** 移除多余实体，进行初始化 */
    mapLionTemple.init()
    
    /** 设置地图的队伍 */
    mapLionTemple.addTeam( teamRed ); 
    mapLionTemple.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapLionTemple.addSpawner( "diamond", new Vector( 53, 85, 0 ) );
    mapLionTemple.addSpawner( "diamond", new Vector( -58, 85, 0 ) );
    mapLionTemple.addSpawner( "emerald", new Vector( -20, 79, 0 ) );
    mapLionTemple.addSpawner( "emerald", new Vector( 17, 84, 0 ) );

    /** 设置地图商人 */
    mapLionTemple.addTrader( new Vector( -7, 75, 73 ), 270, "blocks_and_items" );
    mapLionTemple.addTrader( new Vector( 3, 75, -73 ), 90, "blocks_and_items" );
    mapLionTemple.addTrader( new Vector( -7, 75, 71 ), 270, "weapon_and_armor" );
    mapLionTemple.addTrader( new Vector( 3, 75, -71 ), 90, "weapon_and_armor" );
    mapLionTemple.addTrader( new Vector( 3, 75, 72 ), 90, "team_upgrade" );
    mapLionTemple.addTrader( new Vector( -7, 75, -72 ), 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapLionTemple;
    
}

/** ===== 8队地图 ===== */

/** 【8队】冰川 */
function createMapGlacier() {

    /** 队伍信息初始化 */
    let mapGlacier = new BedwarsMap( "glacier", "冰川", { maxHeightLimit: 106, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -32, 81, -65 ), 3, new Vector( -32, 81, -86 ), new Vector( -32, 81, -80 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 32, 81, -65 ), 3, new Vector( 32, 81, -86 ), new Vector( 32, 81, -80 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 65, 81, -32 ), 0, new Vector( 86, 81, -32 ), new Vector( 80, 81, -32 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 65, 81, 32 ), 0, new Vector( 86, 81, 32 ), new Vector( 80, 81, 32 ) );
    let teamCyan = new BedwarsTeam( "cyan", new Vector( 32, 81, 65 ), 1, new Vector( 32, 81, 86 ), new Vector( 32, 81, 80 ) );
    let teamWhite = new BedwarsTeam( "white", new Vector( -32, 81, 65 ), 1, new Vector( -32, 81, 86 ), new Vector( -32, 81, 80 ) );
    let teamPink = new BedwarsTeam( "pink", new Vector( -65, 81, 32 ), 2, new Vector( -86, 81, 32 ), new Vector( -80, 81, 32 ) );
    let teamGray = new BedwarsTeam( "gray", new Vector( -65, 81, -32 ), 2, new Vector( -86, 81, -32 ), new Vector( -80, 81, -32 ) );

    /** 移除多余实体，进行初始化 */
    mapGlacier.init()
    
    /** 设置地图的队伍 */
    mapGlacier.addTeam( teamRed );
    mapGlacier.addTeam( teamBlue );
    mapGlacier.addTeam( teamGreen );
    mapGlacier.addTeam( teamYellow );
    mapGlacier.addTeam( teamCyan );
    mapGlacier.addTeam( teamWhite );
    mapGlacier.addTeam( teamPink );
    mapGlacier.addTeam( teamGray );

    /** 设置地图钻石和绿宝石生成点 */
    mapGlacier.addSpawner( "diamond", new Vector( 0, 81, 50 ) );
    mapGlacier.addSpawner( "diamond", new Vector( 0, 81, -50 ) );
    mapGlacier.addSpawner( "diamond", new Vector( 50, 81, 0 ) );
    mapGlacier.addSpawner( "diamond", new Vector( -50, 81, 0 ) );
    mapGlacier.addSpawner( "emerald", new Vector( 20, 80, 20 ) );
    mapGlacier.addSpawner( "emerald", new Vector( 20, 80, -20 ) );
    mapGlacier.addSpawner( "emerald", new Vector( -20, 80, 20 ) );
    mapGlacier.addSpawner( "emerald", new Vector( -20, 80, -20 ) );

    /** 设置地图商人 */
    mapGlacier.addTrader( new Vector( -29, 81, -87 ), 0, "blocks_and_items" ); mapGlacier.addTrader( new Vector( -28, 81, -87 ), 0, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( -35.5, 81, -87 ), 0, "team_upgrade" );
    mapGlacier.addTrader( new Vector( 35, 81, -87 ), 0, "blocks_and_items" ); mapGlacier.addTrader( new Vector( 36, 81, -87 ), 0, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( 28.5, 81, -87 ), 0, "team_upgrade" );
    mapGlacier.addTrader( new Vector( 87, 81, -29 ), 90, "blocks_and_items" ); mapGlacier.addTrader( new Vector( 87, 81, -28 ), 90, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( 87, 81, -35.5 ), 90, "team_upgrade" );
    mapGlacier.addTrader( new Vector( 87, 81, 35 ), 90, "blocks_and_items" ); mapGlacier.addTrader( new Vector( 87, 81, 36 ), 90, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( 87, 81, 28.5 ), 90, "team_upgrade" );
    mapGlacier.addTrader( new Vector( 29, 81, 87 ), 180, "blocks_and_items" ); mapGlacier.addTrader( new Vector( 28, 81, 87 ), 180, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( 35.5, 81, 87 ), 180, "team_upgrade" );
    mapGlacier.addTrader( new Vector( -35, 81, 87 ), 180, "blocks_and_items" ); mapGlacier.addTrader( new Vector( -36, 81, 87 ), 180, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( -28.5, 81, 87 ), 180, "team_upgrade" );
    mapGlacier.addTrader( new Vector( -87, 81, 29 ), 270, "blocks_and_items" ); mapGlacier.addTrader( new Vector( -87, 81, 28 ), 270, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( -87, 81, 35.5 ), 270, "team_upgrade" );
    mapGlacier.addTrader( new Vector( -87, 81, -35 ), 270, "blocks_and_items" ); mapGlacier.addTrader( new Vector( -87, 81, -36 ), 270, "weapon_and_armor" ); mapGlacier.addTrader( new Vector( -87, 81, -28.5 ), 270, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapGlacier;
    
}

/** 【8队】屋顶 */
function createMapRooftop() {

    /** 队伍信息初始化 */
    let mapRooftop = new BedwarsMap( "rooftop", "屋顶", { maxHeightLimit: 91, minHeightLimit: 55, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -34, 66, -79 ), 3, new Vector( -34, 66, -96 ), new Vector( -34, 66, -89 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 34, 66, -79 ), 3, new Vector( 34, 66, -96 ), new Vector( 34, 66, -89 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 79, 66, -34 ), 0, new Vector( 96, 66, -34 ), new Vector( 89, 66, -34 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 79, 66, 34 ), 0, new Vector( 96, 66, 34 ), new Vector( 89, 66, 34 ) );
    let teamCyan = new BedwarsTeam( "cyan", new Vector( 34, 66, 79 ), 1, new Vector( 34, 66, 96 ), new Vector( 34, 66, 89 ) );
    let teamWhite = new BedwarsTeam( "white", new Vector( -34, 66, 79 ), 1, new Vector( -34, 66, 96 ), new Vector( -34, 66, 89 ) );
    let teamPink = new BedwarsTeam( "pink", new Vector( -79, 66, 34 ), 2, new Vector( -96, 66, 34 ), new Vector( -89, 66, 34 ) );
    let teamGray = new BedwarsTeam( "gray", new Vector( -79, 66, -34 ), 2, new Vector( -96, 66, -34 ), new Vector( -89, 66, -34 ) );

    /** 移除多余实体，进行初始化 */
    mapRooftop.init()
    
    /** 设置地图的队伍 */
    mapRooftop.addTeam( teamRed );
    mapRooftop.addTeam( teamBlue );
    mapRooftop.addTeam( teamGreen );
    mapRooftop.addTeam( teamYellow );
    mapRooftop.addTeam( teamCyan );
    mapRooftop.addTeam( teamWhite );
    mapRooftop.addTeam( teamPink );
    mapRooftop.addTeam( teamGray );

    /** 设置地图钻石和绿宝石生成点 */
    mapRooftop.addSpawner( "diamond", new Vector( 39, 72, 39 ) );
    mapRooftop.addSpawner( "diamond", new Vector( -39, 72, 39 ) );
    mapRooftop.addSpawner( "diamond", new Vector( 39, 72, -39 ) );
    mapRooftop.addSpawner( "diamond", new Vector( -39, 72, -39 ) );
    mapRooftop.addSpawner( "emerald", new Vector( 11, 81, 11 ) );
    mapRooftop.addSpawner( "emerald", new Vector( -11, 81, -11 ) );
    mapRooftop.addSpawner( "emerald", new Vector( 11, 72, 13 ) );
    mapRooftop.addSpawner( "emerald", new Vector( -11, 72, -13 ) );

    /** 设置地图商人 */
    mapRooftop.addTrader( new Vector( -28, 66, -91 ), 90, "blocks_and_items" ); mapRooftop.addTrader( new Vector( -28, 66, -90 ), 90, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( -40, 66, -90.5 ), 270, "team_upgrade" );
    mapRooftop.addTrader( new Vector( 40, 66, -91 ), 90, "blocks_and_items" ); mapRooftop.addTrader( new Vector( 40, 66, -90 ), 90, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( 28, 66, -90.5 ), 270, "team_upgrade" );
    mapRooftop.addTrader( new Vector( 91, 66, -28 ), 180, "blocks_and_items" ); mapRooftop.addTrader( new Vector( 90, 66, -28 ), 180, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( 90.5, 66, -40 ), 0, "team_upgrade" );
    mapRooftop.addTrader( new Vector( 91, 66, 40 ), 180, "blocks_and_items" ); mapRooftop.addTrader( new Vector( 90, 66, 40 ), 180, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( 90.5, 66, 28 ), 0, "team_upgrade" );
    mapRooftop.addTrader( new Vector( 28, 66, 91 ), 270, "blocks_and_items" ); mapRooftop.addTrader( new Vector( 28, 66, 90 ), 270, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( 40, 66, 90.5 ), 90, "team_upgrade" );
    mapRooftop.addTrader( new Vector( -40, 66, 91 ), 270, "blocks_and_items" ); mapRooftop.addTrader( new Vector( -40, 66, 90 ), 270, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( -28, 66, 90.5 ), 90, "team_upgrade" );
    mapRooftop.addTrader( new Vector( -91, 66, 28 ), 0, "blocks_and_items" ); mapRooftop.addTrader( new Vector( -90, 66, 28 ), 0, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( -90.5, 66, 40 ), 180, "team_upgrade" );
    mapRooftop.addTrader( new Vector( -91, 66, -40 ), 0, "blocks_and_items" ); mapRooftop.addTrader( new Vector( -90, 66, -40 ), 0, "weapon_and_armor" ); mapRooftop.addTrader( new Vector( -90.5, 66, -28 ), 180, "team_upgrade" );

    /** 延长本地图加载时间至15秒（因为这地图实在太大了......） */
    mapRooftop.loadInfo.structureLoadTime = 300;

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapRooftop;
    
}

/** 【8队】亚马逊 */
function createMapAmazon() {

    /** 队伍信息初始化 */
    let mapAmazon = new BedwarsMap( "amazon", "亚马逊", { maxHeightLimit: 90, minHeightLimit: 55, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -33, 65, -80 ), 3, new Vector( -33, 65, -100 ), new Vector( -33, 65, -95 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 33, 65, -80 ), 3, new Vector( 33, 65, -100 ), new Vector( 33, 65, -95 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 80, 65, -33 ), 0, new Vector( 100, 65, -33 ), new Vector( 95, 65, -33 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 80, 65, 33 ), 0, new Vector( 100, 65, 33 ), new Vector( 95, 65, 33 ) );
    let teamCyan = new BedwarsTeam( "cyan", new Vector( 33, 65, 80 ), 1, new Vector( 33, 65, 100 ), new Vector( 33, 65, 95 ) );
    let teamWhite = new BedwarsTeam( "white", new Vector( -33, 65, 80 ), 1, new Vector( -33, 65, 100 ), new Vector( -33, 65, 95 ) );
    let teamPink = new BedwarsTeam( "pink", new Vector( -80, 65, 33 ), 2, new Vector( -100, 65, 33 ), new Vector( -95, 65, 33 ) );
    let teamGray = new BedwarsTeam( "gray", new Vector( -80, 65, -33 ), 2, new Vector( -100, 65, -33 ), new Vector( -95, 65, -33 ) );

    /** 移除多余实体，进行初始化 */
    mapAmazon.init()
    
    /** 设置地图的队伍 */
    mapAmazon.addTeam( teamRed );
    mapAmazon.addTeam( teamBlue );
    mapAmazon.addTeam( teamGreen );
    mapAmazon.addTeam( teamYellow );
    mapAmazon.addTeam( teamCyan );
    mapAmazon.addTeam( teamWhite );
    mapAmazon.addTeam( teamPink );
    mapAmazon.addTeam( teamGray );

    /** 设置地图钻石和绿宝石生成点 */
    mapAmazon.addSpawner( "diamond", new Vector( 76, 63, 75 ) );
    mapAmazon.addSpawner( "diamond", new Vector( -75, 63, 76 ) );
    mapAmazon.addSpawner( "diamond", new Vector( 75, 63, -76 ) );
    mapAmazon.addSpawner( "diamond", new Vector( -76, 63, -75 ) );
    mapAmazon.addSpawner( "emerald", new Vector( 0, 80, 33 ) );
    mapAmazon.addSpawner( "emerald", new Vector( 0, 80, -33 ) );
    mapAmazon.addSpawner( "emerald", new Vector( 33, 80, 0 ) );
    mapAmazon.addSpawner( "emerald", new Vector( -33, 80, 0 ) );

    /** 设置地图商人 */
    mapAmazon.addTrader( new Vector( -26, 66, -96 ), 90, "blocks_and_items" ); mapAmazon.addTrader( new Vector( -26, 66, -95 ), 90, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( -39, 66, -95.5 ), 270, "team_upgrade" );
    mapAmazon.addTrader( new Vector( 39, 66, -96 ), 90, "blocks_and_items" ); mapAmazon.addTrader( new Vector( 39, 66, -95 ), 90, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( 26, 66, -95.5 ), 270, "team_upgrade" );
    mapAmazon.addTrader( new Vector( 96, 66, -26 ), 180, "blocks_and_items" ); mapAmazon.addTrader( new Vector( 95, 66, -26 ), 180, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( 95.5, 66, -39 ), 0, "team_upgrade" );
    mapAmazon.addTrader( new Vector( 96, 66, 39 ), 180, "blocks_and_items" ); mapAmazon.addTrader( new Vector( 95, 66, 39 ), 180, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( 95.5, 66, 26 ), 0, "team_upgrade" );
    mapAmazon.addTrader( new Vector( 26, 66, 96 ), 270, "blocks_and_items" ); mapAmazon.addTrader( new Vector( 26, 66, 95 ), 270, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( 39, 66, 95.5 ), 90, "team_upgrade" );
    mapAmazon.addTrader( new Vector( -39, 66, 96 ), 270, "blocks_and_items" ); mapAmazon.addTrader( new Vector( -39, 66, 95 ), 270, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( -26, 66, 95.5 ), 90, "team_upgrade" );
    mapAmazon.addTrader( new Vector( -96, 66, 26 ), 0, "blocks_and_items" ); mapAmazon.addTrader( new Vector( -95, 66, 26 ), 0, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( -95.5, 66, 39 ), 180, "team_upgrade" );
    mapAmazon.addTrader( new Vector( -96, 66, -39 ), 0, "blocks_and_items" ); mapAmazon.addTrader( new Vector( -95, 66, -39 ), 0, "weapon_and_armor" ); mapAmazon.addTrader( new Vector( -95.5, 66, -26 ), 180, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapAmazon;
    
}

/** 【8队】莲叶 */
function createMapDeadwood() {

    /** 队伍信息初始化 */
    let mapDeadwood = new BedwarsMap( "deadwood", "莲叶", { maxHeightLimit: 90, minHeightLimit: 55, distributeResource: true, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", new Vector( -30, 64, -82 ), 3, new Vector( -30, 66, -99 ), new Vector( -30, 66, -94 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 30, 64, -82 ), 3, new Vector( 30, 66, -99 ), new Vector( 30, 66, -94 ) );
    let teamGreen = new BedwarsTeam( "green", new Vector( 82, 64, -30 ), 0, new Vector( 99, 66, -30 ), new Vector( 94, 66, -30 ) );
    let teamYellow = new BedwarsTeam( "yellow", new Vector( 82, 64, 30 ), 0, new Vector( 99, 66, 30 ), new Vector( 94, 66, 30 ) );
    let teamCyan = new BedwarsTeam( "cyan", new Vector( 30, 64, 82 ), 1, new Vector( 30, 66, 99 ), new Vector( 30, 66, 94 ) );
    let teamWhite = new BedwarsTeam( "white", new Vector( -30, 64, 82 ), 1, new Vector( -30, 66, 99 ), new Vector( -30, 66, 94 ) );
    let teamPink = new BedwarsTeam( "pink", new Vector( -82, 64, 30 ), 2, new Vector( -99, 66, 30 ), new Vector( -94, 66, 30 ) );
    let teamGray = new BedwarsTeam( "gray", new Vector( -82, 64, -30 ), 2, new Vector( -99, 66, -30 ), new Vector( -94, 66, -30 ) );

    /** 移除多余实体，进行初始化 */
    mapDeadwood.init()
    
    /** 设置地图的队伍 */
    mapDeadwood.addTeam( teamRed );
    mapDeadwood.addTeam( teamBlue );
    mapDeadwood.addTeam( teamGreen );
    mapDeadwood.addTeam( teamYellow );
    mapDeadwood.addTeam( teamCyan );
    mapDeadwood.addTeam( teamWhite );
    mapDeadwood.addTeam( teamPink );
    mapDeadwood.addTeam( teamGray );

    /** 设置地图钻石和绿宝石生成点 */
    mapDeadwood.addSpawner( "diamond", new Vector( 55, 66, 55 ) );
    mapDeadwood.addSpawner( "diamond", new Vector( -55, 66, 55 ) );
    mapDeadwood.addSpawner( "diamond", new Vector( 55, 66, -55 ) );
    mapDeadwood.addSpawner( "diamond", new Vector( -55, 66, -55 ) );
    mapDeadwood.addSpawner( "emerald", new Vector( 18, 68, 18 ) );
    mapDeadwood.addSpawner( "emerald", new Vector( 18, 68, -18 ) );
    mapDeadwood.addSpawner( "emerald", new Vector( -18, 68, -18 ) );
    mapDeadwood.addSpawner( "emerald", new Vector( -18, 68, 18 ) );

    /** 设置地图商人 */
    mapDeadwood.addTrader( new Vector( -25, 66, -93 ), 90, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( -24, 67, -95 ), 90, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( -34, 66, -93 ), 270, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( 25, 66, -93 ), 270, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( 24, 67, -95 ), 270, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( 34, 66, -93 ), 90, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( 93, 66, -25 ), 180, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( 95, 67, -24 ), 180, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( 93, 66, -34 ), 0, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( 93, 66, 25 ), 0, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( 95, 67, 24 ), 0, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( 93, 66, 34 ), 180, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( 25, 66, 93 ), 270, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( 24, 67, 95 ), 270, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( 34, 66, 93 ), 90, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( -25, 66, 93 ), 90, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( -24, 67, 95 ), 90, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( -34, 66, 93 ), 270, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( -93, 66, 25 ), 0, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( -95, 67, 24 ), 0, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( -93, 66, 34 ), 180, "team_upgrade" );
    mapDeadwood.addTrader( new Vector( -93, 66, -25 ), 180, "blocks_and_items" ); mapDeadwood.addTrader( new Vector( -95, 67, -24 ), 180, "weapon_and_armor" ); mapDeadwood.addTrader( new Vector( -93, 66, -34 ), 0, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapDeadwood;
    
}

/** ===== 夺点模式 ===== */

/** 野餐（夺点） */
function createMapPicnicCapture( ) {

    /** 队伍信息初始化 */
    let mapPicnic = new BedwarsMap( "picnic_capture", "野餐", { maxHeightLimit: 90, distributeResource: false, mode: "capture" } );
    let teamRed = new BedwarsTeam( "red", new Vector( 0, 64, -63 ), 3, new Vector( 0, 63, -78 ), new Vector( 0, 63, -74 ) );
    let teamBlue = new BedwarsTeam( "blue", new Vector( 0, 64, 61 ), 1, new Vector( 0, 63, 77 ), new Vector( 0, 63, 73 ) );
    
    /** 移除多余实体，进行初始化 */
    mapPicnic.captureInfo.validBedPoints = [
        { x: 0, y: 64, z: -63 },
        { x: 0, y: 64, z: 61 },
        { x: 48, y: 64, z: 10 },
        { x: 0, y: 64, z: -1 },
        { x: -48, y: 64, z: -11 }
    ],
    teamRed.captureInfo.bedsPos.push( teamRed.bedInfo.pos );
    teamBlue.captureInfo.bedsPos.push( teamBlue.bedInfo.pos );
    mapPicnic.init()

    /** 设置地图的队伍 */
    mapPicnic.addTeam( teamRed ); 
    mapPicnic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapPicnic.addSpawner( "diamond", new Vector( -36, 65, -38 ) );
    mapPicnic.addSpawner( "diamond", new Vector( 36, 65, -33 ) );
    mapPicnic.addSpawner( "diamond", new Vector( 36, 65, 37 ) );
    mapPicnic.addSpawner( "diamond", new Vector( -36, 65, 32 ) );
    mapPicnic.addSpawner( "emerald", new Vector( -7, 69, -11 ) );
    mapPicnic.addSpawner( "emerald", new Vector( 8, 69, 12 ) );

    /** 设置地图商人 */
    mapPicnic.addTrader( new Vector( 6, 63, -76 ), 90, "blocks_and_items" );
    mapPicnic.addTrader( new Vector( -6, 63, 75 ), 270, "blocks_and_items" );
    mapPicnic.addTrader( new Vector( 6, 63, -75 ), 90, "weapon_and_armor_capture" );
    mapPicnic.addTrader( new Vector( -6, 63, 74 ), 270, "weapon_and_armor_capture" );
    mapPicnic.addTrader( new Vector( -6, 63, -75.5 ), 270, "team_upgrade" );
    mapPicnic.addTrader( new Vector( 6, 63, 74.5 ), 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapPicnic;
    
}
