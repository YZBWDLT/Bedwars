# ===== 梦境守护者交易 =====
# 120铁锭 -> 1梦境守护者

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..119}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..119}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予梦境守护者
give @s[hasitem={item=bedwars:iron_ingot,quantity=120..}] bedwars:dream_defender
playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=120..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=120..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.dream_defender"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:iron_ingot,quantity=120..}] bedwars:iron_ingot -1 120

# --- 清除标记物品 ---
clear @s bedwars:shopitem_dream_defender
