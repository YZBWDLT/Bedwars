/**
 * ===== 装备逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 进行玩家装备的检测；
 * · 当玩家的盔甲不正确或不存在时，需要重新给予盔甲。
 * · 当玩家的装备不正确或不存在时，需要重新给予装备。
 * · 剑和斧需要在玩家购买锋利附魔之后施加锋利附魔。
 */

import { Player } from "@minecraft/server";
import { BedwarsPlayer, eachAlivePlayer } from "../../methods/bedwarsPlayer";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { eachValidItem, getEquipmentEnchantmentLevel, getInventoryEnchantmentLevel, giveItem, hasItem, removeItem, replaceEquipmentItem, replaceInventoryItem } from "../../methods/itemManager";

let weaponType = [ "wooden", "stone", "iron", "diamond" ];
let pickaxeType = [ "wooden", "iron", "golden", "diamond" ];
let armorType = [ "chainmail", "iron", "diamond" ]

/** ===== 检测控制器 ===== */

/** 装备检测器 */
export function equipmentTest() {

    /** 令每个存活的玩家执行 */
    eachAlivePlayer( ( player, playerInfo ) => {
    
        /** 物品检测 */
        let lackOfEquipment = itemSupplier( player, playerInfo, playerInfo.getTeam() );

        /** 附魔检测 | 必须在物品检测通过后才能使用附魔检测 */
        if ( !lackOfEquipment ) {

            /** 剑与斧的锋利检测 */
            sharpnessTest( player, playerInfo.getTeam().teamUpgrade.sharpenedSwords ? 1 : 0 );

            /** 护甲的保护检测 */
            protectionTest( player, playerInfo, playerInfo.getTeam().teamUpgrade.reinforcedArmor )

        }

    } )

}

/** 物品检测器，不存在物品时则补充之
 * @description 如果在执行过程中发现玩家缺少装备，则标记为缺少装备防止后续附魔检测出错；同时，提供新的装备
 * @param {Player} player 待检测玩家
 * @param {BedwarsPlayer} playerInfo 待检测玩家的起床战争信息
 * @param {BedwarsTeam} team 队伍
 * @returns 返回在执行过程中是否出现了玩家缺少装备的情况
 */
function itemSupplier( player, playerInfo, team ) {

    let lackOfEquipment = false;

    /** 盔甲：头盔与胸甲 */
    if ( !hasItem( player, `bedwars:${playerInfo.team}_helmet`, { location: "slot.armor.head" } ) ) {
        lackOfEquipment = true;
        helmetAndChestplateSupplier( player, playerInfo.team, team.teamUpgrade.reinforcedArmor );
    }

    /** 盔甲：护腿与靴子 | 没有护腿的，或者有护腿但是等级不正确的，则补充之 */
    if ( leggingsCurrentLevel( player, playerInfo.team ) !== playerInfo.equipment.armor ) {
        lackOfEquipment = true;
        leggingsAndBootsSupplier( player, playerInfo.team, playerInfo.equipment.armor, team.teamUpgrade.reinforcedArmor );
    }

    /** 工具：剑 | 没有剑的，则补充之 */
    let lackOfSword = true;
    weaponType.forEach( type => { if ( hasItem( player, `bedwars:${type}_sword` ) ) { lackOfSword = false; } } )
    if ( lackOfSword ) {
        lackOfEquipment = true;
        swordSupplier( player, team.teamUpgrade.sharpenedSwords );
    }

    /** 工具：斧
     * 斧头等级为 0 的，则不尝试提供斧头，而是尝试清除斧头
     * 高于 0 的，如果没有斧或者有斧头但是等级不正确的，则补充之
     */
    if ( playerInfo.equipment.axe === 0 ) {
        weaponType.forEach( type => { removeItem( player, `bedwars:${type}_axe` ) } );
    }
    else if ( axeCurrentLevel( player ) !== playerInfo.equipment.axe ) {
        lackOfEquipment = true;
        axeSupplier( player, playerInfo.equipment.axe, team.teamUpgrade.sharpenedSwords );
    }

    /** 工具：镐
     * 镐子等级为 0 的，则不尝试提供镐子，而是尝试清除镐子
     * 高于 0 的，如果没有镐或者有镐子但是等级不正确的，则补充之
     */
    if ( playerInfo.equipment.pickaxe === 0 ) {
        pickaxeType.forEach( type => { removeItem( player, `bedwars:${type}_pickaxe` ) } )
    }
    else if ( pickaxeCurrentLevel( player ) !== playerInfo.equipment.pickaxe ) {
        lackOfEquipment = true;
        pickaxeSupplier( player, playerInfo.equipment.pickaxe );
    }

    /** 工具：剪刀 */
    if ( playerInfo.equipment.shears === 0 ) {
        removeItem( player, "bedwars:shears" );
    }
    else if ( !hasItem( player, `bedwars:shears` ) ) {
        lackOfEquipment = true;
        shearsSupplier( player );
    }

    return lackOfEquipment;

}

