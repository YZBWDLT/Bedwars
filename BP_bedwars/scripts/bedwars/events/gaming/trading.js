/**
 * ===== 交易功能 =====
 */

import { ContainerSlot, Entity, Player } from "@minecraft/server";
import { eachValidSlot, getItemAmount, giveItem, hasItem, replaceInventoryItem } from "../../methods/itemManager";
import { eachPlayer } from "../../methods/playerManager";
import { overworld } from "../../methods/positionManager";
import { blocksAndItemsShopitems, Shopitem, teamUpgradeShopitems, weaponAndArmorCaptureShopitems, weaponAndArmorShopitems } from "../../methods/bedwarsShopitem";
import { BedwarsPlayer, eachAlivePlayer, eachValidPlayer, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

/** 交易功能 */
export function trading() {

    /** 玩家物品锁定（防止交易界面吞物品） */
    playerItemLocker();

    /** 商人物品供应 */
    supplyShopitem();

    /** 玩家购买物品 */
    playerPurchaseItems();

    /** 移除商店物品实体 */
    removeShopitemEntity();

    /** 启用时，设置玩家不得进入商人区域 */
    if ( !map().playerCouldIntoShop ) {
        forbiddenArea();
    }

}

/** 始终锁定的物品 */
const alwaysLockInInventory = [ "bedwars:wooden_sword", "bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe", "bedwars:diamond_pickaxe", "bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe", "bedwars:diamond_axe", "bedwars:shears" ];

/** 玩家物品锁定控制器
 * @description 当玩家与商人交互后，锁定玩家物品；当玩家离开商人 3 格后，开放玩家物品
 */
function playerItemLocker() {

    eachPlayer( player => {

        /** 玩家附近3.5格是否有商人 */
        let haveTraderNearby = player.runCommand( "execute if entity @e[r=3.5,type=bedwars:trader]" ).successCount === 1;

        /** 玩家视野内是否有商人 */
        let haveTraderInView = player.getEntitiesFromViewDirection( { type: "bedwars:trader", maxDistance: 3.5 } );

        /** 玩家视野内是否有箱子 */
        let blockInView = player.getBlockFromViewDirection( { maxDistance: 7.5 } );
        let haveChestInView = false;
        if ( blockInView ) { haveChestInView = [ "minecraft:chest", "minecraft:ender_chest" ].includes( blockInView.block.typeId ) };

        /** 当玩家附近有商人、视线内有商人并且视线内没有箱子时，则锁定，否则解锁之 */
        if ( haveTraderNearby && !haveChestInView ) { lockItem( player ); } else { unlockItem( player ); };

    } )

}

/** 为商人供应物品 */
function supplyShopitem() {

    getTraders( "blocks_and_items" ).forEach( trader => { setTraderItem( trader, blocksAndItemsShopitems ); } );
    if ( map().mode === "capture" ) {
        getTraders( "weapon_and_armor_capture" ).forEach( trader => { setTraderItem( trader, weaponAndArmorCaptureShopitems ) } )
    } else {
        getTraders( "weapon_and_armor" ).forEach( trader => { setTraderItem( trader, weaponAndArmorShopitems ); } );
    }
    getTraders( "team_upgrade" ).forEach( trader => { setTraderItem( trader, teamUpgradeShopitems ); } );

}

/** 玩家购买物品 */
function playerPurchaseItems() {
    eachValidPlayer( ( player, playerInfo ) => {
        /** 如果玩家附近 5 格有商人，再进行检测（一点小优化手段） */
        if ( player.runCommand( "execute if entity @e[r=5,type=bedwars:trader]" ).successCount === 1 ) {
            [ ...blocksAndItemsShopitems, ...weaponAndArmorCaptureShopitems, ...teamUpgradeShopitems ].forEach( shopitem => {
                /** 如果玩家拥有商店物品，则启动购买程序 */
                if ( hasItem( player, shopitem.shopitemId ) ) { tryPurchase( player, playerInfo, shopitem ); };
            } );
        };
    } );
}

/** 移除商店物品的实体形态 */
function removeShopitemEntity() {

    overworld.getEntities( { type: "minecraft:item" } ).forEach( item => {
        if ( item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:shopitem_" ) || item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:upgrade_" ) ) { item.remove( ); }
    } )

}

