# ===== 交易系统 =====

# --- 给trader添加待交易的物品 ---
function style/hypixel/item_trader

# --- 当玩家拿起物品放到自己物品栏时，进行交易 ---

## ~~~ 物品与道具类 ~~~

## 羊毛
execute as @a[hasitem={item=bedwars:shopitem_wool}] at @s run function gaming/tradings/blocks/wool
## 陶瓦
execute as @a[hasitem={item=bedwars:shopitem_hardened_clay}] at @s run function gaming/tradings/blocks/hardened_clay
## 木板
execute as @a[hasitem={item=bedwars:shopitem_planks}] at @s run function gaming/tradings/blocks/planks
## 防爆玻璃
execute as @a[hasitem={item=bedwars:shopitem_blast_proof_glass}] at @s run function gaming/tradings/blocks/blast_proof_glass
## 末地石
execute as @a[hasitem={item=bedwars:shopitem_end_stone}] at @s run function gaming/tradings/blocks/end_stone
## 梯子
execute as @a[hasitem={item=bedwars:shopitem_ladder}] at @s run function gaming/tradings/blocks/ladder
## 黑曜石
execute as @a[hasitem={item=bedwars:shopitem_obsidian}] at @s run function gaming/tradings/blocks/obsidian
## 三药水（跳跃提升，速度，隐身）
execute as @a[hasitem={item=bedwars:shopitem_potion_jump_boost}] at @s run function gaming/tradings/items/potion_jump_boost
execute as @a[hasitem={item=bedwars:shopitem_potion_speed}] at @s run function gaming/tradings/items/potion_speed
execute as @a[hasitem={item=bedwars:shopitem_potion_invisibility}] at @s run function gaming/tradings/items/potion_invisibility
## 金苹果
execute as @a[hasitem={item=bedwars:shopitem_golden_apple}] at @s run function gaming/tradings/items/golden_apple
## 床虱
execute as @a[hasitem={item=bedwars:shopitem_bed_bug}] at @s run function gaming/tradings/items/bed_bug
## 梦境守护者
execute as @a[hasitem={item=bedwars:shopitem_dream_defender}] at @s run function gaming/tradings/items/dream_defender
## 火球
execute as @a[hasitem={item=bedwars:shopitem_fireball}] at @s run function gaming/tradings/items/fireball
## TNT
execute as @a[hasitem={item=bedwars:shopitem_tnt}] at @s run function gaming/tradings/items/tnt
## 末影珍珠
execute as @a[hasitem={item=bedwars:shopitem_ender_pearl}] at @s run function gaming/tradings/items/ender_pearl
## 水桶
execute as @a[hasitem={item=bedwars:shopitem_water_bucket}] at @s run function gaming/tradings/items/water_bucket
## 搭桥蛋
execute as @a[hasitem={item=bedwars:shopitem_bridge_egg}] at @s run function gaming/tradings/items/bridge_egg
## 魔法牛奶
execute as @a[hasitem={item=bedwars:shopitem_magic_milk}] at @s run function gaming/tradings/items/magic_milk
## 海绵
execute as @a[hasitem={item=bedwars:shopitem_sponge}] at @s run function gaming/tradings/items/sponge

## ~~~ 武器与盔甲类 ~~~

