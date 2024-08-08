# ===== 弓交易 =====
# 12金锭 -> 1弓

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..11}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..11}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予弓
give @s[hasitem={item=bedwars:gold_ingot,quantity=12..}] bow 1
playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=12..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=12..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.bow"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:gold_ingot,quantity=12..}] bedwars:gold_ingot -1 12

# --- 清除标记物品 ---
clear @s bedwars:shopitem_bow