/** 带有锋利附魔的装备检测
 * @param {Player} player 待检测玩家
 * @param {Number} sharpnessLevel 锋利附魔等级
 */
function sharpnessTest( player, sharpnessLevel ) {

    eachValidItem( player, ( item, slot ) => {

        /** 判断此物品是否为剑或斧（不能检测商店物品或升级物品） */
        let isSwordOrAxe = item.typeId.includes( "bedwars:" ) && ( !item.typeId.includes( "upgrade_" ) && !item.typeId.includes( "shopitem_" ) ) && ( item.typeId.includes( "_sword" ) || item.typeId.includes( "_axe" ) )

        /** 剑与斧的重附魔 */
        if ( isSwordOrAxe && getInventoryEnchantmentLevel( player, slot, "sharpness" ) !== sharpnessLevel ) {
            replaceInventoryItem( player, item.typeId, slot, { itemLock: "inventory", enchantments: [ { id: "sharpness", level: sharpnessLevel } ] } )
        }

    } )

}

/** 带有保护附魔的装备检测
 * @param {Player} player 待检测玩家
 * @param {BedwarsPlayer} playerInfo 玩家起床战争信息
 * @param {Number} protectionLevel 保护附魔等级
 */
function protectionTest( player, playerInfo, protectionLevel ) {

    /** 胸甲检测，附魔等级不正确则整体替换 */
    if ( getEquipmentEnchantmentLevel( player, "Chest", "protection" ) !== protectionLevel ) {
        helmetAndChestplateSupplier( player, playerInfo.team, protectionLevel );
        leggingsAndBootsSupplier( player, playerInfo.team, playerInfo.equipment.armor, protectionLevel );
    }

}



/** ===== 各类物品供应器 ===== */

/** 为玩家提供剑
 * @param {Player} player 待提供物品的玩家
 * @param {Boolean} supplySharpenedSwords 是否提供锋利剑
 */
function swordSupplier( player, supplySharpenedSwords = false ) {

    /** 如果要给予锋利剑，则给予之 */
    if ( supplySharpenedSwords ) {
        giveItem( player, "bedwars:wooden_sword", { enchantments: [ { id: "sharpness", level: 1 } ], itemLock: "inventory" } )
    }

    /** 否则，给予普通剑 */
    else {
        giveItem( player, "bedwars:wooden_sword", { itemLock: "inventory" } )
    }

}

/** 为玩家提供斧
 * @param {Player} player 待提供物品的玩家
 * @param {Number} axeTier 斧头等级
 * @param {Boolean} supplySharpenedSwords 是否提供锋利斧
 */
function axeSupplier( player, axeTier, supplySharpenedSwords = false ) {

    /** 斧头附魔 */
    let axeEnchantment = [ { id: "efficiency", level: tierEnchantmentLevel( axeTier ) } ];
    if ( supplySharpenedSwords ) { axeEnchantment.push( { id: "sharpness", level: 1 } ) };

    /** 给予斧头 */
    giveItem( player, `bedwars:${weaponType[axeTier-1]}_axe`, { enchantments: axeEnchantment, itemLock: "inventory" } )

}

/** 为玩家提供镐
 * @param {Player} player 待提供物品的玩家
 * @param {Number} pickaxeTier 镐子等级
 */
function pickaxeSupplier( player, piackaxeTier ) {
    
    /** 给予镐子 */
    giveItem( player, `bedwars:${pickaxeType[piackaxeTier-1]}_pickaxe`, { enchantments: [ { id: "efficiency", level: tierEnchantmentLevel( piackaxeTier ) } ], itemLock: "inventory" } )
    
}