/** 禁止区域 */
function forbiddenArea() {

    eachAlivePlayer( player => {
        player.runCommand( `function maps/${map().id}/player_into_shop` )
    } );

}

/** ===== 方法 ===== */

/** 锁定玩家的物品栏
 * @param {Player} player 
 */
function lockItem( player ) {

    eachValidSlot( player, slot => {

        /** 如果该槽位的物品不为「始终锁定的物品」，且还未处于锁定状态，则锁定之 */
        if ( slot.lockMode === "none" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "inventory"; };

    } );

}

/** 解锁玩家的物品栏
 * @param {Player} player 
 */
function unlockItem( player ) {

    eachValidSlot( player, slot => {

        /** 如果该槽位的物品不为「始终锁定的物品」，且处于锁定状态，则解锁之 */
        if ( slot.lockMode === "inventory" && !alwaysLockInInventory.includes( slot.typeId ) ) { slot.lockMode = "none"; };

    } );

}

/** 获取具有特定家族的商人
 * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade" | "weapon_and_armor_capture"} traderType 商人类型
 */
function getTraders( traderType ) {
    return overworld.getEntities( { type: "bedwars:trader" } ).filter( trader => trader.getComponent( "minecraft:type_family" ).hasTypeFamily( `${traderType}_trader` ) );
}

/** 为商人填充物品
 * @param {Entity} trader 待填充物品的商人
 * @param {Shopitem[]} shopitems 待设置的物品组
 */
function setTraderItem( trader, shopitems ) {

    for ( let i = 0; i < shopitems.length; i++ ) {

        let shopitem = shopitems[i];
        /** @type { ContainerSlot } */ let currentSlot = trader.getComponent( "minecraft:inventory" ).container.getSlot( i );

        /** 如果：商人的物品槽位为空，或者不为空但物品ID或物品数不匹配，则重新设置该物品 */
        if ( !currentSlot.hasItem() || currentSlot.typeId !== shopitem.shopitemId || currentSlot.amount !== shopitem.itemAmount ) {
            replaceInventoryItem( trader, shopitem.shopitemId, i, { lore: shopitem.getLore(), amount: shopitem.itemAmount } );
        }
    }
}

