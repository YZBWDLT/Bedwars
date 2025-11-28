/** 地图类，及地图相关信息 */

import { eachTeam } from "./bedwarsTeam"
import { Vector } from "./positionManager";

/** 【类】地图类，控制地图全局的运行方式 */
export class BedwarsMap {

    /** 玩家是否可以进入商店 */ playerCouldIntoShop = true;
    /** 夺点模式信息 */
    captureInfo = {
        /** 所有有效点位 @type {Vector[]} */ validBedPoints: [],
        /** 游戏结束倒计时，单位：秒 */ gameOverCountdown: 1500,
        /** 优势方 @type {import("./bedwarsTeam.js").validTeams|"none"} */ dominantTeam: "none",
    };

    /** ===== 不同模式适配方法 ===== */

    /** 获取地图模式名 */
    modeName() {
        if (this.mode === "classic") { return "经典"; } else { return "夺点" }
    };

    /** ===== 夺点模式方法 ===== */

    /** 获取夺点模式优势方信息和游戏结束倒计时
     * @description 优势方：返回距离淘汰倒计时最久的队伍，如果有队伍一样最久，则返回"none"。例如，红队500秒后淘汰，蓝队350秒后淘汰，则返回"red"。
     * @description 游戏结束倒计时：返回距离淘汰倒计时最近的队伍。例如上例，返回350。
     */
    getCaptureInfo() {
        /** 各队伍数据 @type {{[id:String]:Number}} */ let teamData = {};
        eachTeam(team => {
            teamData[team.id] = Math.ceil(team.captureInfo.score / team.captureInfo.otherTeamBedAmount); // 令某队的游戏结束倒计时等于其分数除以其他队床数，向上取整。例如：752分，对面3床，则本队还有251秒分数归零。
        })
        /** 所有倒计时数据 */ let countdownDatas = Object.values(teamData);
        /** 获取所有队伍中的所有优势方 */ let dominantTeams = Object.keys(teamData).filter(key => teamData[key] === Math.max(...countdownDatas));
        /** 获取优势方，如果有多个则返回"none" */ let dominantTeam = dominantTeams.length > 1 ? "none" : dominantTeams[0];
        /** 获取游戏结束倒计时 */ let gameOverCountdown = countdownDatas.reduce((a, b) => Math.min(a, b));
        this.captureInfo.dominantTeam = dominantTeam;
        this.captureInfo.gameOverCountdown = gameOverCountdown;
        return { dominantTeam, gameOverCountdown };
    };

}
