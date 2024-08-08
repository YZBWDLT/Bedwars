# ===== 陷阱检测器 =====

# --- 获取当前队伍存在的陷阱类型和陷阱冷却 ---
execute as @e[family=bed,family=team_red] at @s run scoreboard players operation @s teamUpgrade = firstTrapRed teamUpgrade
execute as @e[family=bed,family=team_blue] at @s run scoreboard players operation @s teamUpgrade = firstTrapBlue teamUpgrade
execute as @e[family=bed,family=team_green] at @s run scoreboard players operation @s teamUpgrade = firstTrapGreen teamUpgrade
execute as @e[family=bed,family=team_yellow] at @s run scoreboard players operation @s teamUpgrade = firstTrapYellow teamUpgrade
execute as @e[family=bed,family=team_white] at @s run scoreboard players operation @s teamUpgrade = firstTrapWhite teamUpgrade
execute as @e[family=bed,family=team_pink] at @s run scoreboard players operation @s teamUpgrade = firstTrapPink teamUpgrade
execute as @e[family=bed,family=team_gray] at @s run scoreboard players operation @s teamUpgrade = firstTrapGray teamUpgrade
execute as @e[family=bed,family=team_cyan] at @s run scoreboard players operation @s teamUpgrade = firstTrapCyan teamUpgrade

execute as @e[family=bed,family=team_red] at @s run scoreboard players operation @s time = trapCooldownRed time
execute as @e[family=bed,family=team_blue] at @s run scoreboard players operation @s time = trapCooldownBlue time
execute as @e[family=bed,family=team_green] at @s run scoreboard players operation @s time = trapCooldownGreen time
execute as @e[family=bed,family=team_yellow] at @s run scoreboard players operation @s time = trapCooldownYellow time
execute as @e[family=bed,family=team_white] at @s run scoreboard players operation @s time = trapCooldownWhite time
execute as @e[family=bed,family=team_pink] at @s run scoreboard players operation @s time = trapCooldownPink time
execute as @e[family=bed,family=team_gray] at @s run scoreboard players operation @s time = trapCooldownGray time
execute as @e[family=bed,family=team_cyan] at @s run scoreboard players operation @s time = trapCooldownCyan time

# --- 陷阱冷却不为0的队伍，启用陷阱冷却 ---
execute if score tick time matches 4 if score trapCooldownRed time matches 1.. run scoreboard players remove trapCooldownRed time 1
execute if score tick time matches 4 if score trapCooldownBlue time matches 1.. run scoreboard players remove trapCooldownBlue time 1
execute if score tick time matches 4 if score trapCooldownGreen time matches 1.. run scoreboard players remove trapCooldownGreen time 1
execute if score tick time matches 4 if score trapCooldownYellow time matches 1.. run scoreboard players remove trapCooldownYellow time 1
execute if score tick time matches 4 if score trapCooldownWhite time matches 1.. run scoreboard players remove trapCooldownWhite time 1
execute if score tick time matches 4 if score trapCooldownPink time matches 1.. run scoreboard players remove trapCooldownPink time 1
execute if score tick time matches 4 if score trapCooldownGray time matches 1.. run scoreboard players remove trapCooldownGray time 1
execute if score tick time matches 4 if score trapCooldownCyan time matches 1.. run scoreboard players remove trapCooldownCyan time 1

# --- 魔法牛奶计时 ---
scoreboard players remove @a[scores={teamUpgrade=1..}] teamUpgrade 1
tellraw @a[scores={teamUpgrade=1}] {"rawtext":[{"translate":"system.magic_milk.out_of_date"}]}

# --- 检测他队玩家是否接近我方的床 ---
#          ↓ 检测玩家没有魔法牛奶且存活                   ↓ 检测该队是否是敌方队伍                                    检测该队是否有陷阱及陷阱类别 ↓             ↓ 检测该队的陷阱冷却是否已完成
execute as @a[scores={teamUpgrade=0},tag=isAlive] at @s unless score @s team = @e[family=bed,r=10,c=1] team if entity @e[family=bed,r=10,c=1,scores={teamUpgrade=1,time=0}] as @e[family=bed,r=10,c=1] at @s run function gaming/traps/its_a_trap
execute as @a[scores={teamUpgrade=0},tag=isAlive] at @s unless score @s team = @e[family=bed,r=10,c=1] team if entity @e[family=bed,r=10,c=1,scores={teamUpgrade=2,time=0}] as @e[family=bed,r=10,c=1] at @s run function gaming/traps/counter_offensive_trap
execute as @a[scores={teamUpgrade=0},tag=isAlive] at @s unless score @s team = @e[family=bed,r=10,c=1] team if entity @e[family=bed,r=10,c=1,scores={teamUpgrade=3,time=0}] as @e[family=bed,r=10,c=1] at @s run function gaming/traps/alarm_trap
execute as @a[scores={teamUpgrade=0},tag=isAlive] at @s unless score @s team = @e[family=bed,r=10,c=1] team if entity @e[family=bed,r=10,c=1,scores={teamUpgrade=4,time=0}] as @e[family=bed,r=10,c=1] at @s run function gaming/traps/miner_fatigue_trap

