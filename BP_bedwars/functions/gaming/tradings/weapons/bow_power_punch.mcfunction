# ===== 力量冲击弓交易 =====
# 6绿宝石 -> 1力量冲击弓

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=..5}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=..5}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予力量冲击弓
loot give @s[hasitem={item=bedwars:emerald,quantity=6..}] loot "bow_power_punch"
playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=6..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=6..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.bow_power_punch"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:emerald,quantity=6..}] bedwars:emerald -1 6

# --- 清除标记物品 ---
clear @s bedwars:shopitem_bow_power_punch
