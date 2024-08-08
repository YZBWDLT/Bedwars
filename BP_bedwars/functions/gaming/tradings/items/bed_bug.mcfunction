# ===== 床虱交易 =====
# 24铁锭 -> 1床虱

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..23}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..23}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予床虱
give @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] bedwars:bed_bug
playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.bed_bug"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:iron_ingot,quantity=24..}] bedwars:iron_ingot -1 24

# --- 清除标记物品 ---
clear @s bedwars:shopitem_bed_bug
