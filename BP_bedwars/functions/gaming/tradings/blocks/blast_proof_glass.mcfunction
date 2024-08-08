# ===== 防爆玻璃交易 =====
# 12铁锭 -> 4防爆玻璃

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..11}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..11}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# team号从1到8分别为红蓝绿黄白粉灰青
# 先给予羊毛，再清除
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=1}] bedwars:blast_proof_glass_red 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=2}] bedwars:blast_proof_glass_blue 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=3}] bedwars:blast_proof_glass_green 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=4}] bedwars:blast_proof_glass_yellow 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=5}] bedwars:blast_proof_glass_white 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=6}] bedwars:blast_proof_glass_pink 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=7}] bedwars:blast_proof_glass_gray 4
give @s[hasitem={item=bedwars:iron_ingot,quantity=12..},scores={team=8}] bedwars:blast_proof_glass_cyan 4

playsound note.pling @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] ~~~ 0.5 2
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.blast_proof_glass"}]}}]}

# 清除
clear @s[hasitem={item=bedwars:iron_ingot,quantity=12..}] bedwars:iron_ingot -1 12

# --- 清除标记物品 ---
clear @s bedwars:shopitem_blast_proof_glass