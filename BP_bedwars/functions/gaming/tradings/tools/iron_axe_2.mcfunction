# ===== 铁斧交易 =====
# 因为需要同时执行部分命令，因此单独开一个函数

scoreboard players set @s axeLevel 3
playsound note.pling @s ~~~ 0.5 2
tellraw @s {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.iron_axe"}]}}]}
clear @s bedwars:gold_ingot -1 3
clear @s stone_axe