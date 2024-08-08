# ===== 力量弓交易 =====
# 20金锭 -> 1力量弓

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..19}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..19}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予力量弓
loot give @s[hasitem={item=bedwars:gold_ingot,quantity=20..}] loot "bow_power"
playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=20..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=20..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.bow_power"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:gold_ingot,quantity=20..}] bedwars:gold_ingot -1 20

# --- 清除标记物品 ---
clear @s bedwars:shopitem_bow_power
