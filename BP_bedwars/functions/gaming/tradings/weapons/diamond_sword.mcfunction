# ===== 钻石剑交易 =====
# 3绿宝石 -> 1钻石剑

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:emerald,quantity=..2}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:emerald,quantity=..2}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 先给予钻石剑，再清除木剑
clear @s[hasitem={item=bedwars:emerald,quantity=3..}] wooden_sword
give @s[hasitem={item=bedwars:emerald,quantity=3..}] diamond_sword 1

playsound note.pling @s[hasitem={item=bedwars:emerald,quantity=3..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:emerald,quantity=3..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.diamond_sword"}]}}]}

# 清除物资
clear @s[hasitem={item=bedwars:emerald,quantity=3..}] bedwars:emerald -1 3

# --- 清除标记物品 ---
clear @s bedwars:shopitem_diamond_sword