# --- 报警中的床 ---
execute as @e[family=bed,tag=alarming] run scoreboard players add @s temp3 1
execute as @e[family=bed,tag=alarming,scores={temp3=!0..3}] run scoreboard players set @s temp3 0
##                                                               ↓ 最多30个周期
execute as @e[family=bed,tag=alarming] if score @s temp2 matches 30 run function gaming/traps/alarm_trap_2
##                                                                                                    ↓ 低音音调
execute as @e[family=bed,tag=alarming,scores={temp3=1}] at @s run playsound note.pling @a[r=15] ~~~ 1 1.5
##                                                                                                    ↓ 高音音调
execute as @e[family=bed,tag=alarming,scores={temp3=3}] at @s run playsound note.pling @a[r=15] ~~~ 1 1.7
execute as @e[family=bed,tag=alarming,scores={temp3=3}] run scoreboard players add @s temp2 1

# --- 当第一个陷阱丢失后，将第二和第三个陷阱提前 ---
execute if score firstTrapRed teamUpgrade matches 0 if score secondTrapRed teamUpgrade matches !0 run scoreboard players operation secondTrapRed temp = secondTrapRed teamUpgrade
execute if score firstTrapRed teamUpgrade matches 0 if score secondTrapRed teamUpgrade matches !0 run scoreboard players operation thirdTrapRed temp = thirdTrapRed teamUpgrade
execute if score secondTrapRed temp matches !0 run scoreboard players operation firstTrapRed teamUpgrade = secondTrapRed temp
execute if score secondTrapRed temp matches !0 run scoreboard players operation secondTrapRed teamUpgrade = thirdTrapRed temp
execute if score secondTrapRed temp matches !0 run scoreboard players set thirdTrapRed teamUpgrade 0
scoreboard players reset secondTrapRed temp
scoreboard players reset thirdTrapRed temp

execute if score firstTrapBlue teamUpgrade matches 0 if score secondTrapBlue teamUpgrade matches !0 run scoreboard players operation secondTrapBlue temp = secondTrapBlue teamUpgrade
execute if score firstTrapBlue teamUpgrade matches 0 if score secondTrapBlue teamUpgrade matches !0 run scoreboard players operation thirdTrapBlue temp = thirdTrapBlue teamUpgrade
execute if score secondTrapBlue temp matches !0 run scoreboard players operation firstTrapBlue teamUpgrade = secondTrapBlue temp
execute if score secondTrapBlue temp matches !0 run scoreboard players operation secondTrapBlue teamUpgrade = thirdTrapBlue temp
execute if score secondTrapBlue temp matches !0 run scoreboard players set thirdTrapBlue teamUpgrade 0
scoreboard players reset secondTrapBlue temp
scoreboard players reset thirdTrapBlue temp

execute if score firstTrapGreen teamUpgrade matches 0 if score secondTrapGreen teamUpgrade matches !0 run scoreboard players operation secondTrapGreen temp = secondTrapGreen teamUpgrade
execute if score firstTrapGreen teamUpgrade matches 0 if score secondTrapGreen teamUpgrade matches !0 run scoreboard players operation thirdTrapGreen temp = thirdTrapGreen teamUpgrade
execute if score secondTrapGreen temp matches !0 run scoreboard players operation firstTrapGreen teamUpgrade = secondTrapGreen temp
execute if score secondTrapGreen temp matches !0 run scoreboard players operation secondTrapGreen teamUpgrade = thirdTrapGreen temp
execute if score secondTrapGreen temp matches !0 run scoreboard players set thirdTrapGreen teamUpgrade 0
scoreboard players reset secondTrapGreen temp
scoreboard players reset thirdTrapGreen temp

