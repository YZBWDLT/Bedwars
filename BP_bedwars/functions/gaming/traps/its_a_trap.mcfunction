# ===== 这是个陷阱！ =====

# --- 为踏入陷阱的玩家施加效果 ---
execute as @a[scores={teamUpgrade=0},r=10] at @s unless score @s team = @e[r=10,family=bed,c=1] team run effect @s blindness 8 0 true
execute as @a[scores={teamUpgrade=0},r=10] at @s unless score @s team = @e[r=10,family=bed,c=1] team run effect @s slowness 8 0 true

# --- 提示本队玩家陷阱已触发 ---
execute as @a if score @s team = @e[r=1,family=bed,c=1] team run titleraw @s times 10 60 60
execute as @a if score @s team = @e[r=1,family=bed,c=1] team run titleraw @s title {"rawtext":[{"translate":"style.hypixel.trap_triggered.title"}]}
execute as @a if score @s team = @e[r=1,family=bed,c=1] team run titleraw @s subtitle {"rawtext":[{"translate":"style.hypixel.trap_triggered.subtitle","with":{"rawtext":[{"translate":"team_upgrade.its_a_trap"}]}}]}
execute as @a if score @s team = @e[r=1,family=bed,c=1] team at @s run playsound mob.shulker.teleport @s ~~~ 1 0.5

# --- 将该方的第一个陷阱改为0，同时启用陷阱冷却 ---
execute if entity @s[scores={team=1}] run scoreboard players set firstTrapRed teamUpgrade 0
execute if entity @s[scores={team=2}] run scoreboard players set firstTrapBlue teamUpgrade 0
execute if entity @s[scores={team=3}] run scoreboard players set firstTrapGreen teamUpgrade 0
execute if entity @s[scores={team=4}] run scoreboard players set firstTrapYellow teamUpgrade 0
execute if entity @s[scores={team=5}] run scoreboard players set firstTrapWhite teamUpgrade 0
execute if entity @s[scores={team=6}] run scoreboard players set firstTrapPink teamUpgrade 0
execute if entity @s[scores={team=7}] run scoreboard players set firstTrapGray teamUpgrade 0
execute if entity @s[scores={team=8}] run scoreboard players set firstTrapCyan teamUpgrade 0

execute if entity @s[scores={team=1}] run scoreboard players set trapCooldownRed time 30
execute if entity @s[scores={team=2}] run scoreboard players set trapCooldownBlue time 30
execute if entity @s[scores={team=3}] run scoreboard players set trapCooldownGreen time 30
execute if entity @s[scores={team=4}] run scoreboard players set trapCooldownYellow time 30
execute if entity @s[scores={team=5}] run scoreboard players set trapCooldownWhite time 30
execute if entity @s[scores={team=6}] run scoreboard players set trapCooldownPink time 30
execute if entity @s[scores={team=7}] run scoreboard players set trapCooldownGray time 30
execute if entity @s[scores={team=8}] run scoreboard players set trapCooldownCyan time 30
