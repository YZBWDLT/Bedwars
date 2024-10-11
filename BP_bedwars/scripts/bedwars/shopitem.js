/** 商店物品 */

import { Player } from "@minecraft/server";
import { overworld } from "./constants";
import { BedwarsPlayer, eachValidPlayer, entityHasItemAmount, giveItem, itemInfo, resourceTypeToResourceId, warnPlayer } from "./methods"
import { map } from "./maps.js"

/** 商店物品类型列表 */
export const shopitemType = [ "sword", "armor", "axe", "pickaxe", "teamUpgrade", "coloredBlock", "knockbackStick", "shears", "bow", "potion", "trap", "other" ]

/** 可用商人类型列表 */
export const traderType = [ "blocks_and_items", "weapon_and_armor", "team_upgrade" ];

/** 【类】商店物品类 */
export class Shopitem{

    /** 【属性】ID */
    id = "";

    /** 【属性】商店物品 ID */
    shopitemId = ""

    /** 【属性】物品类型 @type {"blocks_and_items"|"weapon_and_armor"|"team_upgrade"} */
    traderType = "blocks_and_items";

    /** 【属性】购买时消耗的资源类型 @type {"iron" | "gold" | "diamond" | "emerald"} */
    costResourceType = "iron";

    /** 【属性】购买时消耗的资源数量 */
    costResourceAmount = 1;

    /** 【属性】购买时获得的物品数量（也是显示在商店中的物品数目） */
    itemAmount = 1;

    /** 【属性】显示在商店中的物品描述 */
    description = "";

    /** 【属性】物品等级，如果为 0 则为不分等级 @type {0|1|2|3|4} */
    tier = 0;

    /** 【属性】是否为最高等级的物品（这将影响物品在商店中的显示方式） */
    isHighestTier = true;

    /** 【属性】是否在死亡后降低等级（这将影响物品在商店中的显示方式） */
    loseTierUponDeath = false;

    /** 【属性】特殊物品 ID，如果为""则为采用自动生成的 ID */
    itemId = "";

    /** 【属性】商店物品类型 @type {"sword"|"armor"|"axe"|"pickaxe"|"teamUpgrade"|"coloredBlock"|"knockbackStick"|"shears"|"bow"|"potion"|"trap"|"other"} */
    itemType = "other";

    /** 【属性】在Solo模式下消耗的资源数量，设置为 0 或负数则为采用默认的数值 */
    costResourceAmountInSolo = 0;

    /** 【构建器】
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"} traderType - 对应的商人类型
     * @param {String} id - 物品 ID（自动生成商店物品 ID 为 bedwars:shopitem_(id) ）
     * @param {"iron" | "gold" | "diamond" | "emerald"} costResourceType - 购买时消耗的资源类型
     * @param {Number} costResourceAmount - 购买时消耗的资源数量（常规模式下）
     * @param {Number} itemAmount - 购买时获得的物品数量
     * @param {{
     * description: String, 
     * tier: 0 | 1 | 2 | 3 | 4, 
     * isHighestTier: Boolean, 
     * loseTierUponDeath: Boolean, 
     * itemId: String, 
     * itemType: "sword"|"armor"|"axe"|"pickaxe"|"teamUpgrade"|"coloredBlock"|"knockbackStick"|"shears"|"bow"|"potion"|"trap"|"other"
     * costResourceAmountInSolo: Number
     * }} options - 其他可选内容
     */
    constructor( id, traderType, costResourceType, costResourceAmount, itemAmount, options = {} ) {
        this.traderType = traderType;
        this.id = id;
        this.itemId = `bedwars:${this.id}`;
        if ( options.itemId !== undefined ) { this.itemId = `${options.itemId}` };
        this.costResourceType = costResourceType;
        this.costResourceAmount = costResourceAmount;
        if ( options.costResourceAmountInSolo !== undefined ) { this.costResourceAmountInSolo = options.costResourceAmountInSolo; }
        this.itemAmount = itemAmount;
        if ( options.description !== undefined ) { this.description = options.description; }
        if ( options.tier !== undefined ) { this.tier = options.tier; }
        if ( options.isHighestTier !== undefined ) { this.isHighestTier = options.isHighestTier; }
        if ( options.loseTierUponDeath !== undefined ) { this.loseTierUponDeath = options.loseTierUponDeath; }
        if ( options.itemType !== undefined ) { this.itemType = options.itemType }
        this.shopitemId = ( this.itemType === "teamUpgrade" || this.itemType === "trap" ) ? `bedwars:upgrade_${this.id}` : `bedwars:shopitem_${this.id}`;
    };

