# ===== 铁剑交易 =====
# 7金锭 -> 1铁剑

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..6}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..6}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予铁剑，再清除木剑
clear @s[hasitem={item=bedwars:gold_ingot,quantity=7..}] wooden_sword
give @s[hasitem={item=bedwars:gold_ingot,quantity=7..}] iron_sword 1

playsound note.pling @s[hasitem={item=bedwars:gold_ingot,quantity=7..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=7..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.iron_sword"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:gold_ingot,quantity=7..}] bedwars:gold_ingot -1 7

# --- 清除标记物品 ---
clear @s bedwars:shopitem_iron_sword
