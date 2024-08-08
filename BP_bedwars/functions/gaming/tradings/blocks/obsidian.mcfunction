# ===== 黑曜石交易 =====
# 4绿宝石 -> 4黑曜石

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=..3}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=..3}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予黑曜石，再清除
give @s[hasitem={item=bedwars:emerald,quantity=4..}] obsidian 4

playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=4..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=4..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.obsidian"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:emerald,quantity=4..}] bedwars:emerald -1 4

# --- 清除标记物品 ---
clear @s bedwars:shopitem_obsidian