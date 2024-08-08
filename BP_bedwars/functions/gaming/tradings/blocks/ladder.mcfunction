# ===== 梯子交易 =====
# 4铁锭 -> 8梯子

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..3}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..3}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予梯子，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] ladder 8

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.ladder"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] bedwars:iron_ingot -1 4

# --- 清除标记物品 ---
clear @s bedwars:shopitem_ladder