## 石剑
execute as @a[hasitem={item=bedwars:shopitem_stone_sword}] at @s run function gaming/tradings/weapons/stone_sword
## 铁剑
execute as @a[hasitem={item=bedwars:shopitem_iron_sword}] at @s run function gaming/tradings/weapons/iron_sword
## 钻石剑
execute as @a[hasitem={item=bedwars:shopitem_diamond_sword}] at @s run function gaming/tradings/weapons/diamond_sword
## 击退棒
execute as @a[hasitem={item=bedwars:shopitem_knockback_stick}] at @s run function gaming/tradings/weapons/knockback_stick
## 锁链盔甲
execute as @a[hasitem={item=bedwars:shopitem_chain_armor}] at @s run function gaming/tradings/armors/chain_armor
## 铁盔甲
execute as @a[hasitem={item=bedwars:shopitem_iron_armor}] at @s run function gaming/tradings/armors/iron_armor
## 钻石盔甲
execute as @a[hasitem={item=bedwars:shopitem_diamond_armor}] at @s run function gaming/tradings/armors/diamond_armor
## 剪刀
execute as @a[hasitem={item=bedwars:shopitem_shears}] at @s run function gaming/tradings/tools/shears
## 木斧
execute as @a[hasitem={item=bedwars:shopitem_wooden_axe}] at @s run function gaming/tradings/tools/wooden_axe
## 石斧
execute as @a[hasitem={item=bedwars:shopitem_stone_axe}] at @s run function gaming/tradings/tools/stone_axe
## 铁斧
execute as @a[hasitem={item=bedwars:shopitem_iron_axe}] at @s run function gaming/tradings/tools/iron_axe
## 钻石斧
execute as @a[hasitem={item=bedwars:shopitem_diamond_axe}] at @s run function gaming/tradings/tools/diamond_axe
## 木镐
execute as @a[hasitem={item=bedwars:shopitem_wooden_pickaxe}] at @s run function gaming/tradings/tools/wooden_pickaxe
## 铁镐
execute as @a[hasitem={item=bedwars:shopitem_iron_pickaxe}] at @s run function gaming/tradings/tools/iron_pickaxe
## 金镐
execute as @a[hasitem={item=bedwars:shopitem_golden_pickaxe}] at @s run function gaming/tradings/tools/golden_pickaxe
## 钻石镐
execute as @a[hasitem={item=bedwars:shopitem_diamond_pickaxe}] at @s run function gaming/tradings/tools/diamond_pickaxe
## 弓
execute as @a[hasitem={item=bedwars:shopitem_bow}] at @s run function gaming/tradings/weapons/bow
## 力量弓
execute as @a[hasitem={item=bedwars:shopitem_bow_power}] at @s run function gaming/tradings/weapons/bow_power
## 力量冲击弓
execute as @a[hasitem={item=bedwars:shopitem_bow_power_punch}] at @s run function gaming/tradings/weapons/bow_power_punch
## 箭
execute as @a[hasitem={item=bedwars:shopitem_arrow}] at @s run function gaming/tradings/weapons/arrow

# ~~~ 团队升级类 ~~~
## 锋利
execute as @a[hasitem={item=bedwars:upgrade_sharpened_swords}] at @s run function gaming/tradings/team_upgrade/sharpened_swords
## 保护
execute as @a[hasitem={item=bedwars:upgrade_reinforced_armor_tier_1}] at @s run function gaming/tradings/team_upgrade/reinforced_armor_tier_1
execute as @a[hasitem={item=bedwars:upgrade_reinforced_armor_tier_2}] at @s run function gaming/tradings/team_upgrade/reinforced_armor_tier_2
execute as @a[hasitem={item=bedwars:upgrade_reinforced_armor_tier_3}] at @s run function gaming/tradings/team_upgrade/reinforced_armor_tier_3
execute as @a[hasitem={item=bedwars:upgrade_reinforced_armor_tier_4}] at @s run function gaming/tradings/team_upgrade/reinforced_armor_tier_4
## 急迫
execute as @a[hasitem={item=bedwars:upgrade_maniac_miner_tier_1}] at @s run function gaming/tradings/team_upgrade/maniac_miner_tier_1
execute as @a[hasitem={item=bedwars:upgrade_maniac_miner_tier_2}] at @s run function gaming/tradings/team_upgrade/maniac_miner_tier_2
## 锻炉
execute as @a[hasitem={item=bedwars:upgrade_forge_tier_1}] at @s run function gaming/tradings/team_upgrade/forge_tier_1
execute as @a[hasitem={item=bedwars:upgrade_forge_tier_2}] at @s run function gaming/tradings/team_upgrade/forge_tier_2
execute as @a[hasitem={item=bedwars:upgrade_forge_tier_3}] at @s run function gaming/tradings/team_upgrade/forge_tier_3
execute as @a[hasitem={item=bedwars:upgrade_forge_tier_4}] at @s run function gaming/tradings/team_upgrade/forge_tier_4
## 治愈池
execute as @a[hasitem={item=bedwars:upgrade_heal_pool}] at @s run function gaming/tradings/team_upgrade/heal_pool
## 龙
execute as @a[hasitem={item=bedwars:upgrade_dragon_buff}] at @s run function gaming/tradings/team_upgrade/dragon_buff
## 陷阱
execute as @a[hasitem={item=bedwars:upgrade_its_a_trap}] at @s run function gaming/tradings/team_upgrade/its_a_trap
execute as @a[hasitem={item=bedwars:upgrade_counter_offensive_trap}] at @s run function gaming/tradings/team_upgrade/counter_offensive_trap
execute as @a[hasitem={item=bedwars:upgrade_alarm_trap}] at @s run function gaming/tradings/team_upgrade/alarm_trap
execute as @a[hasitem={item=bedwars:upgrade_miner_fatigue_trap}] at @s run function gaming/tradings/team_upgrade/miner_fatigue_trap
execute as @a[hasitem={item=bedwars:trap_note}] at @s run clear @s bedwars:trap_note
