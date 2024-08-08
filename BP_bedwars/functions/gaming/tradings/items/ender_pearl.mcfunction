# ===== 末影珍珠交易 =====
# 4绿宝石 -> 1末影珍珠

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=..3}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=..3}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予末影珍珠
give @s[hasitem={item=bedwars:emerald,quantity=4..}] ender_pearl
playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=4..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=4..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.ender_pearl"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:emerald,quantity=4..}] bedwars:emerald -1 4

# --- 清除标记物品 ---
clear @s bedwars:shopitem_ender_pearl
