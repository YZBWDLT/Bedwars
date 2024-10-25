/** 地图类，及地图相关信息 */

import { centerPosition, eachPlayer, eachTeam, eachValidPlayer, getPlayerAmount, initPlayer, playerIsValid, randomInt, removeItem, tickToSecond, BedwarsPlayer, spawnItem, showTitle } from "./methods"
import { world } from "@minecraft/server";
import { BedwarsTeam, validTeams } from "./team.js"
import { overworld } from "./constants.js";
import { settings } from "./settings.js";

/** 【固定数据】可用 2 队地图列表 */
export const validMapsFor2Teams = [ "cryptic", "frost", "garden", "ruins", "picnic", "lion_temple" ];

/** 【固定数据】可用 4 队地图列表 */
export const validMapsFor4Teams = [ "orchid", "chained", "boletum", "carapace", "archway" ];

/** 【固定数据】可用 8 队地图列表 */
export const validMapsFor8Teams = [ "glacier", "rooftop", "amazon" ];

/** 【函数】打乱一个数组
 * @param {Array} array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        /** 生成一个随机索引 j */ const j = Math.floor(Math.random() * (i + 1));
        /** 交换元素 array[i] 和 array[j] */ [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/** 【类】地图类，控制地图全局的运行方式 */
export class BedwarsMap{

    /** 【属性】地图 ID，它将控制地图的运行方式 */
    id = "";

    /** 【属性】地图的显示名称 */
    name = "";

    /** 【属性】地图的钻石点与绿宝石点信息、全地图中所有类型资源生成间隔的基准信息、资源生成方式信息 */
    spawnerInfo = {
        /** 平均每个铁的基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔*每次生成的铁锭数/(1+速度加成)） */ ironInterval: 6,
        /** 金基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔/(1+速度加成) */ goldInterval: 75,
        /** 钻石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ diamondInterval: 800,
        /** 绿宝石基准生成间隔，单位：游戏刻。实际生成间隔为（基准间隔-200*等级） */ emeraldInterval: 1500,
        /** 钻石点等级 */ diamondLevel: 1,
        /** 绿宝石点等级 */ emeraldLevel: 1,
        /** 钻石生成倒计时，单位：游戏刻 */ diamondCountdown: 600,
        /** 绿宝石生成倒计时 */ emeraldCountdown: 1300,
        /** 每次生成铁的数目 */ ironSpawnTimes: 5,
        /** 钻石点位置与生成次数信息 @type {{ pos: import("@minecraft/server").Vector3, spawned: Number }[]} */ diamondInfo: [],
        /** 绿宝石点位置与生成次数信息 @type {{ pos: import("@minecraft/server").Vector3, spawned: Number }[]} */ emeraldInfo: [],
        /** 是否在每次生成时，在3*3范围内分散式地生成资源 */ distributeResource: true,
        /** 是否清除生成资源的向量 */ clearResourceVelocity: true
    };

    /** 【属性】地图重生点，玩家死亡后将重生于此
     * @type {import("@minecraft/server").Vector3}
     */
    spawnpointPos = { x: 0, y: 100, z: 0 };

    /** 【属性】队伍数，在使用addTeam方法时，此数值将自加 */
    teamCount = 0;

    /** 【属性】全体队伍信息 @type {BedwarsTeam[]} */
    teamList = [];

    /** 【属性】游戏ID，只有ID与本局游戏相同的玩家允许进入游戏 */
    gameId = randomInt( 1000, 9999 )

    /** 【属性】游戏阶段，0：游戏前；1：游戏中；2：游戏结束
     * @type {0|1|2|3|4}
     */
    gameStage = 0;

    /** 【属性】游戏结束后，自动开启下一场游戏的倒计时，单位：游戏刻 */
    nextGameCountdown = 200;

    /** 【属性】游戏开始倒计时 */
    gameStartCountdown = settings.gameStartWaitingTime;

    /** 【属性】商人信息，包括位置、朝向、类型
     * @type {{ pos: import("@minecraft/server").Vector3, direction: Number, type: "blocks_and_items" | "weapon_and_armor" | "team_upgrade" }[]}
     */
    traderInfo = [];

    /** 【属性】玩家是否可以进入商店 */
    playerCouldIntoShop = true;

    /** 【属性】游戏事件，包括下一个事件的倒计时、下一个事件的ID、下一个事件的名称 */
    gameEvent = {
        /** 下一个事件的倒计时，单位：游戏刻 */ nextEventCountdown: 7200,
        /** 下一个事件的ID */ nextEventId: "diamond_tier_2",
        /** 下一个事件的名称 */ nextEventName: "钻石生成点 II 级"
    };

    /** 【属性】治愈池范围 */
    healPoolRadius = 20;

    /** 【属性】地图加载信息 */
    loadInfo = {
        /** 地图是否正在加载 */ isLoading: true,
        /** 清空地图时，正在清除的高度层 */ clearingLayer: 116,
        /** 清空地图时，间隔多长时间清除下一层，单位：游戏刻 */ clearTimePerLayer: 3,
        /** 加载结构所需的时间，单位：游戏刻 */ structureLoadTime: 100,
        /** 设置队伍岛屿颜色和床所需的时间，单位：游戏刻 */ setTeamIslandTime: 20
    };

    /** 【属性】高度限制信息 */
    heightLimit = {
        /** 最高高度限制 */ max: 110,
        /** 最低高度限制 */ min: 50
    };


    /** 【构建器】
     * @param {String} id 地图 ID
     * @param {String} name 地图名称
     * @param {{
     * ironInterval: Number,
     * goldInterval: Number,
     * diamondInterval: Number,
     * emeraldInterval: Number,
     * spawnpointPos: import("@minecraft/server").Vector3,
     * healPoolRadius: Number
     * maxHeightLimit: Number
     * minHeightLimit: Number
     * distributeResource: Boolean,
     * clearResourceVelocity: Boolean,
     * ironSpawnTimes: Number,
     * playerCouldIntoShop: Boolean
     * }} options 可选项
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
    };

    /** 【方法】进行地图初始化 */
    init( ) {
        /** 设置地图阶段 */ this.gameStage = 0;
        /** 移除玩家的bedwarsInfo，还原玩家名字颜色 */ eachPlayer( player => { initPlayer( player ) } )
        /** 设置为禁止 PVP */ world.gameRules.pvp = false;
        /** 移除多余实体 */ overworld.getEntities().filter( entity => { return entity.typeId !== "minecraft:player" } ).forEach( entity => { entity.remove() } )
        /** 移除多余记分板 */ world.scoreboard.getObjectives().forEach( objective => { if ( objective !== undefined ) { world.scoreboard.removeObjective( objective ) } } )
        /** 进行初始化命令函数 */ overworld.runCommand( `function lib/init/map` )
    }

    /** 【方法】在等待大厅时展示的记分板
     * @param {String} infoBoardProgress - 当前地图进度
     */
    waitingScoreboard( infoBoardProgress ) {

        /** 展示内容 */
        let infoBoardTitle = "§l§e     起床战争§r     ";
        let infoBoardMapName = `§f地图： §a${this.name}§r`;
        let infoBoardWaitingPlayer = `§f玩家： §a${getPlayerAmount()}/16§r`;
        let infoBoardTeamCount = `§f队伍数： §a${this.teamCount}§r`;
        let infoBoardMode = `§f模式： §a经典§r`;
        let infoBoardAuthor = `§e一只卑微的量筒§r`
        eachPlayer( player => { player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n§8${this.gameId}\n\n${infoBoardMapName}\n${infoBoardWaitingPlayer}\n\n${infoBoardProgress}\n\n${infoBoardTeamCount}\n${infoBoardMode}\n\n${infoBoardAuthor}` ) } )

    }

    /** 【方法】生成地图 */
    generateMap( ) {
        overworld.runCommand( `function maps/${this.id}/generate` )
        overworld.runCommand( `function lib/modify_data/set_border` )
    }

    /** 【方法】设置队伍岛的羊毛颜色与床 */
    teamIslandInit( ) {
        /** 羊毛颜色 */ overworld.runCommand( `function maps/${this.id}/team_island` )
        /** 放置床 */ eachTeam( team => { team.setBed() } )
    }

    /** 【方法】随机分配玩家的队伍 */
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
            for ( let i = 0; i < a; i++ ) { team.addPlayer( players[i] ) };
            players.splice( 0, a );
        } )
        if ( players.length !== 0 ) {
            players.forEach( player => {
                copiedTeamList[0].addPlayer( player ); copiedTeamList.splice( 0, 1 )
            } )
        }

    };

    /** 【方法】将本地图中可能需要用于检测的队伍加入到地图信息中
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

    /** 【方法】添加商人信息
     * @param {import("@minecraft/server").Vector3} pos - 新增的商人位置
     * @param {Number} direction - 商人的初始朝向，为 0 ~ 360
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"} type - 商人类型
     */
    addTrader( pos, direction, type ) {
        this.traderInfo.push( { pos: centerPosition( pos ), direction: direction, type: type } )
    }

    /** 【方法】添加资源点信息
     * @param {"diamond"|"emerald"} resourceType - 欲添加的资源点类型
     * @param {import("@minecraft/server").Vector3} pos - 资源点的位置
     */
    addSpawner( resourceType, pos ) {
        switch ( resourceType ) {
            case "diamond": this.spawnerInfo.diamondInfo.push( { pos: centerPosition( pos ), spawned: 0 } ); break;
            case "emerald": this.spawnerInfo.emeraldInfo.push( { pos: centerPosition( pos ), spawned: 0 } ); break;
            default: break;
        }
    };

    /** 【方法】在钻石点或绿宝石点位置生成资源
     * @param {"diamond"|"emerald"} resourceType - 生成的资源类型
     */
    spawnResources( resourceType ) {
        if ( resourceType === "diamond" ) {
            this.spawnerInfo.diamondInfo.forEach( spawner => {
                if ( spawner.spawned < settings.resourceMaxSpawnTimes.diamond ) {
                    spawnItem( spawner.pos, "bedwars:diamond" );
                    spawner.spawned++;
                }
            } );
        } else {
            this.spawnerInfo.emeraldInfo.forEach( spawner => {
                if ( spawner.spawned < settings.resourceMaxSpawnTimes.emerald ) {
                    spawnItem( spawner.pos, "bedwars:emerald" );
                    spawner.spawned++;
                }
            } );
        }
    };

    /** 【方法】移除特定位置资源点的生成次数，在玩家接近时使用
     * @param {import("@minecraft/server").Vector3} pos - 移除该位置对应的资源点的生成次数
     */
    resetSpawnerSpawnedTimes( pos ){
        this.spawnerInfo.diamondInfo.forEach( spawner => { if ( pos === spawner.pos ) { spawner.spawned = 0 } } )
        this.spawnerInfo.emeraldInfo.forEach( spawner => { if ( pos === spawner.pos ) { spawner.spawned = 0 } } )
    }

    /** 【方法】按照资源等级返回生成倒计时
     * @param {"diamond"|"emerald"} resourceType - 资源类型
     */
    getResourcesSpawnCountdown( resourceType ) {
        if ( resourceType === "diamond" ) { return 50 - 10 * this.spawnerInfo.diamondLevel; }
        else { return 60 - 10 * this.spawnerInfo.diamondLevel; }
    };

    /** 【方法】显示文本实体和动画实体，并更新并显示生成点数据 */
    showTextAndAnimation( ) {

        /** 设置文本的内容, @param {1|2|3} spawnerLevel */
        let levelText = ( spawnerLevel ) => {
            if ( spawnerLevel === 1 ) { return "I" }
            else if ( spawnerLevel === 2 ) { return "II" }
            else { return "III" }
        };

        /** 更新动画和文本内容,
         * @param {{ pos: import("@minecraft/server").Vector3; spawned: number }[]} resourceInfo - 资源点信息
         * @param {"bedwars:diamond_spawner"|"bedwars:emerald_spawner"} animationEntityId - 旋转实体的ID
         * @param {String} text1 - 第一行
         * @param {String} text2 - 第二行
         * @param {String} text3 - 第三行
         */
        let updateTextAndAnimation = ( resourceInfo, animationEntityId, text1, text2, text3 ) => {

            resourceInfo.forEach( spawner => {

                /** 旋转动画实体和文本实体的位置 */
                let animationEntityPos = { x: spawner.pos.x, y: spawner.pos.y - 1, z: spawner.pos.z };
                let textLine1Pos = { x: spawner.pos.x, y: spawner.pos.y + 3.5, z: spawner.pos.z };
                let textLine2Pos = { x: spawner.pos.x, y: spawner.pos.y + 3.0, z: spawner.pos.z };
                let textLine3Pos = { x: spawner.pos.x, y: spawner.pos.y + 2.5, z: spawner.pos.z };

                /** 获取各个钻石点的位置的旋转动画实体和文本实体 */
                let animationEntity = overworld.getEntities( { type: animationEntityId, location: animationEntityPos, maxDistance: 0.5 } )[0];
                let textLine1 = overworld.getEntities( { type: "bedwars:text_display", location: textLine1Pos, maxDistance: 0.5 } )[0];
                let textLine2 = overworld.getEntities( { type: "bedwars:text_display", location: textLine2Pos, maxDistance: 0.5 } )[0];
                let textLine3 = overworld.getEntities( { type: "bedwars:text_display", location: textLine3Pos, maxDistance: 0.5 } )[0];

                /** 判断钻石点的位置是否有动画实体和文本实体，如果没有则生成 */
                if ( animationEntity === undefined ) { animationEntity = overworld.spawnEntity( animationEntityId, animationEntityPos ) };
                if ( textLine1 === undefined ) { textLine1 = overworld.spawnEntity( "bedwars:text_display", textLine1Pos ) };
                if ( textLine2 === undefined ) { textLine2 = overworld.spawnEntity( "bedwars:text_display", textLine2Pos ) };
                if ( textLine3 === undefined ) { textLine3 = overworld.spawnEntity( "bedwars:text_display", textLine3Pos ) };

                /** 更新文本 */
                textLine1.nameTag = text1;
                textLine2.nameTag = text2;
                textLine3.nameTag = text3;
    
            } )

        }

        updateTextAndAnimation( this.spawnerInfo.diamondInfo, "bedwars:diamond_spawner", `§e等级 §c${levelText(this.spawnerInfo.diamondLevel)}`, `§b§l钻石`, `§e在 §c${tickToSecond(this.spawnerInfo.diamondCountdown)} §e秒后产出` )
        updateTextAndAnimation( this.spawnerInfo.emeraldInfo, "bedwars:emerald_spawner", `§e等级 §c${levelText(this.spawnerInfo.emeraldLevel)}`, `§2§l绿宝石`, `§e在 §c${tickToSecond(this.spawnerInfo.emeraldCountdown)} §e秒后产出` )

    }

    /** 【方法】生成商人 */
    setTrader() {

        this.traderInfo.forEach( traderInfo => {

            /** 设置新的商人的位置和朝向 */
            let trader = overworld.spawnEntity( "bedwars:trader", traderInfo.pos );
            trader.setRotation( { x: 0, y: traderInfo.direction } )

            /** 设置商人的类型和皮肤 */
            trader.triggerEvent( `${traderInfo.type}_trader` );
            trader.triggerEvent( `assign_skin_randomly` );
    
            /** 设置商人的名字 <lang> */
            if ( traderInfo.type === "blocks_and_items" ) { trader.nameTag = `§a方块与物品`; }
            else if ( traderInfo.type === "weapon_and_armor" ) { trader.nameTag = `§c武器与盔甲`; }
            else { trader.nameTag = `§b团队升级`; }

        } )

    }

    /** 【方法】获取下一个游戏事件的名称 */
    getEventName( ) {
        switch ( this.gameEvent.nextEventId ) {
            case "diamond_tier_2": this.gameEvent.nextEventName = "钻石生成点 II 级"; return this.gameEvent.nextEventName;
            case "emerald_tier_2": this.gameEvent.nextEventName = "绿宝石生成点 II 级"; return this.gameEvent.nextEventName;
            case "diamond_tier_3": this.gameEvent.nextEventName = "钻石生成点 III 级"; return this.gameEvent.nextEventName;
            case "emerald_tier_3": this.gameEvent.nextEventName = "绿宝石生成点 III 级"; return this.gameEvent.nextEventName;
            case "bed_destruction": this.gameEvent.nextEventName = "床自毁"; return this.gameEvent.nextEventName;
            case "death_match": this.gameEvent.nextEventName = "绝杀模式"; return this.gameEvent.nextEventName;
            case "game_end": default: this.gameEvent.nextEventName = "游戏结束"; return this.gameEvent.nextEventName;
        }
    }

    /** 【方法】触发游戏事件 */
    triggerEvent( ) {
        switch ( this.gameEvent.nextEventId ) {
            case "diamond_tier_2":
                world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier2" } )
                this.spawnerInfo.diamondLevel = 2;
                this.gameEvent.nextEventId = "emerald_tier_2";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "emerald_tier_2":
                world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier2" } )
                this.spawnerInfo.emeraldLevel = 2;
                this.gameEvent.nextEventId = "diamond_tier_3";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "diamond_tier_3":
                world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier3" } )
                this.spawnerInfo.diamondLevel = 3;
                this.gameEvent.nextEventId = "emerald_tier_3";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "emerald_tier_3":
                world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier3" } )
                this.spawnerInfo.emeraldLevel = 3;
                this.gameEvent.nextEventId = "bed_destruction";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "bed_destruction":

                /** 破坏所有队伍的床 */
                eachTeam( team => {
                    team.bedInfo.isExist = false;
                    overworld.runCommand( `setblock ${team.bedInfo.pos.x} ${team.bedInfo.pos.y} ${team.bedInfo.pos.z} air destroy` )
                    removeItem( "minecraft:bed" )
                } );
                eachPlayer( player => {
                    player.playSound( "mob.wither.death", { location: player.location } );
                    showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed.allTeams" } )
                    player.sendMessage( { translate: "message.bedDestroyed.allTeams" } )
                } );

                this.gameEvent.nextEventId = "death_match";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "death_match":

                /** 生成末影龙 */
                eachTeam( team => { if ( team.isEliminated === false ) {
                    overworld.spawnEntity( "minecraft:ender_dragon", this.spawnpointPos );
                    if ( team.teamUpgrade.dragonBuff === true ) { overworld.spawnEntity( "minecraft:ender_dragon", this.spawnpointPos ) }
                } } )
                eachPlayer( player => {
                    showTitle( player, { translate: "title.deathMatch" } )
                } )

                /** 在 0 60 0 生成一个基岩，以防止末影龙抽风 */
                overworld.runCommand( `setblock 0 60 0 bedrock` )
                this.gameEvent.nextEventId = "game_end";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "game_end":
                this.gameOver( undefined )
                break;
        }
    }

    /** 【方法】游戏结束事件
     * @param {BedwarsTeam|undefined} winningTeam - 获胜队伍，如若为undefined则为平局结束
     */
    gameOver( winningTeam ) {

        /** 设置游戏结束 */
        this.gameStage = 2; this.nextGameCountdown = 200;

        /** 判断何队获胜 */
        if ( winningTeam === undefined ) {
            eachPlayer( player => {
                showTitle( player, { translate: "title.gameOver" } )
                player.sendMessage( { translate: "message.gameOver.endInATie" } )
            } )
            overworld.getEntities( { type: "minecraft:ender_dragon" } ).forEach( dragon => { dragon.kill() } )
        } else {
            eachValidPlayer( player => {

                /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo

                /** 分别为获胜队伍和未获胜队伍展示标题 */
                if ( playerInfo.team === winningTeam.id ) { showTitle( player, { translate: "title.victory" } ) }
                else { showTitle( player, { translate: "title.gameOver" } ) }

            } )

            let getWinningPlayers = () => {
                let winnersName = [];
                winningTeam.getTeamMember().forEach( winner => { winnersName.push( winner.name ) } );
                return winnersName.join( ", " )
            }

            let killCountRank = () => {
                let players = world.getPlayers().filter( player => { return playerIsValid( player ) && player.bedwarsInfo.team !== undefined } );
                /** @type { { name: String, totalKillCount: Number }[] } */ let rank = []; players.forEach( player => { rank.push( { name: player.name, totalKillCount: player.bedwarsInfo.killCount.kill + player.bedwarsInfo.killCount.finalKill } ) } );
                rank.sort( ( a, b ) => b.totalKillCount - a.totalKillCount );
                let theFirst = `§e§l击杀数第一名§r§7 - ${rank[0].name} - ${rank[0].totalKillCount}`;
                let theSecond = ``; if ( rank[1] !== undefined ) { theSecond = `§6§l击杀数第二名§r§7 - ${rank[1].name} - ${rank[1].totalKillCount}` }
                let theThird = ``; if ( rank[2] !== undefined ) { theThird = `§c§l击杀数第三名§r§7 - ${rank[2].name} - ${rank[2].totalKillCount}` }
                return [ theFirst, theSecond, theThird ]
            }

            /** 通报获胜队伍 <lang> */
            world.sendMessage( [ { translate: "message.greenLine" }, "\n§l§f      起床战争§r      ", "\n", `\n${winningTeam.getTeamName( "name" )}队§7 - ${getWinningPlayers()}`, "\n\n", killCountRank().join( "\n" ), "\n", { translate: "message.greenLine" } ] )

            /** 初始化下一局的计时器 */
            this.nextGameCountdown = 200;
            
        }


    }

    /** 【方法】游戏开始事件 */
    gameStart( ) {
        /** 开始游戏 */
        this.gameStage = 1;

        /** 分配玩家队伍 */
        this.assignPlayersRandomly()

        /** 设置商人 */
        this.setTrader()

        /** 设置为可PVP */
        world.gameRules.pvp = true;

        eachValidPlayer( player => {
            /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo

            /** 将玩家传送到队伍中 */
            playerInfo.teleportPlayerToSpawnpoint()

            /** 调整玩家的游戏模式 */
            player.getGameMode() !== "creative" ? player.setGameMode( "survival" ) : null;

            /** 播报消息 */
            player.sendMessage( [ { translate: "message.greenLine" }, "\n", { translate: "message.gameStartTitle" }, "\n\n", { translate: "message.gameStartIntroduction" }, "\n\n", { translate: "message.greenLine" } ] )
        } )

        /** 如果一个队伍没有分配到人，则设置为无效的队伍 */
        eachTeam( team => { if ( team.getTeamMember().length === 0 ) { team.setTeamInvalid() } } )

        /** 移除等待大厅 */
        overworld.runCommand( `fill -12 117 -12 12 127 12 air` )


    }

    /** 【方法】为地图新增旁观者（team = undefined）
     * @param {Player} player 
     */
    addSpectator( player ) {
        let playerInfo = new BedwarsPlayer( player.name, undefined );
        playerInfo.isSpectator = true;
        playerInfo.deathState.isDeath = true;
        playerInfo.deathState.respawnCountdown = -1;
        player.bedwarsInfo = playerInfo
        player.triggerEvent( `remove_team` )
        player.nameTag = player.name;
    }

    /** 【方法】获取未被淘汰的队伍 */
    getAliveTeam( ) {
        return this.teamList.filter( team => team.isEliminated === false )
    }

    /** 【方法】获取地图是否为solo模式 */
    isSolo( ) {
        return this.teamCount > 4
    }

}

/** 【函数】重新生成地图
 * @param {String} mapId - 如果提供了此参数，则将生成这张固定的地图
 */
export function regenerateMap( mapId = undefined ) {
    let mapList = [];
    if (settings.randomMap.allow2Teams) { mapList = mapList.concat(validMapsFor2Teams); };
    if (settings.randomMap.allow4Teams) { mapList = mapList.concat(validMapsFor4Teams); };
    if (settings.randomMap.allow8Teams) { mapList = mapList.concat(validMapsFor8Teams); };
    let randomMap = mapList[ Math.floor( Math.random() * mapList.length ) ];
    if ( mapList.includes( mapId ) ) { randomMap = mapId };
    switch ( randomMap ) {

        case "orchid": createMapOrchid(); break;
        case "chained": createMapChained(); break;
        case "boletum": createMapBoletum(); break;
        case "carapace": createMapCarapace(); break;
        case "archway": createMapArchway(); break;

        case "cryptic": createMapCryptic(); break;
        case "frost": createMapFrost(); break;
        case "garden": createMapGarden(); break;
        case "ruins": createMapRuins(); break;
        case "picnic": createMapPicnic(); break;
        case "lion_temple": createMapLionTemple(); break;

        case "glacier": createMapGlacier(); break;
        case "rooftop": createMapRooftop(); break;
        case "amazon": createMapAmazon(); break;
    }
}

/** 【可变数据】地图信息 @return {BedwarsMap} */
export let map = () => { return world.bedwarsMap };

/** ===== 4队地图 ===== */

/** 【4队】兰花 */
function createMapOrchid( ) {

    /** 队伍信息初始化 */
    let mapOrchid = new BedwarsMap( "orchid", "兰花", { maxHeightLimit: 95, healPoolRadius: 21, playerCouldIntoShop: false } );
    let teamRed = new BedwarsTeam( "red", { x: 41, y: 71, z: -50 }, 0, { x: 62, y: 71, z: -50 }, { x: 58, y: 71, z: -49 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 41, y: 71, z: 50 }, 0, { x: 62, y: 71, z: 50 }, { x: 58, y: 71, z: 49 } );
    let teamGreen = new BedwarsTeam( "green", { x: -41, y: 71, z: 50 }, 2, { x: -62, y: 71, z: 50 }, { x: -58, y: 71, z: 49 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -41, y: 71, z: -50 }, 2, { x: -62, y: 71, z: -50 }, { x: -58, y: 71, z: -49 } );

    /** 移除多余实体，进行初始化 */
    mapOrchid.init()

    /** 设置地图的队伍 */
    mapOrchid.addTeam( teamRed ); 
    mapOrchid.addTeam( teamBlue ); 
    mapOrchid.addTeam( teamGreen ); 
    mapOrchid.addTeam( teamYellow );

    /** 设置地图钻石和绿宝石生成点 */
    mapOrchid.addSpawner( "diamond", { x: 0, y: 72, z: -76 } );
    mapOrchid.addSpawner( "diamond", { x: 56, y: 72, z: 0 } );
    mapOrchid.addSpawner( "diamond", { x: 0, y: 72, z: 76 } );
    mapOrchid.addSpawner( "diamond", { x: -56, y: 72, z: 0 } );
    mapOrchid.addSpawner( "emerald", { x: 0, y: 72, z: -8 } );
    mapOrchid.addSpawner( "emerald", { x: 0, y: 72, z: 8 } );

    /** 设置地图商人 */
    mapOrchid.addTrader( { x: 59, y: 71, z: -45 }, 180, "blocks_and_items" );
    mapOrchid.addTrader( { x: 57, y: 71, z: 45 }, 0, "blocks_and_items" );
    mapOrchid.addTrader( { x: -59, y: 71, z: 45 }, 0, "blocks_and_items" );
    mapOrchid.addTrader( { x: -57, y: 71, z: -45 }, 180, "blocks_and_items" );
    mapOrchid.addTrader( { x: 57, y: 71, z: -45 }, 180, "weapon_and_armor" );
    mapOrchid.addTrader( { x: 59, y: 71, z: 45 }, 0, "weapon_and_armor" );
    mapOrchid.addTrader( { x: -57, y: 71, z: 45 }, 0, "weapon_and_armor" );
    mapOrchid.addTrader( { x: -59, y: 71, z: -45 }, 180, "weapon_and_armor" );
    mapOrchid.addTrader( { x: 55, y: 71, z: -54 }, 270, "team_upgrade" );
    mapOrchid.addTrader( { x: 55, y: 71, z: 54 }, 270, "team_upgrade" );
    mapOrchid.addTrader( { x: -55, y: 71, z: 54 }, 90, "team_upgrade" );
    mapOrchid.addTrader( { x: -55, y: 71, z: -54 }, 90, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapOrchid;

}

/** 【4队】铁索连环 */
function createMapChained( ) {

    /** 队伍信息初始化 */
    let mapChained = new BedwarsMap( "chained", "铁索连环", { maxHeightLimit: 90 } );
    let teamRed = new BedwarsTeam( "red", { x: 69, y: 65, z: 0 }, 0, { x: 86, y: 64, z: 0 }, { x: 81, y: 64, z: 0 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 65, z: 69 }, 1, { x: 0, y: 64, z: 86 }, { x: 0, y: 64, z: 81 } );
    let teamGreen = new BedwarsTeam( "green", { x: -69, y: 65, z: 0 }, 2, { x: -86, y: 64, z: 0 }, { x: -81, y: 64, z: 0 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 0, y: 65, z: -69 }, 3, { x: 0, y: 64, z: -86 }, { x: 0, y: 64, z: -81 } );
    
    /** 移除多余实体，进行初始化 */
    mapChained.init()
    
    /** 设置地图的队伍 */
    mapChained.addTeam( teamRed ); 
    mapChained.addTeam( teamBlue ); 
    mapChained.addTeam( teamGreen ); 
    mapChained.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapChained.addSpawner( "diamond", { x: 36, y: 67, z: 34 } );
    mapChained.addSpawner( "diamond", { x: -34, y: 67, z: 36 } );
    mapChained.addSpawner( "diamond", { x: -36, y: 67, z: -34 } );
    mapChained.addSpawner( "diamond", { x: 34, y: 67, z: -36 } );
    mapChained.addSpawner( "emerald", { x: -11, y: 67, z: 0 } );
    mapChained.addSpawner( "emerald", { x: 11, y: 67, z: 0 } );
    
    /** 设置地图商人 */
    mapChained.addTrader( { x: 84, y: 64, z: 8 }, 180, "blocks_and_items" );
    mapChained.addTrader( { x: -8, y: 64, z: 84 }, 270, "blocks_and_items" );
    mapChained.addTrader( { x: -84, y: 64, z: -8 }, 0, "blocks_and_items" );
    mapChained.addTrader( { x: 8, y: 64, z: -84 }, 90, "blocks_and_items" );
    mapChained.addTrader( { x: 82, y: 64, z: 8 }, 180, "weapon_and_armor" );
    mapChained.addTrader( { x: -8, y: 64, z: 82 }, 270, "weapon_and_armor" );
    mapChained.addTrader( { x: -82, y: 64, z: -8 }, 0, "weapon_and_armor" );
    mapChained.addTrader( { x: 8, y: 64, z: -82 }, 90, "weapon_and_armor" );
    mapChained.addTrader( { x: 83, y: 64, z: -8 }, 0, "team_upgrade" );
    mapChained.addTrader( { x: 8, y: 64, z: 83 }, 90, "team_upgrade" );
    mapChained.addTrader( { x: -83, y: 64, z: 8 }, 180, "team_upgrade" );
    mapChained.addTrader( { x: -8, y: 64, z: -83 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapChained;
    
}

/** 【4队】蘑菇岛 */
function createMapBoletum( ) {

    /** 队伍信息初始化 */
    let mapBoletum = new BedwarsMap( "boletum", "蘑菇岛", { maxHeightLimit: 94 } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 69, z: 66 }, 1, { x: 0, y: 68, z: 82 }, { x: 0, y: 68, z: 78 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -68, y: 69, z: 0 }, 2, { x: -84, y: 68, z: 0 }, { x: -80, y: 68, z: 0 } );
    let teamGreen = new BedwarsTeam( "green", { x: -2, y: 69, z: -68 }, 3, { x: -2, y: 68, z: -84 }, { x: -2, y: 68, z: -80 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 66, y: 69, z: -2 }, 0, { x: 82, y: 68, z: -2 }, { x: 78, y: 68, z: -2 } );
    
    /** 移除多余实体，进行初始化 */
    mapBoletum.init()
    
    /** 设置地图的队伍 */
    mapBoletum.addTeam( teamRed ); 
    mapBoletum.addTeam( teamBlue ); 
    mapBoletum.addTeam( teamGreen ); 
    mapBoletum.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapBoletum.addSpawner( "diamond", { x: 43, y: 70, z: -43 } );
    mapBoletum.addSpawner( "diamond", { x: 43, y: 70, z: 43 } );
    mapBoletum.addSpawner( "diamond", { x: -43, y: 70, z: 43 } );
    mapBoletum.addSpawner( "diamond", { x: -43, y: 70, z: -43 } );
    mapBoletum.addSpawner( "emerald", { x: -11, y: 74, z: -12 } );
    mapBoletum.addSpawner( "emerald", { x: 9, y: 74, z: 12 } );
    
    /** 设置地图商人 */
    mapBoletum.addTrader( { x: -5, y: 68, z: 80 }, 180, "blocks_and_items" );
    mapBoletum.addTrader( { x: -82, y: 68, z: -5 }, 270, "blocks_and_items" );
    mapBoletum.addTrader( { x: 3, y: 68, z: -82 }, 0, "blocks_and_items" );
    mapBoletum.addTrader( { x: 80, y: 68, z: 3 }, 90, "blocks_and_items" );
    mapBoletum.addTrader( { x: -5, y: 68, z: 79 }, 180, "weapon_and_armor" );
    mapBoletum.addTrader( { x: -81, y: 68, z: -5 }, 270, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 3, y: 68, z: -81 }, 0, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 79, y: 68, z: 3 }, 90, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 6, y: 68, z: 80.5 }, 0, "team_upgrade" );
    mapBoletum.addTrader( { x: -81.5, y: 68, z: 6 }, 90, "team_upgrade" );
    mapBoletum.addTrader( { x: -8, y: 68, z: -81.5 }, 180, "team_upgrade" );
    mapBoletum.addTrader( { x: 80.5 , y: 68, z: -8 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapBoletum;
    
}

/** 【4队】甲壳 */
function createMapCarapace( ) {

    /** 队伍信息初始化 */
    let mapCarapace = new BedwarsMap( "carapace", "甲壳", { maxHeightLimit: 91, distributeResource: false, clearResourceVelocity: false, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 66, z: -48 }, 3, { x: 0, y: 66, z: -64 }, { x: 0, y: 66, z: -58 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 48, y: 66, z: 0 }, 0, { x: 64, y: 66, z: 0 }, { x: 58, y: 66, z: 0 } );
    let teamGreen = new BedwarsTeam( "green", { x: 0, y: 66, z: 48 }, 1, { x: 0, y: 66, z: 64 }, { x: 0, y: 66, z: 58 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -48, y: 66, z: 0 }, 2, { x: -64, y: 66, z: 0 }, { x: -58, y: 66, z: 0 } );
    
    /** 移除多余实体，进行初始化 */
    mapCarapace.init()
    
    /** 设置地图的队伍 */
    mapCarapace.addTeam( teamRed ); 
    mapCarapace.addTeam( teamBlue ); 
    mapCarapace.addTeam( teamGreen ); 
    mapCarapace.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCarapace.addSpawner( "diamond", { x: 31, y: 67, z: -30 } );
    mapCarapace.addSpawner( "diamond", { x: 30, y: 67, z: 31 } );
    mapCarapace.addSpawner( "diamond", { x: -31, y: 67, z: 30 } );
    mapCarapace.addSpawner( "diamond", { x: -30, y: 67, z: -31 } );
    mapCarapace.addSpawner( "emerald", { x: 0, y: 67, z: 0 } );
    mapCarapace.addSpawner( "emerald", { x: 0, y: 75, z: 0 } );
    
    /** 设置地图商人 */
    mapCarapace.addTrader( { x: 5, y: 66, z: -59 }, 180, "blocks_and_items" );
    mapCarapace.addTrader( { x: 59, y: 66, z: 5 }, 270, "blocks_and_items" );
    mapCarapace.addTrader( { x: -5, y: 66, z: 59 }, 0, "blocks_and_items" );
    mapCarapace.addTrader( { x: -59, y: 66, z: -5 }, 90, "blocks_and_items" );
    mapCarapace.addTrader( { x: 5, y: 66, z: -57 }, 180, "weapon_and_armor" );
    mapCarapace.addTrader( { x: 57, y: 66, z: 5 }, 270, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -5, y: 66, z: 57 }, 0, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -57, y: 66, z: -5 }, 90, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -5, y: 66, z: -58 }, 0, "team_upgrade" );
    mapCarapace.addTrader( { x: 58, y: 66, z: -5 }, 90, "team_upgrade" );
    mapCarapace.addTrader( { x: 5, y: 66, z: 58 }, 180, "team_upgrade" );
    mapCarapace.addTrader( { x: -58, y: 66, z: 5 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCarapace;
    
}

/** 【4队】拱形廊道 */
function createMapArchway( ) {
    /** 队伍信息初始化 */
    let mapArchway = new BedwarsMap( "archway", "拱形廊道", { maxHeightLimit: 91, healPoolRadius: 15, distributeResource: false, ironInterval: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: -15, y: 66, z: -66 }, 3, { x: -14, y: 65, z: -79 }, { x: -14, y: 65, z: -75 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 66, y: 66, z: -15 }, 0, { x: 79, y: 65, z: -14 }, { x: 75, y: 65, z: -14 } );
    let teamGreen = new BedwarsTeam( "green", { x: 15, y: 66, z: 66 }, 1, { x: 14, y: 65, z: 79 }, { x: 14, y: 65, z: 75 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -66, y: 66, z: 15 }, 2, { x: -79, y: 65, z: 14 }, { x: -75, y: 65, z: 14 } );
    
    /** 移除多余实体，进行初始化 */
    mapArchway.init()
    
    /** 设置地图的队伍 */
    mapArchway.addTeam( teamRed ); 
    mapArchway.addTeam( teamBlue ); 
    mapArchway.addTeam( teamGreen ); 
    mapArchway.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapArchway.addSpawner( "diamond", { x: 34, y: 67, z: -49 } );
    mapArchway.addSpawner( "diamond", { x: 49, y: 67, z: 34 } );
    mapArchway.addSpawner( "diamond", { x: -34, y: 67, z: 49 } );
    mapArchway.addSpawner( "diamond", { x: -49, y: 67, z: -34 } );
    mapArchway.addSpawner( "emerald", { x: 0, y: 66, z: 0 } );
    mapArchway.addSpawner( "emerald", { x: 0, y: 76, z: 0 } );
    
    /** 设置地图商人 */
    mapArchway.addTrader( { x: -9, y: 65, z: -76 }, 90, "blocks_and_items" );
    mapArchway.addTrader( { x: 76, y: 65, z: -9 }, 180, "blocks_and_items" );
    mapArchway.addTrader( { x: 9, y: 65, z: 76 }, 270, "blocks_and_items" );
    mapArchway.addTrader( { x: -76, y: 65, z: 9 }, 90, "blocks_and_items" );
    mapArchway.addTrader( { x: -9, y: 65, z: -75 }, 90, "weapon_and_armor" );
    mapArchway.addTrader( { x: 75, y: 65, z: -9 }, 180, "weapon_and_armor" );
    mapArchway.addTrader( { x: 9, y: 65, z: 75 }, 270, "weapon_and_armor" );
    mapArchway.addTrader( { x: -75, y: 65, z: 9 }, 90, "weapon_and_armor" );
    mapArchway.addTrader( { x: -19, y: 65, z: -75.5 }, 270, "team_upgrade" );
    mapArchway.addTrader( { x: 75.5, y: 65, z: -19 }, 90, "team_upgrade" );
    mapArchway.addTrader( { x: 19, y: 65, z: 75.5 }, 90, "team_upgrade" );
    mapArchway.addTrader( { x: -75.5, y: 65, z: 19 }, 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapArchway;

}

/** ===== 2队地图 ===== */

/** 【2队】神秘 */
function createMapCryptic( ) {

    /** 队伍信息初始化 */
    let mapCryptic = new BedwarsMap( "cryptic", "神秘", { maxHeightLimit: 102, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: 2, y: 77, z: 73 }, 1, { x: 2, y: 78, z: 90 }, { x: 2, y: 78, z: 85 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 2, y: 77, z: -73 }, 3, { x: 2, y: 78, z: -90 }, { x: 2, y: 78, z: -85 } );
    
    /** 移除多余实体，进行初始化 */
    mapCryptic.init()
    
    /** 设置地图的队伍 */
    mapCryptic.addTeam( teamRed ); 
    mapCryptic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCryptic.addSpawner( "diamond", { x: -70, y: 80, z: 0 } );
    mapCryptic.addSpawner( "diamond", { x: 70, y: 75, z: 0 } );
    mapCryptic.addSpawner( "emerald", { x: 21, y: 70, z: 0 } );
    mapCryptic.addSpawner( "emerald", { x: -25, y: 83, z: 0 } );
    
    /** 设置地图商人 */
    mapCryptic.addTrader( { x: -2, y: 78, z: 87 }, 270, "blocks_and_items" );
    mapCryptic.addTrader( { x: 6, y: 78, z: -87 }, 90, "blocks_and_items" );
    mapCryptic.addTrader( { x: -2, y: 78, z: 85 }, 270, "weapon_and_armor" );
    mapCryptic.addTrader( { x: 6, y: 78, z: -85 }, 90, "weapon_and_armor" );
    mapCryptic.addTrader( { x: 6, y: 78, z: 86 }, 90, "team_upgrade" );
    mapCryptic.addTrader( { x: -3, y: 78, z: -86 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCryptic;
    
}

/** 【2队】极寒 */
function createMapFrost( ) {

    /** 队伍信息初始化 */
    let mapFrost = new BedwarsMap( "frost", "极寒", { maxHeightLimit: 97 } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 72, z: 59 }, 1, { x: 0, y: 72, z: 75 }, { x: 0, y: 72, z: 70 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 72, z: -59 }, 3, { x: 0, y: 72, z: -75 }, { x: 0, y: 72, z: -70 } );
    
    /** 移除多余实体，进行初始化 */
    mapFrost.init()
    
    /** 设置地图的队伍 */
    mapFrost.addTeam( teamRed ); 
    mapFrost.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapFrost.addSpawner( "diamond", { x: 38, y: 77, z: -10 } );
    mapFrost.addSpawner( "diamond", { x: -38, y: 77, z: 10 } );
    mapFrost.addSpawner( "emerald", { x: 0, y: 78, z: -12 } );
    mapFrost.addSpawner( "emerald", { x: 0, y: 78, z: 12 } );
    
    /** 设置地图商人 */
    mapFrost.addTrader( { x: -6, y: 72, z: 72 }, 270, "blocks_and_items" );
    mapFrost.addTrader( { x: 6, y: 72, z: -72 }, 90, "blocks_and_items" );
    mapFrost.addTrader( { x: -6, y: 72, z: 70 }, 270, "weapon_and_armor" );
    mapFrost.addTrader( { x: 6, y: 72, z: -70 }, 90, "weapon_and_armor" );
    mapFrost.addTrader( { x: 6, y: 72, z: 71 }, 90, "team_upgrade" );
    mapFrost.addTrader( { x: -6, y: 72, z: -71 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapFrost;
    
}

/** 【2队】花园 */
function createMapGarden( ) {

    /** 队伍信息初始化 */
    let mapGarden = new BedwarsMap( "garden", "花园", { maxHeightLimit: 97 } );
    let teamRed = new BedwarsTeam( "red", { x: 79, y: 77, z: 0 }, 0, { x: 98, y: 79, z: 0 }, { x: 94, y: 79, z: 0 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -79, y: 77, z: 0 }, 2, { x: -98, y: 79, z: 0 }, { x: -94, y: 79, z: 0 } );
    
    /** 移除多余实体，进行初始化 */
    mapGarden.init()
    
    /** 设置地图的队伍 */
    mapGarden.addTeam( teamRed ); 
    mapGarden.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapGarden.addSpawner( "diamond", { x: 0, y: 79, z: -52 } );
    mapGarden.addSpawner( "diamond", { x: 0, y: 79, z: 52 } );
    mapGarden.addSpawner( "emerald", { x: -21, y: 78, z: -21 } );
    mapGarden.addSpawner( "emerald", { x: 21, y: 78, z: 21 } );
    
    /** 设置地图商人 */
    mapGarden.addTrader( { x: 95, y: 79, z: 8 }, 180, "blocks_and_items" );
    mapGarden.addTrader( { x: -95, y: 79, z: -8 }, 0, "blocks_and_items" );
    mapGarden.addTrader( { x: 93, y: 79, z: 8 }, 180, "weapon_and_armor" );
    mapGarden.addTrader( { x: -93, y: 79, z: -8 }, 0, "weapon_and_armor" );
    mapGarden.addTrader( { x: 94, y: 79, z: -8 }, 0, "team_upgrade" );
    mapGarden.addTrader( { x: -94, y: 79, z: 8 }, 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapGarden;
    
}

/** 【2队】废墟 */
function createMapRuins( ) {

    /** 队伍信息初始化 */
    let mapRuins = new BedwarsMap( "ruins", "废墟", { maxHeightLimit: 96 } );
    let teamRed = new BedwarsTeam( "red", { x: -4, y: 71, z: -64 }, 3, { x: 0, y: 72, z: -82 }, { x: 0, y: 72, z: -78 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 4, y: 71, z: 64 }, 1, { x: 0, y: 72, z: 82 }, { x: 0, y: 72, z: 78 } );
    
    /** 移除多余实体，进行初始化 */
    mapRuins.init()
    
    /** 设置地图的队伍 */
    mapRuins.addTeam( teamRed ); 
    mapRuins.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapRuins.addSpawner( "diamond", { x: -47, y: 71, z: -10 } );
    mapRuins.addSpawner( "diamond", { x: 47, y: 71, z: 10 } );
    mapRuins.addSpawner( "emerald", { x: 17, y: 71, z: -6 } );
    mapRuins.addSpawner( "emerald", { x: -17, y: 71, z: 6 } );
    
    /** 设置地图商人 */
    mapRuins.addTrader( { x: 6, y: 72, z: -80 }, 90, "blocks_and_items" );
    mapRuins.addTrader( { x: -6, y: 72, z: 80 }, 270, "blocks_and_items" );
    mapRuins.addTrader( { x: 6, y: 72, z: -79 }, 90, "weapon_and_armor" );
    mapRuins.addTrader( { x: -6, y: 72, z: 79 }, 270, "weapon_and_armor" );
    mapRuins.addTrader( { x: -6, y: 72, z: -79.5 }, 270, "team_upgrade" );
    mapRuins.addTrader( { x: 6, y: 72, z: 79.5 }, 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapRuins;
    
}

/** 【2队】野餐 */
function createMapPicnic( ) {

    /** 队伍信息初始化 */
    let mapPicnic = new BedwarsMap( "picnic", "野餐", { maxHeightLimit: 90, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 65, z: -62 }, 3, { x: 0, y: 64, z: -78 }, { x: 0, y: 64, z: -74 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 65, z: 61 }, 1, { x: 0, y: 64, z: 77 }, { x: 0, y: 64, z: 73 } );
    
    /** 移除多余实体，进行初始化 */
    mapPicnic.init()
    
    /** 设置地图的队伍 */
    mapPicnic.addTeam( teamRed ); 
    mapPicnic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapPicnic.addSpawner( "diamond", { x: 48, y: 65, z: 10 } );
    mapPicnic.addSpawner( "diamond", { x: -48, y: 65, z: -10 } );
    mapPicnic.addSpawner( "emerald", { x: -7, y: 70, z: -11 } );
    mapPicnic.addSpawner( "emerald", { x: 8, y: 70, z: 12 } );

    /** 设置地图商人 */
    mapPicnic.addTrader( { x: 6, y: 64, z: -76 }, 90, "blocks_and_items" );
    mapPicnic.addTrader( { x: -6, y: 64, z: 75 }, 270, "blocks_and_items" );
    mapPicnic.addTrader( { x: 6, y: 64, z: -75 }, 90, "weapon_and_armor" );
    mapPicnic.addTrader( { x: -6, y: 64, z: 74 }, 270, "weapon_and_armor" );
    mapPicnic.addTrader( { x: -6, y: 64, z: -75.5 }, 270, "team_upgrade" );
    mapPicnic.addTrader( { x: 6, y: 64, z: 74.5 }, 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapPicnic;
    
}

/** 【2队】狮庙 */
function createMapLionTemple( ) {

    /** 队伍信息初始化 */
    let mapLionTemple = new BedwarsMap( "lion_temple", "狮庙", { maxHeightLimit: 100, distributeResource: false, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: -2, y: 73, z: 58 }, 1, { x: -2, y: 75, z: 78 }, { x: -2, y: 75, z: 73 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -2, y: 73, z: -58 }, 3, { x: -2, y: 75, z: -78 }, { x: -2, y: 75, z: -73 } );
    /** 移除多余实体，进行初始化 */
    mapLionTemple.init()
    
    /** 设置地图的队伍 */
    mapLionTemple.addTeam( teamRed ); 
    mapLionTemple.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapLionTemple.addSpawner( "diamond", { x: 53, y: 84, z: 0 } );
    mapLionTemple.addSpawner( "diamond", { x: -58, y: 84, z: 0 } );
    mapLionTemple.addSpawner( "emerald", { x: -20, y: 79, z: 0 } );
    mapLionTemple.addSpawner( "emerald", { x: 17, y: 84, z: 0 } );

    /** 设置地图商人 */
    mapLionTemple.addTrader( { x: -7, y: 75, z: 73 }, 270, "blocks_and_items" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: -73 }, 90, "blocks_and_items" );
    mapLionTemple.addTrader( { x: -7, y: 75, z: 71 }, 270, "weapon_and_armor" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: -71 }, 90, "weapon_and_armor" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: 72 }, 90, "team_upgrade" );
    mapLionTemple.addTrader( { x: -7, y: 75, z: -72 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapLionTemple;
    
}

/** ===== 8队地图 ===== */

/** 【8队】冰川 */
function createMapGlacier() {

    /** 队伍信息初始化 */
    let mapGlacier = new BedwarsMap( "glacier", "冰川", { maxHeightLimit: 106, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: -32, y: 81, z: -65 }, 3, { x: -32, y: 81, z: -86 }, { x: -32, y: 81, z: -80 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 32, y: 81, z: -65 }, 3, { x: 32, y: 81, z: -86 }, { x: 32, y: 81, z: -80 } );
    let teamGreen = new BedwarsTeam( "green", { x: 65, y: 81, z: -32 }, 0, { x: 86, y: 81, z: -32 }, { x: 80, y: 81, z: -32 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 65, y: 81, z: 32 }, 0, { x: 86, y: 81, z: 32 }, { x: 80, y: 81, z: 32 } );
    let teamCyan = new BedwarsTeam( "cyan", { x: 32, y: 81, z: 65 }, 1, { x: 32, y: 81, z: 86 }, { x: 32, y: 81, z: 80 } );
    let teamWhite = new BedwarsTeam( "white", { x: -32, y: 81, z: 65 }, 1, { x: -32, y: 81, z: 86 }, { x: -32, y: 81, z: 80 } );
    let teamPink = new BedwarsTeam( "pink", { x: -65, y: 81, z: 32 }, 2, { x: -86, y: 81, z: 32 }, { x: -80, y: 81, z: 32 } );
    let teamGray = new BedwarsTeam( "gray", { x: -65, y: 81, z: -32 }, 2, { x: -86, y: 81, z: -32 }, { x: -80, y: 81, z: -32 } );

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
    mapGlacier.addSpawner( "diamond", { x: 0, y: 81, z: 50 } );
    mapGlacier.addSpawner( "diamond", { x: 0, y: 81, z: -50 } );
    mapGlacier.addSpawner( "diamond", { x: 50, y: 81, z: 0 } );
    mapGlacier.addSpawner( "diamond", { x: -50, y: 81, z: 0 } );
    mapGlacier.addSpawner( "emerald", { x: 20, y: 80, z: 20 } );
    mapGlacier.addSpawner( "emerald", { x: 20, y: 80, z: -20 } );
    mapGlacier.addSpawner( "emerald", { x: -20, y: 80, z: 20 } );
    mapGlacier.addSpawner( "emerald", { x: -20, y: 80, z: -20 } );

    /** 设置地图商人 */
    mapGlacier.addTrader( { x: -29, y: 81, z: -87 }, 0, "blocks_and_items" ); mapGlacier.addTrader( { x: -28, y: 81, z: -87 }, 0, "weapon_and_armor" ); mapGlacier.addTrader( { x: -35.5, y: 81, z: -87 }, 0, "team_upgrade" );
    mapGlacier.addTrader( { x: 35, y: 81, z: -87 }, 0, "blocks_and_items" ); mapGlacier.addTrader( { x: 36, y: 81, z: -87 }, 0, "weapon_and_armor" ); mapGlacier.addTrader( { x: 28.5, y: 81, z: -87 }, 0, "team_upgrade" );
    mapGlacier.addTrader( { x: 87, y: 81, z: -29 }, 90, "blocks_and_items" ); mapGlacier.addTrader( { x: 87, y: 81, z: -28 }, 90, "weapon_and_armor" ); mapGlacier.addTrader( { x: 87, y: 81, z: -35.5 }, 90, "team_upgrade" );
    mapGlacier.addTrader( { x: 87, y: 81, z: 35 }, 90, "blocks_and_items" ); mapGlacier.addTrader( { x: 87, y: 81, z: 36 }, 90, "weapon_and_armor" ); mapGlacier.addTrader( { x: 87, y: 81, z: 28.5 }, 90, "team_upgrade" );
    mapGlacier.addTrader( { x: 29, y: 81, z: 87 }, 180, "blocks_and_items" ); mapGlacier.addTrader( { x: 28, y: 81, z: 87 }, 180, "weapon_and_armor" ); mapGlacier.addTrader( { x: 35.5, y: 81, z: 87 }, 180, "team_upgrade" );
    mapGlacier.addTrader( { x: -35, y: 81, z: 87 }, 180, "blocks_and_items" ); mapGlacier.addTrader( { x: -36, y: 81, z: 87 }, 180, "weapon_and_armor" ); mapGlacier.addTrader( { x: -28.5, y: 81, z: 87 }, 180, "team_upgrade" );
    mapGlacier.addTrader( { x: -87, y: 81, z: 29 }, 270, "blocks_and_items" ); mapGlacier.addTrader( { x: -87, y: 81, z: 28 }, 270, "weapon_and_armor" ); mapGlacier.addTrader( { x: -87, y: 81, z: 35.5 }, 270, "team_upgrade" );
    mapGlacier.addTrader( { x: -87, y: 81, z: -35 }, 270, "blocks_and_items" ); mapGlacier.addTrader( { x: -87, y: 81, z: -36 }, 270, "weapon_and_armor" ); mapGlacier.addTrader( { x: -87, y: 81, z: -28.5 }, 270, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapGlacier;
    
}

/** 【8队】屋顶 */
function createMapRooftop() {

    /** 队伍信息初始化 */
    let mapRooftop = new BedwarsMap( "rooftop", "屋顶", { maxHeightLimit: 91, minHeightLimit: 55, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: -34, y: 66, z: -79 }, 3, { x: -34, y: 66, z: -96 }, { x: -34, y: 66, z: -89 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 34, y: 66, z: -79 }, 3, { x: 34, y: 66, z: -96 }, { x: 34, y: 66, z: -89 } );
    let teamGreen = new BedwarsTeam( "green", { x: 79, y: 66, z: -34 }, 0, { x: 96, y: 66, z: -34 }, { x: 89, y: 66, z: -34 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 79, y: 66, z: 34 }, 0, { x: 96, y: 66, z: 34 }, { x: 89, y: 66, z: 34 } );
    let teamCyan = new BedwarsTeam( "cyan", { x: 34, y: 66, z: 79 }, 1, { x: 34, y: 66, z: 96 }, { x: 34, y: 66, z: 89 } );
    let teamWhite = new BedwarsTeam( "white", { x: -34, y: 66, z: 79 }, 1, { x: -34, y: 66, z: 96 }, { x: -34, y: 66, z: 89 } );
    let teamPink = new BedwarsTeam( "pink", { x: -79, y: 66, z: 34 }, 2, { x: -96, y: 66, z: 34 }, { x: -89, y: 66, z: 34 } );
    let teamGray = new BedwarsTeam( "gray", { x: -79, y: 66, z: -34 }, 2, { x: -96, y: 66, z: -34 }, { x: -89, y: 66, z: -34 } );

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
    mapRooftop.addSpawner( "diamond", { x: 39, y: 72, z: 39 } );
    mapRooftop.addSpawner( "diamond", { x: -39, y: 72, z: 39 } );
    mapRooftop.addSpawner( "diamond", { x: 39, y: 72, z: -39 } );
    mapRooftop.addSpawner( "diamond", { x: -39, y: 72, z: -39 } );
    mapRooftop.addSpawner( "emerald", { x: 11, y: 81, z: 11 } );
    mapRooftop.addSpawner( "emerald", { x: -11, y: 81, z: -11 } );
    mapRooftop.addSpawner( "emerald", { x: 11, y: 72, z: 13 } );
    mapRooftop.addSpawner( "emerald", { x: -11, y: 72, z: -13 } );

    /** 设置地图商人 */
    mapRooftop.addTrader( { x: -28, y: 66, z: -91 }, 90, "blocks_and_items" ); mapRooftop.addTrader( { x: -28, y: 66, z: -90 }, 90, "weapon_and_armor" ); mapRooftop.addTrader( { x: -40, y: 66, z: -90.5 }, 270, "team_upgrade" );
    mapRooftop.addTrader( { x: 40, y: 66, z: -91 }, 90, "blocks_and_items" ); mapRooftop.addTrader( { x: 40, y: 66, z: -90 }, 90, "weapon_and_armor" ); mapRooftop.addTrader( { x: 28, y: 66, z: -90.5 }, 270, "team_upgrade" );
    mapRooftop.addTrader( { x: 91, y: 66, z: -28 }, 180, "blocks_and_items" ); mapRooftop.addTrader( { x: 90, y: 66, z: -28 }, 180, "weapon_and_armor" ); mapRooftop.addTrader( { x: 90.5, y: 66, z: -40 }, 0, "team_upgrade" );
    mapRooftop.addTrader( { x: 91, y: 66, z: 40 }, 180, "blocks_and_items" ); mapRooftop.addTrader( { x: 90, y: 66, z: 40 }, 180, "weapon_and_armor" ); mapRooftop.addTrader( { x: 90.5, y: 66, z: 28 }, 0, "team_upgrade" );
    mapRooftop.addTrader( { x: 28, y: 66, z: 91 }, 270, "blocks_and_items" ); mapRooftop.addTrader( { x: 28, y: 66, z: 90 }, 270, "weapon_and_armor" ); mapRooftop.addTrader( { x: 40, y: 66, z: 90.5 }, 90, "team_upgrade" );
    mapRooftop.addTrader( { x: -40, y: 66, z: 91 }, 270, "blocks_and_items" ); mapRooftop.addTrader( { x: -40, y: 66, z: 90 }, 270, "weapon_and_armor" ); mapRooftop.addTrader( { x: -28, y: 66, z: 90.5 }, 90, "team_upgrade" );
    mapRooftop.addTrader( { x: -91, y: 66, z: 28 }, 0, "blocks_and_items" ); mapRooftop.addTrader( { x: -90, y: 66, z: 28 }, 0, "weapon_and_armor" ); mapRooftop.addTrader( { x: -90.5, y: 66, z: 40 }, 180, "team_upgrade" );
    mapRooftop.addTrader( { x: -91, y: 66, z: -40 }, 0, "blocks_and_items" ); mapRooftop.addTrader( { x: -90, y: 66, z: -40 }, 0, "weapon_and_armor" ); mapRooftop.addTrader( { x: -90.5, y: 66, z: -28 }, 180, "team_upgrade" );

    /** 延长本地图加载时间至15秒（因为这地图实在太大了......） */
    mapRooftop.loadInfo.structureLoadTime = 300;

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapRooftop;
    
}

/** 【8队】亚马逊 */
function createMapAmazon() {

    /** 队伍信息初始化 */
    let mapAmazon = new BedwarsMap( "amazon", "亚马逊", { maxHeightLimit: 90, minHeightLimit: 55, distributeResource: false, ironInterval: 20, goldInterval: 120, ironSpawnTimes: 1 } );
    let teamRed = new BedwarsTeam( "red", { x: -33, y: 65, z: -80 }, 3, { x: -33, y: 65, z: -100 }, { x: -33, y: 65, z: -95 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 33, y: 65, z: -80 }, 3, { x: 33, y: 65, z: -100 }, { x: 33, y: 65, z: -95 } );
    let teamGreen = new BedwarsTeam( "green", { x: 80, y: 65, z: -33 }, 0, { x: 100, y: 65, z: -33 }, { x: 95, y: 65, z: -33 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 80, y: 65, z: 33 }, 0, { x: 100, y: 65, z: 33 }, { x: 95, y: 65, z: 33 } );
    let teamCyan = new BedwarsTeam( "cyan", { x: 33, y: 65, z: 80 }, 1, { x: 33, y: 65, z: 100 }, { x: 33, y: 65, z: 95 } );
    let teamWhite = new BedwarsTeam( "white", { x: -33, y: 65, z: 80 }, 1, { x: -33, y: 65, z: 100 }, { x: -33, y: 65, z: 95 } );
    let teamPink = new BedwarsTeam( "pink", { x: -80, y: 65, z: 33 }, 2, { x: -100, y: 65, z: 33 }, { x: -95, y: 65, z: 33 } );
    let teamGray = new BedwarsTeam( "gray", { x: -80, y: 65, z: -33 }, 2, { x: -100, y: 65, z: -33 }, { x: -95, y: 65, z: -33 } );

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
    mapAmazon.addSpawner( "diamond", { x: 76, y: 63, z: 75 } );
    mapAmazon.addSpawner( "diamond", { x: -75, y: 63, z: 76 } );
    mapAmazon.addSpawner( "diamond", { x: 75, y: 63, z: -76 } );
    mapAmazon.addSpawner( "diamond", { x: -76, y: 63, z: -75 } );
    mapAmazon.addSpawner( "emerald", { x: 0, y: 80, z: 33 } );
    mapAmazon.addSpawner( "emerald", { x: 0, y: 80, z: -33 } );
    mapAmazon.addSpawner( "emerald", { x: 33, y: 80, z: 0 } );
    mapAmazon.addSpawner( "emerald", { x: -33, y: 80, z: 0 } );

    /** 设置地图商人 */
    mapAmazon.addTrader( { x: -26, y: 66, z: -96 }, 90, "blocks_and_items" ); mapAmazon.addTrader( { x: -26, y: 66, z: -95 }, 90, "weapon_and_armor" ); mapAmazon.addTrader( { x: -39, y: 66, z: -95.5 }, 270, "team_upgrade" );
    mapAmazon.addTrader( { x: 39, y: 66, z: -96 }, 90, "blocks_and_items" ); mapAmazon.addTrader( { x: 39, y: 66, z: -95 }, 90, "weapon_and_armor" ); mapAmazon.addTrader( { x: 26, y: 66, z: -95.5 }, 270, "team_upgrade" );
    mapAmazon.addTrader( { x: 96, y: 66, z: -26 }, 180, "blocks_and_items" ); mapAmazon.addTrader( { x: 95, y: 66, z: -26 }, 180, "weapon_and_armor" ); mapAmazon.addTrader( { x: 95.5, y: 66, z: -39 }, 0, "team_upgrade" );
    mapAmazon.addTrader( { x: 96, y: 66, z: 39 }, 180, "blocks_and_items" ); mapAmazon.addTrader( { x: 95, y: 66, z: 39 }, 180, "weapon_and_armor" ); mapAmazon.addTrader( { x: 95.5, y: 66, z: 26 }, 0, "team_upgrade" );
    mapAmazon.addTrader( { x: 26, y: 66, z: 96 }, 270, "blocks_and_items" ); mapAmazon.addTrader( { x: 26, y: 66, z: 95 }, 270, "weapon_and_armor" ); mapAmazon.addTrader( { x: 39, y: 66, z: 95.5 }, 90, "team_upgrade" );
    mapAmazon.addTrader( { x: -39, y: 66, z: 96 }, 270, "blocks_and_items" ); mapAmazon.addTrader( { x: -39, y: 66, z: 95 }, 270, "weapon_and_armor" ); mapAmazon.addTrader( { x: -26, y: 66, z: 95.5 }, 90, "team_upgrade" );
    mapAmazon.addTrader( { x: -96, y: 66, z: 26 }, 0, "blocks_and_items" ); mapAmazon.addTrader( { x: -95, y: 66, z: 26 }, 0, "weapon_and_armor" ); mapAmazon.addTrader( { x: -95.5, y: 66, z: 39 }, 180, "team_upgrade" );
    mapAmazon.addTrader( { x: -96, y: 66, z: -39 }, 0, "blocks_and_items" ); mapAmazon.addTrader( { x: -95, y: 66, z: -39 }, 0, "weapon_and_armor" ); mapAmazon.addTrader( { x: -95.5, y: 66, z: -26 }, 180, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapAmazon;
    
}
