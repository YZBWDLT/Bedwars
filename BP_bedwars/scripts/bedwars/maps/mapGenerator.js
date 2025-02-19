/** ===== 地图生成器 ===== */

import { settings } from "../methods/bedwarsSettings";

import { createMapCryptic } from "./2Teams/cryptic";
import { createMapFrost } from "./2Teams/frost";
import { createMapGarden } from "./2Teams/garden";
import { createMapLionTemple } from "./2Teams/lionTemple";
import { createMapPicnic } from "./2Teams/picnic";
import { createMapRuins } from "./2Teams/ruins";

import { createMapAquarium } from "./4Teams/aquarium";
import { createMapArchway } from "./4Teams/archway";
import { createMapBoletum } from "./4Teams/boletum";
import { createMapCarapace } from "./4Teams/carapace";
import { createMapChained } from "./4Teams/chained";
import { createMapEastwood } from "./4Teams/eastwood";
import { createMapOrchid } from "./4Teams/orchid";

import { createMapAmazon } from "./8Teams/amazon";
import { createMapDeadwood } from "./8Teams/deadwood";
import { createMapGlacier } from "./8Teams/glacier";
import { createMapRooftop } from "./8Teams/rooftop";

import { createMapPicnicCapture } from "./capture/picnicCapture";

/** 可用地图列表 */
export const validMaps = {
    /** 经典模式地图 */ classic: {
        /** 两队模式 */ twoTeams: [ "cryptic", "frost", "garden", "ruins", "picnic", "lion_temple", ],
        /** 四队模式 */ fourTeams: [ "orchid", "chained", "boletum", "carapace", "archway", "aquarium", "eastwood", ],
        /** 八队模式 */ eightTeams: [ "glacier", "rooftop", "amazon", "deadwood", ],
    },
    /** 夺点模式地图 */ capture: {
        /** 两队模式 */ twoTeams: [ "picnic_capture", ]
    },
}

/** 获取所有可用地图的 ID */
export function getValidMaps() {

    /** 获取所有可用地图 @type {String[]} */
    let currentValidMaps = [];
    if ( settings.randomMap.allow2Teams ) {
        currentValidMaps = [ ...currentValidMaps, ...validMaps.classic.twoTeams, ...validMaps.capture.twoTeams ];
    };
    if ( settings.randomMap.allow4Teams ) {
        currentValidMaps = [ ...currentValidMaps, ...validMaps.classic.fourTeams ];
    };
    if ( settings.randomMap.allow8Teams ) {
        currentValidMaps = [ ...currentValidMaps, ...validMaps.classic.eightTeams ];
    };
    return currentValidMaps;

}

/** 重新生成地图并启用经典模式的游戏前事件
 * @param {String} mapId - 如果提供了此参数，则将生成这张固定的地图
 */
export function regenerateMap( mapId = undefined ) {

    /** 获取所有可用地图 @type {String} */
    let currentValidMaps = getValidMaps();

    /** 在所有可用地图中选择一个 */
    let randomMap = currentValidMaps[ Math.floor( Math.random() * currentValidMaps.length ) ];

    /** 如果已经传入参数并确定生成的地图，则使用确定的地图 */
    if ( currentValidMaps.includes( mapId ) ) { randomMap = mapId };

    /** 生成之 */
    switch ( randomMap ) {

        case "orchid": createMapOrchid(); break;
        case "chained": createMapChained(); break;
        case "boletum": createMapBoletum(); break;
        case "carapace": createMapCarapace(); break;
        case "archway": createMapArchway(); break;
        case "aquarium": createMapAquarium(); break;
        case "eastwood": createMapEastwood(); break;

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
