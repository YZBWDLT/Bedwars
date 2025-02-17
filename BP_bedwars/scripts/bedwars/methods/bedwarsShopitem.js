/** 商店物品 */

import { map } from "./bedwarsMaps.js"
import { intToRoman } from "./number.js";

/** 商店物品类型列表 */
export const shopitemType = [ "sword", "armor", "axe", "pickaxe", "teamUpgrade", "coloredBlock", "knockbackStick", "shears", "bow", "potion", "trap", "other" ]

/** 可用商人类型列表 */
export const traderType = [ "blocks_and_items", "weapon_and_armor", "team_upgrade", "weapon_and_armor_capture" ];

/**
 * @typedef shopitemOptions
 * @property {String} description 物品描述，显示在商人界面中
 * @property {0|1|2|3|4} tier 物品等级，如果为 0 则为不分等级
 * @property {Boolean} isHighestTier 物品是否为此系列物品的最高等级物品
 * @property {Boolean} loseTierUponDeath 物品是否会在玩家死亡时降级
 * @property {String} itemId 特殊物品 ID，如果为""则为采用自动生成的 ID
 * @property {"sword"|"armor"|"axe"|"pickaxe"|"teamUpgrade"|"coloredBlock"|"knockbackStick"|"shears"|"bow"|"potion"|"trap"|"other"} itemType 商店物品类型
 * @property {Number} costResourceAmountInSolo 在Solo模式下消耗的资源数量，设置为 0 或负数则为采用默认的数值
 */

/** 【类】商店物品类 */
export class Shopitem{

    /** ID */
    id = "";

    /** 商店物品 ID */
    shopitemId = ""

    /** 物品类型 @type {"blocks_and_items"|"weapon_and_armor"|"team_upgrade"|"weapon_and_armor_capture"} */
    traderType = "blocks_and_items";

    /** 购买时消耗的资源类型 @type {"iron" | "gold" | "diamond" | "emerald"} */
    costResourceType = "iron";

    /** 购买时消耗的资源数量 */
    costResourceAmount = 1;

    /** 购买时获得的物品数量（也是显示在商店中的物品数目） */
    itemAmount = 1;

    /** 显示在商店中的物品描述 */
    description = "";

    /** 物品等级，如果为 0 则为不分等级 @type {0|1|2|3|4} */
    tier = 0;

    /** 是否为最高等级的物品（这将影响物品在商店中的显示方式） */
    isHighestTier = true;

    /** 是否在死亡后降低等级（这将影响物品在商店中的显示方式） */
    loseTierUponDeath = false;

    /** 特殊物品 ID，如果为""则为采用自动生成的 ID */
    itemId = "";

    /** 商店物品类型 @type {"sword"|"armor"|"axe"|"pickaxe"|"teamUpgrade"|"coloredBlock"|"knockbackStick"|"shears"|"bow"|"potion"|"trap"|"other"} */
    itemType = "other";

    /** 在Solo模式下消耗的资源数量，设置为 0 或负数则为采用默认的数值 */
    costResourceAmountInSolo = 0;

    /** 【构建器】
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"|"weapon_and_armor_capture"} traderType - 对应的商人类型
     * @param {String} id - 物品 ID（自动生成商店物品 ID 为 bedwars:shopitem_(id) ）
     * @param {"iron" | "gold" | "diamond" | "emerald"} costResourceType - 购买时消耗的资源类型
     * @param {Number} costResourceAmount - 购买时消耗的资源数量（常规模式下）
     * @param {Number} itemAmount - 购买时获得的物品数量
     * @param {shopitemOptions} options - 其他可选内容
     */
    constructor( id, traderType, costResourceType, costResourceAmount, itemAmount, options = {} ) {
        this.traderType = traderType;
        this.id = id;
        this.itemId = `bedwars:${this.id}`;
        if ( options.itemId ) { this.itemId = `${options.itemId}` };
        this.costResourceType = costResourceType;
        this.costResourceAmount = costResourceAmount;
        if ( options.costResourceAmountInSolo ) { this.costResourceAmountInSolo = options.costResourceAmountInSolo; }
        this.itemAmount = itemAmount;
        if ( options.description ) { this.description = options.description; }
        if ( options.tier ) { this.tier = options.tier; }
        if ( options.isHighestTier ) { this.isHighestTier = options.isHighestTier; }
        if ( options.loseTierUponDeath ) { this.loseTierUponDeath = options.loseTierUponDeath; }
        if ( options.itemType ) { this.itemType = options.itemType }
        this.shopitemId = ( this.itemType === "teamUpgrade" || this.itemType === "trap" ) ? `bedwars:upgrade_${this.id}` : `bedwars:shopitem_${this.id}`;
    };

