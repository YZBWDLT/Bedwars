# ===== 羊毛交易 =====
# 4铁锭 -> 16羊毛

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..3}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..3}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# team号从1到8分别为红蓝绿黄白粉灰青
# 先给予羊毛，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=1}] wool 16 14
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=2}] wool 16 11
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=3}] wool 16 5
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=4}] wool 16 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=5}] wool 16 0
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=6}] wool 16 6
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=7}] wool 16 7
give @s[hasitem={item=bedwars:iron_ingot,quantity=4..},scores={team=8}] wool 16 9

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.wool"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:iron_ingot,quantity=4..}] bedwars:iron_ingot -1 4

# --- 清除标记物品 ---
clear @s bedwars:shopitem_wool