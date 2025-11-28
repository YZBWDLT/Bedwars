/**
 * ===== 起床战争方法 - 队伍 =====
 * 定义了队伍的起床战争信息，以及一些可用的队伍起床战争数据方法
 */

import { world } from "@minecraft/server";
import { overworld, positionManager, Vector } from "./positionManager";
import { map } from "./bedwarsMaps";

export class BedwarsTeam {

    /** Capture 模式信息 */ captureInfo = {
        /** 床位置 @type {Vector[]} */ bedsPos: [],
        /** 队伍当前积分 */ score: 1500,
        /** 其他队伍合计的床数 */ otherTeamBedAmount: 1,
    };
    /** 放置床 */
    setBed() {

        /** 设置床的位置
         * @param {Vector} bedFeetPos 指定床脚位置
         * @param {Boolean} correctPos 是否修正床脚位置，使床在床脚位置处生成？否则将在x,y,z最小处生成。默认值：true。
         */
        let pos = (bedFeetPos, correctPos = true) => {

            let placePos = positionManager.copy(bedFeetPos);

            /** 若为0°/90°，则床不会有任何偏移，直接在床脚处生成 */
            if (!correctPos || this.bedInfo.rotation === "None" || this.bedInfo.rotation === "Rotate90") { return placePos; }
            else if (this.bedInfo.rotation === "Rotate180") { return positionManager.add(placePos, -1, 0, 0); }
            else if (this.bedInfo.rotation === "Rotate270") { return positionManager.add(placePos, 0, 0, -1); }

        }

        /** 加载结构，如果是夺点模式，则对于每一个该队伍已有的点位都重新设置床；否则，在该队的床点位设置床 */
        if (map().mode === "capture") {
            this.captureInfo.bedsPos.forEach(bedPos => {
                world.structureManager.place(`beds:${this.id}_bed`, overworld, pos(bedPos, false), { rotation: this.bedInfo.rotation });
            })
        }
        else {
            world.structureManager.place(`beds:${this.id}_bed`, overworld, pos(this.bedInfo.pos), { rotation: this.bedInfo.rotation });
        }

    };
    /** 获取其他队伍的床数 */
    getOtherTeamBed() {
        this.captureInfo.otherTeamBedAmount = 0;
        map().teamList.filter(otherTeam => otherTeam.id !== this.id).forEach(otherTeam => {
            this.captureInfo.otherTeamBedAmount += otherTeam.captureInfo.bedsPos.length;
        });
        return this.captureInfo.otherTeamBedAmount;
    };
}
