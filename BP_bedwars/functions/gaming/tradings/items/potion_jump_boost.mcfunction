# ===== 跳跃药水交易 =====
# 1绿宝石 -> 1跳跃药水

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=0}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=0}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予跳跃药水
give @s[hasitem={item=bedwars:emerald,quantity=1..}] bedwars:potion_jump_boost
playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=1..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=1..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.potion_jump_boost"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:emerald,quantity=1..}] bedwars:emerald -1 1

# --- 清除标记物品 ---
clear @s bedwars:shopitem_potion_jump_boost
