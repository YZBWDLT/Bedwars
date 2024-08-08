# ===== 金苹果交易 =====
# 3金锭 -> 1金苹果

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..2}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..2}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予金苹果，再清除
give @s[hasitem={item=bedwars:gold_ingot,quantity=3..}] golden_apple

playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=3..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=3..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.golden_apple"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:gold_ingot,quantity=3..}] bedwars:gold_ingot -1 3

# --- 清除标记物品 ---
clear @s bedwars:shopitem_golden_apple