/** 为玩家提供剪刀
 * @param {Player} player 
 */
function shearsSupplier( player ) {

    /** 给予剪刀 */
    giveItem( player, `bedwars:shears`, { itemLock: "inventory" } )

}

/** 设置玩家头盔与胸甲
 * @param {Player} player 待设置装备玩家
 * @param {String} teamColor 玩家队伍颜色
 * @param {Number} protectionLevel 保护附魔等级
 */
function helmetAndChestplateSupplier( player, teamColor, protectionLevel ) {

    /** 头盔 */
    replaceEquipmentItem( player, `bedwars:${teamColor}_helmet`, "Head", { itemLock: "slot", enchantments: [ { id: "protection", level: protectionLevel } ] } );

    /** 胸甲 */
    replaceEquipmentItem( player, `bedwars:${teamColor}_chestplate`, "Chest", { itemLock: "slot", enchantments: [ { id: "protection", level: protectionLevel } ] } );

}

/** 设置玩家护腿和靴子
 * @param {Player} player 待设置装备玩家
 * @param {String} teamColor 玩家队伍颜色
 * @param {Number} armorTier 玩家盔甲等级
 * @param {Number} protectionLevel 保护附魔等级
 */
function leggingsAndBootsSupplier( player, teamColor, armorTier, protectionLevel ) {

    /** 获取护甲材质
     * @description 如果玩家的盔甲等级高于 2 ，则使用特定材质的护甲，否则采用默认队伍颜色套装
     */
    let getArmorType = () => {
        if ( armorTier >= 2 ) { return armorType[armorTier-2]; } else { return teamColor; }
    }

    /** 护腿 */
    replaceEquipmentItem( player, `bedwars:${getArmorType()}_leggings`, "Legs", { itemLock: "slot", enchantments: [ { id: "protection", level: protectionLevel } ] } )

    /** 胸甲 */
    replaceEquipmentItem( player, `bedwars:${getArmorType()}_boots`, "Feet", { itemLock: "slot", enchantments: [ { id: "protection", level: protectionLevel } ] } )

}

/** ===== 各类物品等级检测 ===== */

/** 检测玩家当前拥有的斧头等级。0：未检测到规定斧、1：木、2：石、3：铁、4：钻
 * @param {Player} player 待检测的玩家
 */
function axeCurrentLevel( player ) {
    for ( let i = 1; i < weaponType.length + 1; i++ ) {
        if ( hasItem( player, `bedwars:${weaponType[i-1]}_axe` ) ) { return i; }
    };
    return 0;
}

/** 检测玩家当前拥有的镐子等级。0：未检测到规定镐、1：木、2：铁、3：金、4：钻
 * @param {Player} player 待检测的玩家
 */
function pickaxeCurrentLevel( player ) {
    for ( let i = 1; i < pickaxeType.length + 1; i++ ) {
        if ( hasItem( player, `bedwars:${pickaxeType[i-1]}_pickaxe` ) ) { return i; }
    };
    return 0;
}

/** 检测玩家当前拥有的装备等级。0：未检测到规定装备、1：默认装备、2：锁链、3：铁、4：钻
 * @param {Player} player 待检测的玩家
 * @param {String} teamColor 队伍颜色
 */
function leggingsCurrentLevel( player, teamColor ) {

    /** 先检测特殊等级的护腿 */
    for ( let i = 2; i < armorType.length + 2; i++ ) {
        if ( hasItem( player, `bedwars:${armorType[i-2]}_leggings`, { location: "slot.armor.legs" } ) ) { return i; }
    };

    /** 再检测默认的皮革装备 */
    if ( hasItem( player, `bedwars:${teamColor}_leggings`, { location: "slot.armor.legs" } ) ) { return 1; }

    /** 都没检测到，则返回0 */
    return 0;

}

/** 由装备等级返回附魔等级
 * @param {Number} tier 装备等级
 */
function tierEnchantmentLevel( tier ) {

    /** 
     * 等级 1 2 3 4
     * 附魔 1 1 2 3
     */
    return tier - 1 === 0 ? 1 : tier - 1;

}
