/** ===== 末影珍珠 ===== */

import { map } from "../../methods/bedwarsMaps";

/** 移除出界的末影珍珠 */
export function removeEnderPearl() {
    map().removeEntityOutOfBorder( "minecraft:ender_pearl" );
}