    /** 【方法】获取该物品实际消耗价格。
     * @description 因为在构建时，map还没有创立，所以不能直接将map().isSolo() ? ... : ... 写进构建器，会出现依赖循环
     */
    getCostResourceAmount() {
        /** 如果地图为Solo模式，并且指定了有效的Solo特殊价格，则使用此价格 */
        if ( map().isSolo() && this.costResourceAmountInSolo > 0 ) { return this.costResourceAmountInSolo }
        /** 否则，采用正常价格 */
        else { return this.costResourceAmount }
    }

    /** 【方法】为有色方块设立单独的物品 ID
     * @param {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"} color - 要设定的颜色
     */
    setColoredId( color ) {
        if ( this.itemType === "coloredBlock" ) { this.itemId = `bedwars:${color}_${this.id}` }
    };

    /** 【方法】按照所给定的物品属性自动生成适合的 Lore 显示在商店界面 */
    generateLore( ) {
        let resourceColor; let resourceName;
        switch ( this.costResourceType ) {
            case "iron": resourceColor = "§f"; resourceName = "铁锭"; break;
            case "gold": resourceColor = "§6"; resourceName = "金锭"; break;
            case "diamond": resourceColor = "§b"; resourceName = "钻石"; break;
            case "emerald": resourceColor = "§2"; resourceName = "绿宝石"; break;
            default: resourceColor = ""; resourceName = ""; break;
        };


        // 如果是有等级的物品：
        if ( this.tier !== 0 ) {

            // 设置等级名称
            let itemTierName = ""; 
            switch ( this.tier ) {
                case 1: itemTierName = "§eI"; break;
                case 2: itemTierName = "§eII"; break;
                case 3: itemTierName = "§eIII"; break;
                case 4: itemTierName = "§eIV"; break;
                default: break;
            };
            // 可以降级的，显示等级和降级提示
            if ( this.loseTierUponDeath === true ) {
                // 不是最高级的道具，显示为可升级
                if ( this.isHighestTier !== true ) {
                    return [ "", `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 此道具可升级。`, "§r§7 死亡将会导致损失一级！", "", "§r§7 每次重生时，至少为最低等级。" ]
                // 反之显示为最高级
                } else {
                    return [ "", `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 此道具为最高等级。`, "§r§7 死亡将会导致损失一级！", "", "§r§7 每次重生时，至少为最低等级。" ]
                }
            // 不可以降级的，显示等级
            } else {
                return [ "", `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 ${this.description}` ]
            }

        // 如果不是有等级的物品：
        } else {

            // 有描述的，显示描述
            if ( this.description !== "" ) {
                return [ "", `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}`, "", `§r§7 ${this.description}` ]
            } else {
                return [ "", `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}` ]
            }

        }
    };

    /** 【方法】将物品放入对应商人的物品栏之中
     * @param {Number} slotLocation - 欲放置的槽位
     */
    setTraderItem( slotLocation ) {

        /** 预放置物品的基本属性 */
        let item = itemInfo( this.shopitemId, { amount: this.itemAmount, lore: this.generateLore() } )

        /** 
         * 获取物品可于何商人的物品栏中放置，例如具有"blocks_and_items"的物品将放入到所有具有"blocks_and_items_trader"的家族的商人。
         * 这里将返回符合条件的所有商人列表
         */
        let traders = overworld.getEntities( { type: "bedwars:trader" } ).filter( trader => { return trader.getComponent( "minecraft:type_family" ).hasTypeFamily( `${this.traderType}_trader` ) } );

        /** 对于每个商人，放置物品 */
        traders.forEach( trader => {

            /** 获取商人的物品栏信息，和特定物品栏槽位信息 */
            let entityInventory = trader.getComponent( "minecraft:inventory" ).container;
            let entityInventorySlot = entityInventory.getItem( slotLocation );

            /**
             * 如果该槽位是空槽位、商店物品 ID 不对应或商店物品数目不对应，则重新放置
             * 这里分开，是防止 undefined 影响后面的代码
             */
            if ( entityInventorySlot === undefined ) {
                entityInventory.setItem( slotLocation, item )
            } else if ( entityInventorySlot.typeId !== this.shopitemId || entityInventorySlot.amount !== this.itemAmount ) {
                entityInventory.setItem( slotLocation, item )
            }
        } )
    };

