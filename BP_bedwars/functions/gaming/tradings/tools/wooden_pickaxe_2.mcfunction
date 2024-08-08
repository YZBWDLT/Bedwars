# ===== 木镐交易 =====
# 因为需要同时执行部分命令，因此单独开一个函数

scoreboard players set @s pickaxeLevel 1
playsound note.pling @s ~~~ 0.5 2
tellraw @s {"rawtext":[{"translate":"system.tradings.succeed","with":{"rawtext":[{"translate":"item.wooden_pickaxe"}]}}]}
clear @s bedwars:iron_ingot -1 10