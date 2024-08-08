# ===== 速度药水交易 =====
# 2绿宝石 -> 1速度药水

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=..1}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=..1}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 给予速度药水
give @s[hasitem={item=bedwars:emerald,quantity=2..}] bedwars:potion_invisibility
playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=2..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=2..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.potion_invisibility"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:emerald,quantity=2..}] bedwars:emerald -1 2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_potion_invisibility
