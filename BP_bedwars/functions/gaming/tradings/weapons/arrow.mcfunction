# ===== 箭交易 =====
# 2金锭 -> 6箭

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..1}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..1}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予箭
give @s[hasitem={item=bedwars:gold_ingot,quantity=2..}] arrow 6
playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=2..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=2..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.arrow"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:gold_ingot,quantity=2..}] bedwars:gold_ingot -1 2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_arrow
