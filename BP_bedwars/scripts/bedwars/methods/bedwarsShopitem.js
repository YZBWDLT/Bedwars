/** 商品列表 */
export const shopitems = {
    /** 队伍升级 */
    teamUpgrade: [
        new Shopitem( "reinforced_armor_tier_1", 1, "team_upgrade", "diamond", 5, 1, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
        new Shopitem( "reinforced_armor_tier_2", 2, "team_upgrade", "diamond", 10, 2, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 II", itemType: "teamUpgrade", tier: 2, isHighestTier: false, costResourceAmountInSolo: 4 } ),
        new Shopitem( "reinforced_armor_tier_3", 3, "team_upgrade", "diamond", 20, 3, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 III", itemType: "teamUpgrade", tier: 3, isHighestTier: false, costResourceAmountInSolo: 8 } ),
        new Shopitem( "reinforced_armor_tier_4", 4, "team_upgrade", "diamond", 30, 4, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 IV", itemType: "teamUpgrade", tier: 4, isHighestTier: true, costResourceAmountInSolo: 16 } ),
        new Shopitem( "maniac_miner_tier_1", 5, "team_upgrade", "diamond", 4, 1, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
        new Shopitem( "maniac_miner_tier_2", 6, "team_upgrade", "diamond", 6, 2, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 II", itemType: "teamUpgrade", tier: 2, isHighestTier: true, costResourceAmountInSolo: 4 } ),
        new Shopitem( "forge_tier_1", 7, "team_upgrade", "diamond", 4, 1, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +50% 资源", itemType: "teamUpgrade", tier: 1, isHighestTier: false, costResourceAmountInSolo: 2 } ),
        new Shopitem( "forge_tier_2", 8, "team_upgrade", "diamond", 8, 2, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +100% 资源", itemType: "teamUpgrade", tier: 2, isHighestTier: false, costResourceAmountInSolo: 4 } ),
        new Shopitem( "forge_tier_3", 9, "team_upgrade", "diamond", 12, 3, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： 生成绿宝石", itemType: "teamUpgrade", tier: 3, isHighestTier: false, costResourceAmountInSolo: 6 } ),
        new Shopitem( "forge_tier_4", 10, "team_upgrade", "diamond", 16, 4, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +200% 资源", itemType: "teamUpgrade", tier: 4, isHighestTier: true, costResourceAmountInSolo: 8 } ),
        new Shopitem( "heal_pool", 11, "team_upgrade", "diamond", 3, 1, { description: "基地附近的队伍成员将拥有生命恢复效果！", itemType: "teamUpgrade", costResourceAmountInSolo: 1 } ),
        new Shopitem( "dragon_buff", 12, "team_upgrade", "diamond", 5, 1, { description: "你的队伍在绝杀模式中将会有两条末影龙而不是一条！", itemType: "teamUpgrade" } ),
        new Shopitem( "its_a_trap", 13, "team_upgrade", "diamond", 1, 1, { description: "造成失明和缓慢效果，持续 8 秒。", itemType: "trap" } ),
        new Shopitem( "counter_offensive_trap", 14, "team_upgrade", "diamond", 1, 1, { description: "赋予基地附近的队友速度 II 与跳跃提升 II\n 效果，持续 15 秒。", itemType: "trap" } ),
        new Shopitem( "alarm_trap", 15, "team_upgrade", "diamond", 1, 1, { description: "让隐身的敌人立刻显形，并警报入侵者的名字和队伍。", itemType: "trap" } ),
        new Shopitem( "miner_fatigue_trap", 16, "team_upgrade", "diamond", 1, 1, { description: "造成挖掘疲劳效果，持续 10 秒。", itemType: "trap" } )
    ],
}
