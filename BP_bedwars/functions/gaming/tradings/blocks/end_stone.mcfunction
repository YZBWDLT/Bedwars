# ===== 末地石交易 =====
# 24铁锭 -> 12末地石

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..23}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..23}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予末地石，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] end_stone 12

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.end_stone"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] bedwars:iron_ingot -1 24

# --- 清除标记物品 ---
clear @s bedwars:shopitem_end_stone