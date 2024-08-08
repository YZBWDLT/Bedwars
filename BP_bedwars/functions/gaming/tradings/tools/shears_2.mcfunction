# ===== 锁链盔甲交易 =====
# 因为需要同时执行部分命令，因此单独开一个函数

tag @s add shearsUnlocked
playsound note.pling @s ~~~ 0.5 2
tellraw @s {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.shears"}]}}]}
clear @s bedwars:iron_ingot -1 20
