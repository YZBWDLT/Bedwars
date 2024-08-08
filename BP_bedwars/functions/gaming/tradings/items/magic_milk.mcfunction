# ===== 魔法牛奶交易 =====
# 4金锭 -> 1魔法牛奶

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..3}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..3}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予魔法牛奶，再清除
give @s[hasitem={item=bedwars:gold_ingot,quantity=4..}] bedwars:magic_milk

playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=4..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=4..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.magic_milk"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:gold_ingot,quantity=4..}] bedwars:gold_ingot -1 4

# --- 清除标记物品 ---
clear @s bedwars:shopitem_magic_milk