/** 玩家购买物品
 * @param {Player} player 购买物品的玩家
 * @param {BedwarsPlayer} playerInfo 购买物品的玩家的起床战争信息
 * @param {Shopitem} shopitem 购买的物品
*/
function tryPurchase( player, playerInfo, shopitem ) {

    /** ===== 基础信息与工作 ===== */

    /** 清除玩家的商店物品 */
    player.runCommand( `clear @s ${shopitem.shopitemId}` );
    /** 资源 ID */ const resourceId = resourceTypeToResourceId( shopitem.costResourceType );
    /** 该玩家的团队升级信息 */ let teamUpgrade = playerInfo.getTeam().teamUpgrade;

    /** 判断玩家是否可以购买物品，如果有则执行successFunc函数作为成功执行的情况
     * @param {function()} successFunc 若购买成功，执行的函数
     * @param {purchaseOptions} options 可选项
     */
    function purchaseTest( successFunc, options = {} ) {

        /** --- 准备工作 --- */
        /** 默认设置 @type {purchaseOptions} */ const defaultOptions = { itemGot: false, isTeamUpgrade: false, costAdder: 0, currentLevel: 0, name: "", trapQueueFull: false };
        const allOptions = { ...defaultOptions, ...options };
        /** 实际资源花销 */ const realCostAmount = shopitem.getCostResourceAmount() + allOptions.costAdder

        /** --- 购买物品条件判定 --- */

        /** 如果玩家已拥有了此物品，或者当此物品有等级之分且玩家要购买的等级小于当前等级 + 1 时，则阻止购买 */
        if ( allOptions.itemGot || ( shopitem.tier !== 0 && shopitem.tier < allOptions.currentLevel + 1 ) ) {
            warnPlayer( player, { translate: `message.alreadyGotItem` } );
        }
        /** 如果此物品有等级之分，且玩家要购买的等级大于当前等级 + 1时，则阻止购买 */
        else if ( shopitem.tier !== 0 && shopitem.tier > allOptions.currentLevel + 1 ) { switch ( shopitem.itemType ) {
            case "axe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_axe` } ] } } ); break;
            case "pickaxe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_pickaxe` } ] } } ); break;
            case "teamUpgrade": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:upgrade_${allOptions.name}_tier_${shopitem.tier - 1}` } ] } } ); break;
        } }
        /** 如果物品类型为陷阱，且三个陷阱已排满时，则阻止购买 */
        else if ( shopitem.itemType === "trap" && allOptions.trapQueueFull ) {
            warnPlayer( player, { translate: `message.trapQueueFull` } )
        }
        /** 如果玩家资源不够，则阻止购买 */
        else if ( !hasItem( player, resourceId, { quantity: `${realCostAmount}..` } ) ) {
            warnPlayer( player, { translate: `message.resourceNotEnough`, with: { rawtext: [ { translate: `item.${resourceId}` }, { translate: `item.${resourceId}` }, { text: `${realCostAmount - getItemAmount( player, resourceId )}` } ] } } );
        }
        /** 以上条件均满足的情况下，允许购买 */
        else {

            /** 清除对应资源 */
            player.runCommand( `clear @s ${resourceId} -1 ${realCostAmount}` );

            /** 如果不为团队升级，则提醒玩家已购买的物品 */
            if ( !allOptions.isTeamUpgrade ) {
                player.playSound( "note.pling", { pitch: 2, location: player.location } );
                player.sendMessage( { translate: `message.purchaseItemsSuccessfully`, with: { rawtext: [ { translate: `message.${shopitem.shopitemId}` } ] } } );        
            }
            /** 如果为团队升级，则提醒全体玩家已购买的物品 */
            else {
                eachValidPlayer( ( teamPlayer, teamPlayerInfo ) => { if ( teamPlayerInfo.team === playerInfo.team ) {
                    teamPlayer.sendMessage( { translate: `message.purchaseTeamUpgradeSuccessfully`, with: { rawtext: [ { text: `${player.name}` }, { translate: `message.${shopitem.shopitemId}` } ] } } );
                    teamPlayer.playSound( "note.pling", { pitch: 2, location: teamPlayer.location } );
                } } )
            }
            /** 执行的成功函数 */
            successFunc();
        }
    }

    /** ===== 购买逻辑 ===== */

    switch ( shopitem.itemType ) {

        /** 类型为剑时：
         * 1. 清除木剑
         * 2. 按团队升级提供锋利附魔
         */
        case "sword":
            purchaseTest( () => {
                player.runCommand( `clear @s bedwars:wooden_sword` );
                if ( !playerInfo.getTeam( ).teamUpgrade.sharpenedSwords ) {
                    player.runCommand( `give @s ${shopitem.itemId} 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                }
                else {
                    giveItem( player, shopitem.itemId, { enchantments: [ { id: "sharpness", level: 1 } ], itemLock: "inventory" } )
                }        
            } )
            break;

        /** 类型为盔甲时：
         * 1. 记录等级（不直接装备盔甲，让盔甲检测器代为装备）
         */
        case "armor":
            let itemTier = ( shopitem.id === "chain_armor" ) ? 2 : ( ( shopitem.id === "iron_armor" ) ? 3 : ( ( shopitem.id === "diamond_armor" ) ? 4 : 1 ) )
            purchaseTest( () => {
                playerInfo.equipment.armor = itemTier; 
            }, { itemGot: playerInfo.equipment.armor >= itemTier } )
            break;

        /** 类型为斧头时：
         * 1. 记录等级（不直接给予斧头，让装备检测器代为装备）
         * 2. 按等级依次购买
         * 3. 提供附魔
         * 4. 按团队升级提供锋利附魔
         */
        case "axe":
            purchaseTest( () => {

                playerInfo.equipment.axe++;
                player.runCommand( `clear @s bedwars:wooden_axe` );
                player.runCommand( `clear @s bedwars:stone_axe` );
                player.runCommand( `clear @s bedwars:iron_axe` );

            }, { currentLevel: playerInfo.equipment.axe, name: shopitem.tier === 2 ? "wooden" : ( shopitem.tier === 3 ? "stone" : ( shopitem.tier === 4 ? "iron" : "wooden" ) ) } )
            break;

        /** 类型为镐子时：
         * 1. 记录等级（不直接给予镐子，让装备检测器代为装备）
         * 2. 按等级依次购买
         * 3. 提供附魔
         */
        case "pickaxe":

            purchaseTest( () => {

                playerInfo.equipment.pickaxe++;
                player.runCommand( `clear @s bedwars:wooden_pickaxe` );
                player.runCommand( `clear @s bedwars:iron_pickaxe` );
                player.runCommand( `clear @s bedwars:golden_pickaxe` );

            }, { currentLevel: playerInfo.equipment.pickaxe, name: shopitem.tier === 2 ? "wooden" : ( shopitem.tier === 3 ? "iron" : ( shopitem.tier === 4 ? "golden" : "wooden" ) ) } )
            break;

        /** 类型为彩色方块时：
         * 1. 重新设置 ID
         */
        case "coloredBlock":
            purchaseTest( () => {
                shopitem.setColoredId( playerInfo.team );
                player.runCommand( `give @s ${shopitem.itemId} ${shopitem.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
            } )
            break;
        
        /** 类型为击退棒时：
         * 1. 提供附魔
         */
        case "knockbackStick":
            purchaseTest( () => {
                giveItem( player, "bedwars:knockback_stick", { enchantments: [ { id: "knockback", level: 1 } ] } );
            } )
            break;

        /** 类型为剪刀时：
         * 1. 记录等级（不直接给予剪刀，让装备检测器代为装备）
         */
        case "shears":
            purchaseTest( () => {
                playerInfo.equipment.shears = 1;
            }, { itemGot: playerInfo.equipment.shears > 0 } )
            break;

        /** 类型为弓时：
         * 1. 提供附魔
         */
        case "bow":
            purchaseTest( () => {
                let enchantments = [];
                if ( shopitem.id === "bow_power" ) { enchantments = [ { id: "power", level: 1 } ]; } 
                if ( shopitem.id === "bow_power_punch" ) { enchantments = [ { id: "power", level: 1 }, { id: "punch", level: 1 } ]; };
                giveItem( player, shopitem.itemId, { enchantments: enchantments } );
            } )
            break;
        
        /** 类型为药水时
         * 1. 添加Lore <lang>
         */
        case "potion":
            purchaseTest( () => {
                switch (shopitem.id) {
                    case "potion_jump_boost": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9跳跃提升 V (0:45)" ] } ); break;
                    case "potion_speed": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9迅捷 II (0:45)" ] } ); break;
                    case "potion_invisibility": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9隐身 (0:30)" ] } ); break;
                }
            } )
            break;
        
        /** 类型为其他物品时：
         * 1. 直接给予该物品
         */
        case "other":
            purchaseTest( () => {
                player.runCommand( `give @s ${shopitem.itemId} ${shopitem.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
            } )
            break;       

        /** 类型为非陷阱的团队升级：
         * 1. 更新团队升级的信息
         */
        case "teamUpgrade": 
            switch ( shopitem.id ) {

                /** 锋利附魔 */
                case "sharpened_swords":
                    purchaseTest( () => {
                        teamUpgrade.sharpenedSwords = true;
                    }, { itemGot: teamUpgrade.sharpenedSwords, isTeamUpgrade: true } );
                    break;

                /** 盔甲强化 */
                case "reinforced_armor_tier_1": case "reinforced_armor_tier_2": case "reinforced_armor_tier_3": case "reinforced_armor_tier_4":
                    purchaseTest( () => {
                        teamUpgrade.reinforcedArmor++;
                    }, { currentLevel: teamUpgrade.reinforcedArmor, isTeamUpgrade: true, name: "reinforced_armor" } );
                    break;

                /** 疯狂矿工 */
                case "maniac_miner_tier_1": case "maniac_miner_tier_2":
                    purchaseTest( () => {
                        teamUpgrade.maniacMiner++;
                    }, { currentLevel: teamUpgrade.maniacMiner, isTeamUpgrade: true, name: "maniac_miner" } );
                    break;

                /** 资源锻炉 */
                case "forge_tier_1": case "forge_tier_2": case "forge_tier_3": case "forge_tier_4":
                    purchaseTest( () => {
                        teamUpgrade.forge++;
                    }, { currentLevel: teamUpgrade.forge, isTeamUpgrade: true, name: "forge" } );
                    break;

                /** 治愈池 */
                case "heal_pool":
                    purchaseTest( () => {
                        teamUpgrade.healPool = true;
                    }, { itemGot: teamUpgrade.healPool, isTeamUpgrade: true } );
                    break;

                /** 末影龙增益 */
                case "dragon_buff":
                    purchaseTest( () => {
                        teamUpgrade.dragonBuff = true;
                    }, { itemGot: teamUpgrade.dragonBuff, isTeamUpgrade: true } );
                    break;

            }
            break;

        /** 类型为陷阱的团队升级 */
        case "trap": 
            purchaseTest( () => {

                if ( teamUpgrade.trap1Type === "" ) { teamUpgrade.trap1Type = shopitem.id; }
                else if ( teamUpgrade.trap2Type === "" ) { teamUpgrade.trap2Type = shopitem.id; }
                else { teamUpgrade.trap3Type = shopitem.id; }

            }, { isTeamUpgrade: true, costAdder: teamUpgrade.trap1Type === "" ? 0: ( teamUpgrade.trap2Type === "" ? 1: ( teamUpgrade.trap3Type === "" ? 3: 7 ) ), trapQueueFull: !(teamUpgrade.trap3Type === "") } )
            break;
    }

}

/** 输入资源类型，返回物品 ID
 * @param {"iron"|"gold"|"diamond"|"emerald"} resourceType - 资源类型
 */
function resourceTypeToResourceId( resourceType ) {
    switch ( resourceType ) {
        case "iron": return "bedwars:iron_ingot";
        case "gold": return "bedwars:gold_ingot";
        case "diamond": return "bedwars:diamond";
        case "emerald": return "bedwars:emerald";
    }
}

/**
 * @typedef purchaseOptions
 * @property {Boolean} itemGot 玩家是否已获取该物品，若已获取则阻止购买
 * @property {Boolean} isTeamUpgrade 是否为团队升级
 * @property {Number} costAdder 资源的额外花销，玩家必须要拥有基础花销+额外花销的前提下才能购买物品
 * @property {Number} currentLevel 玩家拥有的资源的当前等级，仅当当前等级+1等于待购买的物品等级时才允许购买，否则阻止购买
 * @property {String} name 被阻止购买后，返回的需要购买的物品信息
 * @property {Boolean} trapQueueFull 陷阱是否已排满
 */

