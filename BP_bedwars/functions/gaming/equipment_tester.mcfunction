# ===== 盔甲等级机制 =====

# --- 盔甲 ---

## 上半身
execute as @a[tag=isAlive] run function lib/modify_data/team_armor

## 1级 - 皮革套
execute as @a[tag=isAlive,scores={armorLevel=1}] run function lib/modify_data/leather_armor
## 2级 - 锁链套
replaceitem entity @a[hasitem={item=chainmail_leggings,quantity=0,location=slot.armor.legs},scores={armorLevel=2},tag=isAlive] slot.armor.legs 0 chainmail_leggings 1 0 {"item_lock":{"mode":"lock_in_slot"}}
replaceitem entity @a[hasitem={item=chainmail_boots,quantity=0,location=slot.armor.feet},scores={armorLevel=2},tag=isAlive] slot.armor.feet 0 chainmail_boots 1 0 {"item_lock":{"mode":"lock_in_slot"}}
## 3级 - 铁套
replaceitem entity @a[hasitem={item=iron_leggings,quantity=0,location=slot.armor.legs},scores={armorLevel=3},tag=isAlive] slot.armor.legs 0 iron_leggings 1 0 {"item_lock":{"mode":"lock_in_slot"}}
replaceitem entity @a[hasitem={item=iron_boots,quantity=0,location=slot.armor.feet},scores={armorLevel=3},tag=isAlive] slot.armor.feet 0 iron_boots 1 0 {"item_lock":{"mode":"lock_in_slot"}}
## 4级 - 钻石套
replaceitem entity @a[hasitem={item=diamond_leggings,quantity=0,location=slot.armor.legs},scores={armorLevel=4},tag=isAlive] slot.armor.legs 0 diamond_leggings 1 0 {"item_lock":{"mode":"lock_in_slot"}}
replaceitem entity @a[hasitem={item=diamond_boots,quantity=0,location=slot.armor.feet},scores={armorLevel=4},tag=isAlive] slot.armor.feet 0 diamond_boots 1 0 {"item_lock":{"mode":"lock_in_slot"}}

# --- 剪刀 ---
give @a[hasitem={item=shears,quantity=0},tag=shearsUnlocked,tag=isAlive] shears 1 0 {"item_lock": { "mode": "lock_in_inventory" }}

# --- 斧头 ---

## 1级 - 木斧
give @a[hasitem={item=wooden_axe,quantity=0},scores={axeLevel=1},tag=isAlive] wooden_axe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 2级 - 石斧
give @a[hasitem={item=stone_axe,quantity=0},scores={axeLevel=2},tag=isAlive] stone_axe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 3级 - 铁斧
give @a[hasitem={item=iron_axe,quantity=0},scores={axeLevel=3},tag=isAlive] iron_axe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 4级 - 钻石斧
give @a[hasitem={item=diamond_axe,quantity=0},scores={axeLevel=4},tag=isAlive] diamond_axe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}

# --- 镐子 ---

## 1级 - 木镐
give @a[hasitem={item=wooden_pickaxe,quantity=0},scores={pickaxeLevel=1},tag=isAlive] wooden_pickaxe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 2级 - 石镐
give @a[hasitem={item=iron_pickaxe,quantity=0},scores={pickaxeLevel=2},tag=isAlive] iron_pickaxe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 3级 - 铁镐
give @a[hasitem={item=golden_pickaxe,quantity=0},scores={pickaxeLevel=3},tag=isAlive] golden_pickaxe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
## 4级 - 钻石镐
give @a[hasitem={item=diamond_pickaxe,quantity=0},scores={pickaxeLevel=4},tag=isAlive] diamond_pickaxe 1 0 {"item_lock": { "mode": "lock_in_inventory" }}

# ===== 附魔 =====

# --- 斧头 ---
# 木斧 - 效率 I
enchant @a[hasitem={item=wooden_axe,location=slot.weapon.mainhand}] efficiency 1
# 石斧 - 效率 I
enchant @a[hasitem={item=stone_axe,location=slot.weapon.mainhand}] efficiency 1
# 铁斧 - 效率 II
enchant @a[hasitem={item=iron_axe,location=slot.weapon.mainhand}] efficiency 2
# 钻石斧 - 效率 III
enchant @a[hasitem={item=diamond_axe,location=slot.weapon.mainhand}] efficiency 3

# --- 镐子 ---
# 木镐 - 效率 I
enchant @a[hasitem={item=wooden_pickaxe,location=slot.weapon.mainhand}] efficiency 1
# 铁镐 - 效率 II
enchant @a[hasitem={item=iron_pickaxe,location=slot.weapon.mainhand}] efficiency 2
# 金镐 - 效率 III
enchant @a[hasitem={item=golden_pickaxe,location=slot.weapon.mainhand}] efficiency 3
# 钻石镐 - 效率 III
enchant @a[hasitem={item=diamond_pickaxe,location=slot.weapon.mainhand}] efficiency 3

# --- 剑锋利 ---
execute if score sharpenedSwordsRed teamUpgrade matches 1 run enchant @a[scores={team=1}] sharpness 1
execute if score sharpenedSwordsBlue teamUpgrade matches 1 run enchant @a[scores={team=2}] sharpness 1
execute if score sharpenedSwordsGreen teamUpgrade matches 1 run enchant @a[scores={team=3}] sharpness 1
execute if score sharpenedSwordsYellow teamUpgrade matches 1 run enchant @a[scores={team=4}] sharpness 1
execute if score sharpenedSwordsWhite teamUpgrade matches 1 run enchant @a[scores={team=5}] sharpness 1
execute if score sharpenedSwordsPink teamUpgrade matches 1 run enchant @a[scores={team=6}] sharpness 1
execute if score sharpenedSwordsGray teamUpgrade matches 1 run enchant @a[scores={team=7}] sharpness 1
execute if score sharpenedSwordsCyan teamUpgrade matches 1 run enchant @a[scores={team=8}] sharpness 1