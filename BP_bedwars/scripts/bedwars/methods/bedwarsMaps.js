/** 地图类，及地图相关信息 */

import { world } from "@minecraft/server";
import { BedwarsTeam, eachTeam } from "./bedwarsTeam"
import { settings } from "./bedwarsSettings";

import { randomInt } from "./number";
import { overworld, positionManager, Vector } from "./positionManager";
import { eventManager } from "../events/eventManager";
import { tickToSecond } from "./time";
import { shopitems } from "./bedwarsShopitem";

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
    /** 游戏结束后，自动开启下一场游戏的倒计时，单位：游戏刻 */ nextGameCountdown = 200;
    /** 游戏开始倒计时 */ gameStartCountdown = settings.beforeGaming.waiting.gameStartWaitingTime;
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
    };
    /** 地图大小信息 */
    mapSize = {
        /** x 方向半边长大小 */ x: 105,
        /** z 方向半边长大小 */ z: 105,
        /** 上一张地图的 x 方向半边长大小 */ prevX: 105,
        /** 上一张地图的 z 方向半边长大小 */ prevZ: 105,
    }
    /** @type {"classic"|"capture"} 地图模式，classic=经典，capture=夺点模式 */ mode = "classic";
    /** 夺点模式信息 */
    captureInfo = {
        /** 所有有效点位 @type {Vector[]} */ validBedPoints: [ ],
        /** 游戏结束倒计时，单位：秒 */ gameOverCountdown: 1500,
        /** 优势方 @type {import("./bedwarsTeam.js").validTeams|"none"} */ dominantTeam: "none",
    };

    // ===== 商人操作 =====

    /** 设置下一个事件
     * @param {Number} nextEventCountdown 距离下一个事件的倒计时，单位：游戏刻
     * @param {String} nextEventName 下一个事件的名称
     */
    setNextEvent( nextEventCountdown, nextEventName ) {
        this.gameEvent.currentId++;
        this.gameEvent.nextEventCountdown = nextEventCountdown;
        this.gameEvent.nextEventName = nextEventName;
    };

    /** ===== 不同模式适配方法 ===== */
    
    /** 获取地图模式名 */
    modeName( ) {
        if ( this.mode === "classic" ) { return "经典"; } else { return "夺点" }
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
