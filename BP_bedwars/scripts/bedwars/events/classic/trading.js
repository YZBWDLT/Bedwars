/**
 * ===== 交易逻辑 =====
 * 【经典模式】
 * 本文件主要用于：
 * · 供应商人的物品；
 * · 玩家购买物品的逻辑；
 * · 移除商品掉落出的掉落物；
 * · 禁止玩家进入商人区域。
 */

import { eachAlivePlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

/** 交易功能 */
export function trading() {

    // ===== 禁止玩家进入商人区域 =====
    if (!map().playerCouldIntoShop) {
        eachAlivePlayer(player => {
            player.runCommand(`function maps/${map().id}/player_into_shop`)
        });
    }

}
