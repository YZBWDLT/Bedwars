/**
 * ===== 交易逻辑 =====
 * 【经典模式】
 * 本文件主要用于：
 * · 供应商人的物品；
 * · 玩家购买物品的逻辑；
 * · 移除商品掉落出的掉落物；
 * · 禁止玩家进入商人区域。
 */

import { ContainerSlot } from "@minecraft/server";
import { getItemAmount, getValidItems, giveItem, hasItem, replaceInventoryItem } from "../../methods/itemManager";
import { overworld } from "../../methods/positionManager";
import { eachAlivePlayer, eachValidPlayer, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

/** 交易功能 */
export function trading() {

    // ===== 为商人供应物品 =====
    map().validShopitems.forEach( shopitem => {

        /** 获取对应商人 */ const traders = map().getTraders( shopitem.traderType );
        /** 商品所处物品栏槽位 */ const slot = shopitem.slot;
        /** 商品 ID */ const shopitemId = shopitem.shopitemId;
        /** 商品数目 */ const amount = shopitem.itemAmount;

        traders.forEach( trader => {
            /** 商人对应槽位 @type { ContainerSlot } */ const traderSlot = trader.getComponent( "minecraft:inventory" ).container.getSlot( slot );
            
            if ( !traderSlot.hasItem() || traderSlot.typeId !== shopitemId || traderSlot.amount !== amount ) {
                replaceInventoryItem( trader, shopitemId, slot, { lore: shopitem.getLore(), amount: amount } );
            }
        } )
    } );

    // ===== 玩家购买物品 =====
    eachValidPlayer( ( player, playerInfo ) => {
        /** 获取玩家拥有的商品 */
        function getShopitem() {
            /** 所有地图可用商品 */ const shopitems = map().validShopitems;
            // 先在鼠标光标搜索
            let shopitemInCursor = shopitems.find( shopitem => player.getComponent( "minecraft:cursor_inventory" ).item?.typeId === shopitem.shopitemId )
            if ( shopitemInCursor !== undefined ) {
                return shopitemInCursor;
            }
            // 如果未能搜索到，在物品栏搜索
            else {
                let shopitemInInventory = shopitems.find( shopitem => getValidItems( player ).find( validItem => validItem.item.typeId === shopitem.shopitemId ) )
                if ( shopitemInInventory !== undefined ) {
                    return shopitemInInventory;
                }
            }
        }
        /** 输入资源类型，返回物品 ID  @param {"iron"|"gold"|"diamond"|"emerald"} resourceType - 资源类型 */
        function resourceTypeToResourceId( resourceType ) {
            switch ( resourceType ) {
                case "iron": return "bedwars:iron_ingot";
                case "gold": return "bedwars:gold_ingot";
                case "diamond": return "bedwars:diamond";
                case "emerald": return "bedwars:emerald";
            }
        }
        /** 玩家选中的商品 */ const shopitem = getShopitem();

        // 如果：1. 玩家拥有商品；2. 玩家附近有商人，则启动购买程序
        if (
            player.runCommand( `execute if entity @e[r=5,type=bedwars:trader]` ).successCount === 1 // 有商人在玩家附近
            && shopitem !== undefined // 玩家有商品
        ) {

            // === 购买主程序 ===

            /**
             * @typedef purchaseOptions
             * @property {Boolean} itemGot 玩家是否已获取该物品，若已获取则阻止购买
             * @property {Boolean} isTeamUpgrade 是否为团队升级
             * @property {Number} costAdder 资源的额外花销，玩家必须要拥有基础花销+额外花销的前提下才能购买物品
             * @property {Number} currentLevel 玩家拥有的资源的当前等级，仅当当前等级+1等于待购买的物品等级时才允许购买，否则阻止购买
             * @property {String} name 被阻止购买后，返回的需要购买的物品信息
             * @property {Boolean} trapQueueFull 陷阱是否已排满
             */
            /** 资源 ID */ const resourceId = resourceTypeToResourceId( shopitem.costResourceType );
            /** 该玩家的团队升级信息 */ let teamUpgrade = playerInfo.getTeam().teamUpgrade;
            /** 判断玩家是否可以购买物品，如果有则执行successFunc函数作为成功执行的情况 @param {function()} successFunc 若购买成功，执行的函数 @param {purchaseOptions} options 可选项 */
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

            // 清除玩家商品
            player.runCommand( `clear @s ${shopitem.shopitemId}` );
            // 购买逻辑
            switch ( shopitem.itemType ) {

                // 类型为剑时：1. 清除木剑 2. 按团队升级提供锋利附魔 
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
        
                // 类型为盔甲时： 1. 记录等级（不直接装备盔甲，让盔甲检测器代为装备）
                case "armor":
                    let itemTier = ( shopitem.id === "chain_armor" ) ? 2 : ( ( shopitem.id === "iron_armor" ) ? 3 : ( ( shopitem.id === "diamond_armor" ) ? 4 : 1 ) )
                    purchaseTest( () => {
                        playerInfo.equipment.armor = itemTier; 
                    }, { itemGot: playerInfo.equipment.armor >= itemTier } )
                break;
        
                // 类型为斧头时： 1. 记录等级（不直接给予斧头，让装备检测器代为装备） 2. 按等级依次购买 3. 提供附魔 4. 按团队升级提供锋利附魔
                case "axe":
                    purchaseTest( () => {
                        playerInfo.equipment.axe++;
                        player.runCommand( `clear @s bedwars:wooden_axe` );
                        player.runCommand( `clear @s bedwars:stone_axe` );
                        player.runCommand( `clear @s bedwars:iron_axe` );
                    }, { currentLevel: playerInfo.equipment.axe, name: shopitem.tier === 2 ? "wooden" : ( shopitem.tier === 3 ? "stone" : ( shopitem.tier === 4 ? "iron" : "wooden" ) ) } )
                break;
        
                // 类型为镐子时： 1. 记录等级（不直接给予镐子，让装备检测器代为装备） 2. 按等级依次购买 3. 提供附魔
                case "pickaxe":
                    purchaseTest( () => {
                        playerInfo.equipment.pickaxe++;
                        player.runCommand( `clear @s bedwars:wooden_pickaxe` );
                        player.runCommand( `clear @s bedwars:iron_pickaxe` );
                        player.runCommand( `clear @s bedwars:golden_pickaxe` );
                    }, { currentLevel: playerInfo.equipment.pickaxe, name: shopitem.tier === 2 ? "wooden" : ( shopitem.tier === 3 ? "iron" : ( shopitem.tier === 4 ? "golden" : "wooden" ) ) } )
                break;
        
                // 类型为彩色方块时： 1. 重新设置 ID
                case "coloredBlock":
                    purchaseTest( () => {
                        shopitem.setColoredId( playerInfo.team );
                        player.runCommand( `give @s ${shopitem.itemId} ${shopitem.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                    } )
                break;
                
                // 类型为击退棒时： 1. 提供附魔
                case "knockbackStick":
                    purchaseTest( () => {
                        giveItem( player, "bedwars:knockback_stick", { enchantments: [ { id: "knockback", level: 1 } ] } );
                    } );
                break;
        
                // 类型为剪刀时： 1. 记录等级（不直接给予剪刀，让装备检测器代为装备）
                case "shears":
                    purchaseTest( () => {
                        playerInfo.equipment.shears = 1;
                    }, { itemGot: playerInfo.equipment.shears > 0 } )
                break;
        
                // 类型为弓时： 1. 提供附魔
                case "bow":
                    purchaseTest( () => {
                        let enchantments = [];
                        if ( shopitem.id === "bow_power" ) { enchantments = [ { id: "power", level: 1 } ]; } 
                        if ( shopitem.id === "bow_power_punch" ) { enchantments = [ { id: "power", level: 1 }, { id: "punch", level: 1 } ]; };
                        giveItem( player, shopitem.itemId, { enchantments: enchantments } );
                    } )
                break;
                
                // 类型为药水时 1. 添加Lore <lang>
                case "potion":
                    purchaseTest( () => {
                        switch (shopitem.id) {
                            case "potion_jump_boost": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9跳跃提升 V (0:45)" ] } ); break;
                            case "potion_speed": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9迅捷 II (0:45)" ] } ); break;
                            case "potion_invisibility": giveItem( player, shopitem.itemId, { lore: [ "", "§r§9隐身 (0:30)" ] } ); break;
                        }
                    } )
                break;
                
                // 类型为其他物品时： 1. 直接给予该物品
                case "other":
                    purchaseTest( () => {
                        player.runCommand( `give @s ${shopitem.itemId} ${shopitem.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                    } )
                break;       
        
                // 类型为非陷阱的团队升级： 1. 更新团队升级的信息
                case "teamUpgrade": 
                    switch ( shopitem.id ) {
        
                        // 锋利附魔
                        case "sharpened_swords":
                            purchaseTest( () => {
                                teamUpgrade.sharpenedSwords = true;
                            }, { itemGot: teamUpgrade.sharpenedSwords, isTeamUpgrade: true } );
                        break;
        
                        // 盔甲强化
                        case "reinforced_armor_tier_1": case "reinforced_armor_tier_2": case "reinforced_armor_tier_3": case "reinforced_armor_tier_4":
                            purchaseTest( () => {
                                teamUpgrade.reinforcedArmor++;
                            }, { currentLevel: teamUpgrade.reinforcedArmor, isTeamUpgrade: true, name: "reinforced_armor" } );
                        break;
        
                        // 疯狂矿工
                        case "maniac_miner_tier_1": case "maniac_miner_tier_2":
                            purchaseTest( () => {
                                teamUpgrade.maniacMiner++;
                            }, { currentLevel: teamUpgrade.maniacMiner, isTeamUpgrade: true, name: "maniac_miner" } );
                        break;
        
                        // 资源锻炉
                        case "forge_tier_1": case "forge_tier_2": case "forge_tier_3": case "forge_tier_4":
                            purchaseTest( () => {
                                teamUpgrade.forge++;
                            }, { currentLevel: teamUpgrade.forge, isTeamUpgrade: true, name: "forge" } );
                        break;
        
                        // 治愈池
                        case "heal_pool":
                            purchaseTest( () => {
                                teamUpgrade.healPool = true;
                            }, { itemGot: teamUpgrade.healPool, isTeamUpgrade: true } );
                        break;
        
                        // 末影龙增益
                        case "dragon_buff":
                            purchaseTest( () => {
                                teamUpgrade.dragonBuff = true;
                            }, { itemGot: teamUpgrade.dragonBuff, isTeamUpgrade: true } );
                        break;
        
                    }
                    break;
        
                // 类型为陷阱的团队升级
                case "trap": 
                    purchaseTest( () => {
        
                        if ( teamUpgrade.trap1Type === "" ) { teamUpgrade.trap1Type = shopitem.id; }
                        else if ( teamUpgrade.trap2Type === "" ) { teamUpgrade.trap2Type = shopitem.id; }
                        else { teamUpgrade.trap3Type = shopitem.id; }
        
                    }, { isTeamUpgrade: true, costAdder: teamUpgrade.trap1Type === "" ? 0: ( teamUpgrade.trap2Type === "" ? 1: ( teamUpgrade.trap3Type === "" ? 3: 7 ) ), trapQueueFull: !(teamUpgrade.trap3Type === "") } )
                break;
            }
            
        }
    } );

    // ===== 移除商品实体 =====
    overworld.getEntities( { type: "minecraft:item" } ).forEach( item => {
        if ( item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:shopitem_" ) || item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:upgrade_" ) ) { item.remove( ); }
    } );

    // ===== 禁止玩家进入商人区域 =====
    if ( !map().playerCouldIntoShop ) {
        eachAlivePlayer( player => {
            player.runCommand( `function maps/${map().id}/player_into_shop` )
        } );
    }

}