    /** 【方法】玩家购买物品
     * @param {Player} player - 购买的玩家
     */
    playerPurchaseItems( player ) {

        /** 获取资源 ID */ let resourceId = resourceTypeToResourceId( this.costResourceType );

        /** 判断玩家是否可以购买物品，如果有则执行callback函数作为成功执行的情况
         * @param {{ itemGot: Boolean, isTeamUpgrade: Boolean, costAdder: Number, currentLevel: Number, name: String, trapQueueFull: Boolean }} options */
        let purchaseTest = ( callback, options = {} ) => {
            const defaultOptions = { itemGot: false, isTeamUpgrade: false, costAdder: 0, currentLevel: 0, name: "", trapQueueFull: false };
            const allOptions = { ...defaultOptions, ...options }

            let realCostAmount = this.getCostResourceAmount() + allOptions.costAdder

            /** 如果玩家已拥有了此物品，或者当此物品有等级之分且玩家要购买的等级小于当前等级 + 1 时，则阻止购买 */
            if ( allOptions.itemGot || ( this.tier !== 0 && this.tier < allOptions.currentLevel + 1 ) ) {
                warnPlayer( player, { translate: `message.alreadyGotItem` } );
            }
            /** 如果此物品有等级之分，且玩家要购买的等级大于当前等级 + 1时，则阻止购买 */
            else if ( this.tier !== 0 && this.tier > allOptions.currentLevel + 1 ) { switch ( this.itemType ) {
                case "axe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_axe` } ] } } ); break;
                case "pickaxe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_pickaxe` } ] } } ); break;
                case "teamUpgrade": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:upgrade_${allOptions.name}_tier_${this.tier - 1}` } ] } } ); break;
            } }
            /** 如果物品类型为陷阱，且三个陷阱已排满时，则阻止购买 */
            else if ( this.itemType === "trap" && allOptions.trapQueueFull ) {
                warnPlayer( player, { translate: `message.trapQueueFull` } )
            }
            /** 如果玩家资源不够，则阻止购买 */
            else if ( player.runCommand( `execute if entity @s[hasitem={item=${resourceId},quantity=${realCostAmount}..}]` ).successCount === 0 ) {
                warnPlayer( player, { translate: `message.resourceNotEnough`, with: { rawtext: [ { translate: `item.${resourceId}` }, { translate: `item.${resourceId}` }, { text: `${realCostAmount - entityHasItemAmount( player, resourceId )}` } ] } } );
            }
            /** 以上条件均满足的情况下，允许购买 */
            else {
                player.runCommand( `clear @s ${resourceId} -1 ${realCostAmount}` );
                if ( !allOptions.isTeamUpgrade ) {
                    player.playSound( "note.pling", { pitch: 2, location: player.location } );
                    player.sendMessage( { translate: `message.purchaseItemsSuccessfully`, with: { rawtext: [ { translate: `message.${this.shopitemId}` } ] } } );        
                } else {
                    eachValidPlayer( teamPlayer => { if ( teamPlayer.bedwarsInfo.team === player.bedwarsInfo.team ) {
                        teamPlayer.sendMessage( { translate: `message.purchaseTeamUpgradeSuccessfully`, with: { rawtext: [ { text: `${player.name}` }, { translate: `message.${this.shopitemId}` } ] } } );
                        teamPlayer.playSound( "note.pling", { pitch: 2, location: teamPlayer.location } );
                    } } )
                }
                callback();
            }
        }
        /** 检测玩家是否拥有商店物品。如果有商店物品：清除商店物品，并执行购买的逻辑。 */
        if ( player.runCommand( `execute if entity @s[hasitem={item=${this.shopitemId}}]` ).successCount !== 0 ) {

            player.runCommand( `clear @s ${this.shopitemId}` );
            /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;

            if ( playerInfo === undefined ) { warnPlayer( player, { translate: `message.invalidPlayer.purchaseItems` } ) }
            else {
                let playerTeamUpgrade = playerInfo.getTeam( ).teamUpgrade;
                switch ( this.itemType ) {
                    case "sword": /** 类型为剑，【清除木剑】【按团队升级提供锋利附魔】 */
                        purchaseTest( () => {
                            player.runCommand( `clear @s bedwars:wooden_sword` );
                            if ( !playerInfo.getTeam( ).teamUpgrade.sharpenedSwords ) {
                                player.runCommand( `give @s ${this.itemId} 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                            } else {
                                giveItem( player, this.itemId, { enchantments: [ { id: "sharpness", level: 1 } ], itemLock: "inventory" } )
                            }        
                        } )
                        break;
                    case "armor": /** 类型为盔甲，【记录等级】 */
                        let itemTier = ( this.id === "chain_armor" ) ? 2 : ( ( this.id === "iron_armor" ) ? 3 : ( ( this.id === "diamond_armor" ) ? 4 : 1 ) )
                        purchaseTest( () => {
                            playerInfo.equipment.armor = itemTier; 
                        }, { itemGot: playerInfo.equipment.armor >= itemTier } )
                        break;
                    case "axe": /** 类型为斧头，【记录等级】【按等级依次购买】【提供附魔】【按团队升级提供锋利附魔】 */
                        purchaseTest( () => {

                            playerInfo.equipment.axe++;
                            player.runCommand( `clear @s bedwars:wooden_axe` );
                            player.runCommand( `clear @s bedwars:stone_axe` );
                            player.runCommand( `clear @s bedwars:iron_axe` );

                        }, { currentLevel: playerInfo.equipment.axe, name: this.tier === 2 ? "wooden" : ( this.tier === 3 ? "stone" : ( this.tier === 4 ? "iron" : "wooden" ) ) } )
                        break;
                    case "pickaxe": /** 类型为镐子，【记录等级】【按等级依次购买】【提供附魔】 */

                        purchaseTest( () => {

                            playerInfo.equipment.pickaxe++;
                            player.runCommand( `clear @s bedwars:wooden_pickaxe` );
                            player.runCommand( `clear @s bedwars:iron_pickaxe` );
                            player.runCommand( `clear @s bedwars:golden_pickaxe` );

                        }, { currentLevel: playerInfo.equipment.pickaxe, name: this.tier === 2 ? "wooden" : ( this.tier === 3 ? "iron" : ( this.tier === 4 ? "golden" : "wooden" ) ) } )
                        break;
                    case "coloredBlock": /** 类型为彩色方块，【重设ID】 */
                        purchaseTest( () => {
                            this.setColoredId( playerInfo.team )
                            player.runCommand( `give @s ${this.itemId} ${this.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                        } )
                        break;
                    case "knockbackStick": /** 类型为击退棒，【提供附魔】 */
                        purchaseTest( () => {
                            giveItem( player, "bedwars:knockback_stick", { enchantments: [ { id: "knockback", level: 1 } ] } );
                        } )
                        break;
                    case "shears": /** 类型为剪刀，【记录等级】 */
                        purchaseTest( () => {
                            playerInfo.equipment.shears = 1;
                        }, { itemGot: playerInfo.equipment.shears > 0 } )
                        break;
                    case "bow": /** 类型为弓，【提供附魔】 */
                        purchaseTest( () => {
                            let enchantments = [];
                            if ( this.id === "bow_power" ) { enchantments = [ { id: "power", level: 1 } ]; } 
                            if ( this.id === "bow_power_punch" ) { enchantments = [ { id: "power", level: 1 }, { id: "punch", level: 1 } ]; };
                            giveItem( player, this.itemId, { enchantments: enchantments } );
                        } )
                        break;
                    case "potion": /** 类型为药水，【添加Lore】 <lang> */
                        purchaseTest( () => {
                            switch (this.id) {
                                case "potion_jump_boost": giveItem( player, this.itemId, { lore: [ "", "§r§9跳跃提升 V (0:45)" ] } ); break;
                                case "potion_speed": giveItem( player, this.itemId, { lore: [ "", "§r§9迅捷 II (0:45)" ] } ); break;
                                case "potion_invisibility": giveItem( player, this.itemId, { lore: [ "", "§r§9隐身 (0:30)" ] } ); break;
                            }
                        } )
                        break;
                    case "other": /** 类型为其他 */
                        purchaseTest( () => {
                            player.runCommand( `give @s ${this.itemId} ${this.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                        } )
                        break;                    
                    case "teamUpgrade": /** 类型为非陷阱的团队升级 */
                        switch (this.id) {
                            case "sharpened_swords": /** 锋利附魔 */
                                purchaseTest( () => {
                                    playerTeamUpgrade.sharpenedSwords = true;
                                }, { itemGot: playerTeamUpgrade.sharpenedSwords, isTeamUpgrade: true } ); break;
                            /** 盔甲强化 */
                            case "reinforced_armor_tier_1": case "reinforced_armor_tier_2": case "reinforced_armor_tier_3": case "reinforced_armor_tier_4":
                                purchaseTest( () => {
                                    playerTeamUpgrade.reinforcedArmor++;
                                }, { currentLevel: playerTeamUpgrade.reinforcedArmor, isTeamUpgrade: true, name: "reinforced_armor" } ); break;
                            /** 疯狂矿工 */
                            case "maniac_miner_tier_1": case "maniac_miner_tier_2":
                                purchaseTest( () => {
                                    playerTeamUpgrade.maniacMiner++;
                                }, { currentLevel: playerTeamUpgrade.maniacMiner, isTeamUpgrade: true, name: "maniac_miner" } ); break;
                            /** 资源锻炉 */
                            case "forge_tier_1": case "forge_tier_2": case "forge_tier_3": case "forge_tier_4":
                                purchaseTest( () => {
                                    playerTeamUpgrade.forge++;
                                }, { currentLevel: playerTeamUpgrade.forge, isTeamUpgrade: true, name: "forge" } ); break;
                            /** 治愈池 */
                            case "heal_pool":
                                purchaseTest( () => {
                                    playerTeamUpgrade.healPool = true;
                                }, { itemGot: playerTeamUpgrade.healPool, isTeamUpgrade: true } ); break;
                            /** 末影龙增益 */
                            case "dragon_buff":
                                purchaseTest( () => {
                                    playerTeamUpgrade.dragonBuff = true;
                                }, { itemGot: playerTeamUpgrade.dragonBuff, isTeamUpgrade: true } ); break;
                            }
                        break;
                    case "trap": /** 类型为陷阱的团队升级 */
                        purchaseTest( () => {

                            if ( playerTeamUpgrade.trap1Type === "" ) { playerTeamUpgrade.trap1Type = this.id; }
                            else if ( playerTeamUpgrade.trap2Type === "" ) { playerTeamUpgrade.trap2Type = this.id; }
                            else { playerTeamUpgrade.trap3Type = this.id; }

                        }, { isTeamUpgrade: true, costAdder: playerTeamUpgrade.trap1Type === "" ? 0: ( playerTeamUpgrade.trap2Type === "" ? 1: ( playerTeamUpgrade.trap3Type === "" ? 3: 7 ) ), trapQueueFull: !(playerTeamUpgrade.trap3Type === "") } )
                        break;
                }
            }
        }
    }

}

