/**
 * ===== 交易逻辑 =====
 * 【经典模式】
 * 本文件主要用于：
 * · 供应商人的物品；
 * · 玩家购买物品的逻辑；
 * · 移除商品掉落出的掉落物；
 * · 禁止玩家进入商人区域。
 */

import { getItemAmount, getValidItems, giveItem, hasItem } from "../../methods/itemManager";
import { eachAlivePlayer, eachValidPlayer, warnPlayer } from "../../methods/bedwarsPlayer";
import { map } from "../../methods/bedwarsMaps";

/** 交易功能 */
export function trading() {

    // ===== 玩家购买物品 =====
    eachValidPlayer( ( player, playerInfo ) => {

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
                /** 默认设置 @type {purchaseOptions} */
                const defaultOptions = {
                    itemGot: false,
                    isTeamUpgrade: false,
                    costAdder: 0,
                    currentLevel: 0,
                    name: "",
                    trapQueueFull: false
                };
                const allOptions = { ...defaultOptions, ...options };
                /** 实际资源花销 */ const realCostAmount = shopitem.getCostResourceAmount() + allOptions.costAdder

                /** --- 购买物品条件判定 --- */

                /** 如果物品类型为陷阱，且三个陷阱已排满时，则阻止购买 */
                if ( shopitem.itemType === "trap" && allOptions.trapQueueFull ) {
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

            // 购买逻辑
            switch ( shopitem.itemType ) {
                                                
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
    
    // ===== 禁止玩家进入商人区域 =====
    if ( !map().playerCouldIntoShop ) {
        eachAlivePlayer( player => {
            player.runCommand( `function maps/${map().id}/player_into_shop` )
        } );
    }

}
