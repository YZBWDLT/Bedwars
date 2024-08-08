# ===== 铁盔甲交易 =====
# 因为需要同时执行部分命令，因此单独开一个函数

scoreboard players set @s armorLevel 3
playsound note.pling @s ~~~ 0.5 2
tellraw @s {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.iron_armor"}]}}]}
clear @s bedwars:gold_ingot -1 12