/** 方块与物品商品列表 */
export const blocksAndItemsShopitems = [
    new Shopitem( "wool", "blocks_and_items", "iron", 4, 16, { itemType: "coloredBlock", description: "可用于搭桥穿越岛屿。搭出的桥的颜色会对应你的队伍颜色。" } ),
    new Shopitem( "stained_hardened_clay", "blocks_and_items", "iron", 12, 16, { itemType: "coloredBlock", description: "用于保卫床的基础方块。" } ),
    new Shopitem( "blast_proof_glass", "blocks_and_items", "iron", 12, 4, { itemType: "coloredBlock", description: "免疫爆炸。" } ),
    new Shopitem( "end_stone", "blocks_and_items", "iron", 24, 12, { description: "用于保卫床的坚固方块。" } ),
    new Shopitem( "planks", "blocks_and_items", "gold", 4, 16, { description: "为床提供保护的不错块选。\n 面对镐子的攻势也很强势。", itemId: "bedwars:oak_planks" } ),
    new Shopitem( "ladder", "blocks_and_items", "gold", 4, 8, { description: "可用于救助困在树上的猫猫。", itemId: "minecraft:ladder" } ),
    new Shopitem( "obsidian", "blocks_and_items", "emerald", 4, 4, { description: "为你的床提供超级保护。" } ),

    new Shopitem( "potion_speed", "blocks_and_items", "emerald", 1, 1, { description: "§9速度 II (0:30)", itemType: "potion" } ),
    new Shopitem( "potion_jump_boost", "blocks_and_items", "emerald", 1, 1, { description: "§9跳跃提升 V (0:45)", itemType: "potion" } ),
    new Shopitem( "potion_invisibility", "blocks_and_items", "emerald", 2, 1, { description: "§9完全隐身 (0:30)", itemType: "potion" } ),

    new Shopitem( "golden_apple", "blocks_and_items", "gold", 3, 1, { description: "疗伤好物。", itemId: "minecraft:golden_apple" } ),
    new Shopitem( "bed_bug", "blocks_and_items", "iron", 24, 1, { description: "在雪球砸中的地方产生一只持续\n 15 秒的蠹虫，为你吸引火力。" } ),
    new Shopitem( "dream_defender", "blocks_and_items", "iron", 120, 1, { description: "让铁傀儡成为你的守家好帮手。\n 持续 4 分钟。" } ),
    new Shopitem( "fireball", "blocks_and_items", "iron", 40 , 1, { description: "右键发射！击飞在桥上行走的敌人！" } ),
    new Shopitem( "tnt", "blocks_and_items", "gold", 8, 1, { description: "放下后即点燃。要炸毁什么\n 东西，它很在行！", costResourceAmountInSolo: 4 } ),
    new Shopitem( "ender_pearl", "blocks_and_items", "emerald", 4, 1, { description: "快速打入敌人内部。", itemId: "minecraft:ender_pearl" } ),
    new Shopitem( "water_bucket", "blocks_and_items", "gold", 3, 1, { description: "使来犯敌人减速的良好选择。\n 也能应对 TNT 的威胁。", itemId: "minecraft:water_bucket", costResourceAmountInSolo: 2 } ),
    new Shopitem( "bridge_egg", "blocks_and_items", "emerald", 1, 1, { description: "能够沿着其扔出的轨迹\n 创造一座桥梁。" } ),
    new Shopitem( "magic_milk", "blocks_and_items", "gold", 4, 1, { description: "饮用后能够在 30 秒内\n 防止触发敌人的陷阱。" } ),
    new Shopitem( "sponge", "blocks_and_items", "gold", 3, 4, { description: "吸水好手。", itemId: "minecraft:sponge", costResourceAmountInSolo: 2 } )
]
    
