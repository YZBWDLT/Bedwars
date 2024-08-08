# ===== 硬化粘土交易 =====
# 12铁锭 -> 16硬化粘土

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..11}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..11}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# team号从1到8分别为红蓝绿黄白粉灰青
# 先给予硬化粘土，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=1}] stained_hardened_clay 16 14
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=2}] stained_hardened_clay 16 11
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=3}] stained_hardened_clay 16 5
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=4}] stained_hardened_clay 16 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=5}] stained_hardened_clay 16 0
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=6}] stained_hardened_clay 16 6
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=7}] stained_hardened_clay 16 7
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=8}] stained_hardened_clay 16 9

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.hardened_clay"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] bedwars:iron_ingot -1 12

# --- 清除标记物品 ---
clear @s bedwars:shopitem_hardened_clay