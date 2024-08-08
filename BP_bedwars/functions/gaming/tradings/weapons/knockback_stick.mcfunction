# ===== 击退棒交易 =====
# 5金锭 -> 1击退棒

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..4}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..4}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予击退棒
loot give @s[hasitem={item=bedwars:gold_ingot,quantity=5..}] loot "knockback_stick"
playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=5..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=5..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.knockback_stick"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:gold_ingot,quantity=5..}] bedwars:gold_ingot -1 5

# --- 清除标记物品 ---
clear @s bedwars:shopitem_knockback_stick
