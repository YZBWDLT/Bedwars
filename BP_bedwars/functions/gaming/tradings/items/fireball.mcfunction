# ===== 火球交易 =====
# 40铁锭 -> 1火球

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..39}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..39}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予火球，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=40..}] bedwars:fireball 1

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=40..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=40..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.fireball"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:iron_ingot,quantity=40..}] bedwars:iron_ingot -1 40

# --- 清除标记物品 ---
clear @s bedwars:shopitem_fireball