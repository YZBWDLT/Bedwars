# ===== 石剑交易 =====
# 10铁锭 -> 1石剑

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予石剑，再清除木剑
clear @s[hasitem={item=bedwars:iron_ingot,quantity=10..}] wooden_sword
give @s[hasitem={item=bedwars:iron_ingot,quantity=10..}] stone_sword 1

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=10..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.stone_sword"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:iron_ingot,quantity=10..}] bedwars:iron_ingot -1 10

# --- 清除标记物品 ---
clear @s bedwars:shopitem_stone_sword

# --- 清除木剑 ---