    /** 获取该物品实际消耗价格。
     * @description 因为在构建时，map还没有创立，所以不能直接将map().isSolo() ? ... : ... 写进构建器，会出现依赖循环
     */
    getCostResourceAmount() {
        /** 如果地图为Solo模式，并且指定了有效的Solo特殊价格，则使用此价格 */
        if ( map().isSolo() && this.costResourceAmountInSolo > 0 ) { return this.costResourceAmountInSolo }
        /** 否则，采用正常价格 */
        else { return this.costResourceAmount }
    }

    /** 为有色方块设立单独的物品 ID
     * @param {import("./bedwarsTeam.js").validTeams} color - 要设定的颜色
     */
    setColoredId( color ) {
        if ( this.itemType === "coloredBlock" ) { this.itemId = `bedwars:${color}_${this.id}` }
    };

    /** 按照所给定的物品属性自动生成适合的 Lore 显示在商店界面 */
    getLore( ) {

        /** ===== 基本信息 ===== */
        
        /** 资源颜色 */ let resourceColor = "";
        /** 资源名称 */ let resourceName = "";
        switch ( this.costResourceType ) {
            case "iron": resourceColor = "§f"; resourceName = "铁锭"; break;
            case "gold": resourceColor = "§6"; resourceName = "金锭"; break;
            case "diamond": resourceColor = "§b"; resourceName = "钻石"; break;
            case "emerald": resourceColor = "§2"; resourceName = "绿宝石"; break;
            default: resourceColor = ""; resourceName = ""; break;
        };
        /** 物品等级对应的罗马数字 */ let itemTierName = `§e${intToRoman(this.tier)}`;

        /** ===== 字符串设置 ===== */

        /** 空行 */
        let emptyStr = "";
        
        /** 花费（例：花费： 5 铁锭） */
        let costStr = `§r§7 花费： ${resourceColor}${this.getCostResourceAmount()} ${resourceName}`;

        /** 等级（例：等级：IV） */
        let tierStr = `§r§7 等级： ${itemTierName}`;

        /** 非最高等级物品 */
        let upgradableStr = `§r§7 此道具可升级。`;

        /** 最高等级物品 */
        let isHighestTierStr = `§r§7 此道具为最高等级。`

        /** 可降级物品警告 */
        let loseTierStr = "§r§7 死亡将会导致损失一级！\n\n每次重生时，至少为最低等级。";

        /** 普通描述 */
        let descriptionStr = `§r§7 ${this.description}`;

        /** ===== Lore设置 ===== */

        /** 如果是有等级的物品 */
        if ( this.tier !== 0 ) {
            /** 可降级物品，将描述换为降级警告 */
            if ( this.loseTierUponDeath ) {
                /** 如果该物品不是最高级，则显示为该物品可升级；反之，显示为该物品已为最高级 */
                if ( !this.isHighestTier ) { return [ emptyStr, costStr, tierStr, emptyStr, upgradableStr, loseTierStr ]; }
                else { return [ emptyStr, costStr, tierStr, emptyStr, isHighestTierStr, loseTierStr ]; };
            }
            else { return [ emptyStr, costStr, tierStr, emptyStr, descriptionStr ]; };

        }
        /** 如果是无等级的物品 */
        else {
            if ( this.description !== "" ) { return [ emptyStr, costStr, emptyStr, descriptionStr ]; }
            else { return [ emptyStr, costStr ]; };
        };

    };

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

/** 武器与盔甲（夺点）商品列表 */
export const weaponAndArmorCaptureShopitems = [
    ...weaponAndArmorShopitems,
    new Shopitem( "bed", "weapon_and_armor_capture", "diamond", 2, 1, { description: "在基岩上放床以夺取点位。", itemType: "coloredBlock" } )
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
    
