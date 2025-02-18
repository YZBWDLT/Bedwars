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
import { createMapOrchid } from "./4Teams/orchid";

import { createMapAmazon } from "./8Teams/amazon";
import { createMapDeadwood } from "./8Teams/deadwood";
import { createMapGlacier } from "./8Teams/glacier";
import { createMapRooftop } from "./8Teams/rooftop";

import { createMapPicnicCapture } from "./capture/picnicCapture";

/** 可用 2 队地图列表 */
export const validMapsFor2Teams = [ "cryptic", "frost", "garden", "ruins", "picnic", "lion_temple" ];

/** 可用 4 队地图列表 */
export const validMapsFor4Teams = [ "orchid", "chained", "boletum", "carapace", "archway", "aquarium" ];

/** 可用 8 队地图列表 */
export const validMapsFor8Teams = [ "glacier", "rooftop", "amazon", "deadwood" ];

/** 可用夺点模式地图列表 */
export const validMapsForCaptureMode = [ "picnic_capture" ]

/** 重新生成地图并启用经典模式的游戏前事件
 * @param {String} mapId - 如果提供了此参数，则将生成这张固定的地图
 */
export function regenerateMap( mapId = undefined ) {

    /** 获取所有可用地图 @type {String} */
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
