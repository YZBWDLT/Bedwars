# 结合主函数使用

execute if score @s team matches 1 run scoreboard players set dragonBuffRed teamUpgrade 1
execute if score @s team matches 2 run scoreboard players set dragonBuffBlue teamUpgrade 1
execute if score @s team matches 3 run scoreboard players set dragonBuffGreen teamUpgrade 1
execute if score @s team matches 4 run scoreboard players set dragonBuffYellow teamUpgrade 1
execute if score @s team matches 5 run scoreboard players set dragonBuffWhite teamUpgrade 1
execute if score @s team matches 6 run scoreboard players set dragonBuffPink teamUpgrade 1
execute if score @s team matches 7 run scoreboard players set dragonBuffGray teamUpgrade 1
execute if score @s team matches 8 run scoreboard players set dragonBuffCyan teamUpgrade 1

# 为本队的玩家播放音效和消息
scoreboard players set @a temp 0
scoreboard players set @s temp 1
execute as @a at @s if score @s team = @a[scores={temp=1}] team run playsound note.pling @s ~~~ 0.5 2
execute as @a at @s if score @s team = @a[scores={temp=1}] team run tellraw @s {"rawtext":[{"translate":"system.tradings.succeed_team_upgrade","with":{"rawtext":[{"selector":"@a[scores={temp=1}]"},{"translate":"team_upgrade.dragon_buff"}]}}]}
scoreboard players reset @s temp

# 清除钻石
clear @s bedwars:diamond -1 5