execute if score firstTrapYellow teamUpgrade matches 0 if score secondTrapYellow teamUpgrade matches !0 run scoreboard players operation secondTrapYellow temp = secondTrapYellow teamUpgrade
execute if score firstTrapYellow teamUpgrade matches 0 if score secondTrapYellow teamUpgrade matches !0 run scoreboard players operation thirdTrapYellow temp = thirdTrapYellow teamUpgrade
execute if score secondTrapYellow temp matches !0 run scoreboard players operation firstTrapYellow teamUpgrade = secondTrapYellow temp
execute if score secondTrapYellow temp matches !0 run scoreboard players operation secondTrapYellow teamUpgrade = thirdTrapYellow temp
execute if score secondTrapYellow temp matches !0 run scoreboard players set thirdTrapYellow teamUpgrade 0
scoreboard players reset secondTrapYellow temp
scoreboard players reset thirdTrapYellow temp

execute if score firstTrapWhite teamUpgrade matches 0 if score secondTrapWhite teamUpgrade matches !0 run scoreboard players operation secondTrapWhite temp = secondTrapWhite teamUpgrade
execute if score firstTrapWhite teamUpgrade matches 0 if score secondTrapWhite teamUpgrade matches !0 run scoreboard players operation thirdTrapWhite temp = thirdTrapWhite teamUpgrade
execute if score secondTrapWhite temp matches !0 run scoreboard players operation firstTrapWhite teamUpgrade = secondTrapWhite temp
execute if score secondTrapWhite temp matches !0 run scoreboard players operation secondTrapWhite teamUpgrade = thirdTrapWhite temp
execute if score secondTrapWhite temp matches !0 run scoreboard players set thirdTrapWhite teamUpgrade 0
scoreboard players reset secondTrapWhite temp
scoreboard players reset thirdTrapWhite temp

execute if score firstTrapPink teamUpgrade matches 0 if score secondTrapPink teamUpgrade matches !0 run scoreboard players operation secondTrapPink temp = secondTrapPink teamUpgrade
execute if score firstTrapPink teamUpgrade matches 0 if score secondTrapPink teamUpgrade matches !0 run scoreboard players operation thirdTrapPink temp = thirdTrapPink teamUpgrade
execute if score secondTrapPink temp matches !0 run scoreboard players operation firstTrapPink teamUpgrade = secondTrapPink temp
execute if score secondTrapPink temp matches !0 run scoreboard players operation secondTrapPink teamUpgrade = thirdTrapPink temp
execute if score secondTrapPink temp matches !0 run scoreboard players set thirdTrapPink teamUpgrade 0
scoreboard players reset secondTrapPink temp
scoreboard players reset thirdTrapPink temp

execute if score firstTrapGray teamUpgrade matches 0 if score secondTrapGray teamUpgrade matches !0 run scoreboard players operation secondTrapGray temp = secondTrapGray teamUpgrade
execute if score firstTrapGray teamUpgrade matches 0 if score secondTrapGray teamUpgrade matches !0 run scoreboard players operation thirdTrapGray temp = thirdTrapGray teamUpgrade
execute if score secondTrapGray temp matches !0 run scoreboard players operation firstTrapGray teamUpgrade = secondTrapGray temp
execute if score secondTrapGray temp matches !0 run scoreboard players operation secondTrapGray teamUpgrade = thirdTrapGray temp
execute if score secondTrapGray temp matches !0 run scoreboard players set thirdTrapGray teamUpgrade 0
scoreboard players reset secondTrapGray temp
scoreboard players reset thirdTrapGray temp

execute if score firstTrapCyan teamUpgrade matches 0 if score secondTrapCyan teamUpgrade matches !0 run scoreboard players operation secondTrapCyan temp = secondTrapCyan teamUpgrade
execute if score firstTrapCyan teamUpgrade matches 0 if score secondTrapCyan teamUpgrade matches !0 run scoreboard players operation thirdTrapCyan temp = thirdTrapCyan teamUpgrade
execute if score secondTrapCyan temp matches !0 run scoreboard players operation firstTrapCyan teamUpgrade = secondTrapCyan temp
execute if score secondTrapCyan temp matches !0 run scoreboard players operation secondTrapCyan teamUpgrade = thirdTrapCyan temp
execute if score secondTrapCyan temp matches !0 run scoreboard players set thirdTrapCyan teamUpgrade 0
scoreboard players reset secondTrapCyan temp
scoreboard players reset thirdTrapCyan temp