/** 武器与盔甲商品列表 */
export const weaponAndArmorShopitems = [ 
    new Shopitem( "stone_sword", "weapon_and_armor", "iron", 10, 1, { itemType: "sword" } ),
    new Shopitem( "iron_sword", "weapon_and_armor", "gold", 7, 1, { itemType: "sword" } ),
    new Shopitem( "diamond_sword", "weapon_and_armor", "emerald", 3, 1, { itemType: "sword", costResourceAmountInSolo: 4 } ),
    new Shopitem( "knockback_stick", "weapon_and_armor", "gold", 5, 1, { itemType: "knockbackStick" } ),
    
    new Shopitem( "chain_armor", "weapon_and_armor", "iron", 24, 1, { description: "获得永久的锁链护腿靴子。", itemType: "armor" } ),
    new Shopitem( "iron_armor", "weapon_and_armor", "gold", 12, 1, { description: "获得永久的铁护腿靴子。", itemType: "armor" } ),
    new Shopitem( "diamond_armor", "weapon_and_armor", "emerald", 6, 1, { description: "钻石护腿和靴子将一直伴你左右。", itemType: "armor" } ),
    new Shopitem( "shears", "weapon_and_armor", "iron", 20, 1, { description: "破坏羊毛的得力工具。\n 该物品是永久的。", itemType: "shears" } ),
    new Shopitem( "wooden_axe", "weapon_and_armor", "iron", 10, 1, { tier: 1, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "stone_axe", "weapon_and_armor", "iron", 10, 1, { tier: 2, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "iron_axe", "weapon_and_armor", "gold", 3, 1, { tier: 3, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "diamond_axe", "weapon_and_armor", "gold", 6, 1, { tier: 4, isHighestTier: true, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "wooden_pickaxe", "weapon_and_armor", "iron", 10, 1, { tier: 1, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "iron_pickaxe", "weapon_and_armor", "iron", 10, 1, { tier: 2, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "golden_pickaxe", "weapon_and_armor", "gold", 3, 1, { tier: 3, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "diamond_pickaxe", "weapon_and_armor", "gold", 6, 1, { tier: 4, isHighestTier: true, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "bow", "weapon_and_armor", "gold", 12, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "bow_power", "weapon_and_armor", "gold", 20, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "bow_power_punch", "weapon_and_armor", "emerald", 6, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "arrow", "weapon_and_armor", "gold", 2, 6, { itemId: "minecraft:arrow" } )
]
    
/** 团队升级商品列表 */
export const teamUpgradeShopitems = [ 
    new Shopitem( "sharpened_swords", "team_upgrade", "diamond", 8, 1, { description: "己方所有成员的剑和斧\n 将永久获得锋利 I 的效果！", itemType: "teamUpgrade", costResourceAmountInSolo: 4 } ),
    new Shopitem( "reinforced_armor_tier_1", "team_upgrade", "diamond", 5, 1, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
    new Shopitem( "reinforced_armor_tier_2", "team_upgrade", "diamond", 10, 2, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 II", itemType: "teamUpgrade", tier: 2, isHighestTier: false, costResourceAmountInSolo: 4 } ),
    new Shopitem( "reinforced_armor_tier_3", "team_upgrade", "diamond", 20, 3, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 III", itemType: "teamUpgrade", tier: 3, isHighestTier: false, costResourceAmountInSolo: 8 } ),
    new Shopitem( "reinforced_armor_tier_4", "team_upgrade", "diamond", 30, 4, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 IV", itemType: "teamUpgrade", tier: 4, isHighestTier: true, costResourceAmountInSolo: 16 } ),
    new Shopitem( "maniac_miner_tier_1", "team_upgrade", "diamond", 4, 1, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
    new Shopitem( "maniac_miner_tier_2", "team_upgrade", "diamond", 6, 2, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 II", itemType: "teamUpgrade", tier: 2, isHighestTier: true, costResourceAmountInSolo: 4 } ),
    new Shopitem( "forge_tier_1", "team_upgrade", "diamond", 4, 1, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +50% 资源", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
    new Shopitem( "forge_tier_2", "team_upgrade", "diamond", 8, 2, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +100% 资源", itemType: "teamUpgrade", tier: 2, isHighestTier: false, costResourceAmountInSolo: 4 } ),
    new Shopitem( "forge_tier_3", "team_upgrade", "diamond", 12, 3, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： 生成绿宝石", itemType: "teamUpgrade", tier: 3, isHighestTier: false, costResourceAmountInSolo: 6 } ),
    new Shopitem( "forge_tier_4", "team_upgrade", "diamond", 16, 4, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +200% 资源", itemType: "teamUpgrade", tier: 4, isHighestTier: true, costResourceAmountInSolo: 8 } ),
    new Shopitem( "heal_pool", "team_upgrade", "diamond", 3, 1, { description: "基地附近的队伍成员将拥有生命恢复效果！", itemType: "teamUpgrade", costResourceAmountInSolo: 1 } ),
    new Shopitem( "dragon_buff", "team_upgrade", "diamond", 5, 1, { description: "你的队伍在绝杀模式中将会有两条末影龙而不是一条！", itemType: "teamUpgrade" } ),
    new Shopitem( "its_a_trap", "team_upgrade", "diamond", 1, 1, { description: "造成失明和缓慢效果，持续 8 秒。", itemType: "trap" } ),
    new Shopitem( "counter_offensive_trap", "team_upgrade", "diamond", 1, 1, { description: "赋予基地附近的队友速度 II 与跳跃提升 II\n 效果，持续 15 秒。", itemType: "trap" } ),
    new Shopitem( "alarm_trap", "team_upgrade", "diamond", 1, 1, { description: "让隐身的敌人立刻显形，并警报入侵者的名字和队伍。", itemType: "trap" } ),
    new Shopitem( "miner_fatigue_trap", "team_upgrade", "diamond", 1, 1, { description: "造成挖掘疲劳效果，持续 10 秒。", itemType: "trap" } )
]
    
