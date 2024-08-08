# ===== TNT交易 =====
# 8金锭 -> 1TNT

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..7}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..7}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予TNT，再清除
give @s[hasitem={item=bedwars:gold_ingot,quantity=8..}] bedwars:tnt

playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=8..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=8..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.tnt"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:gold_ingot,quantity=8..}] bedwars:gold_ingot -1 8

# --- 清除标记物品 ---
clear @s bedwars:shopitem_tnt