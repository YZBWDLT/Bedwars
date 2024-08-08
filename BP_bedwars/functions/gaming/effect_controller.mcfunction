# ===== 状态效果控制器 =====

# --- 饱和效果 ---
execute if score tick time matches 1 run effect @a saturation 1 10 true

# --- 给火焰弹周围3格内的玩家1秒的抗性提升III ---
execute as @e[type=bedwars:fireball] at @s as @a[r=3] run effect @s resistance 1 2 true

# --- 治愈池效果 ---
execute as @e[name=redTeamRespawn] at @s if score healPoolRed teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=1},r=20] regeneration 2 0 true
execute as @e[name=blueTeamRespawn] at @s if score healPoolBlue teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=2},r=20] regeneration 2 0 true
execute as @e[name=greenTeamRespawn] at @s if score healPoolGreen teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=3},r=20] regeneration 2 0 true
execute as @e[name=yellowTeamRespawn] at @s if score healPoolYellow teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=4},r=20] regeneration 2 0 true
execute as @e[name=whiteTeamRespawn] at @s if score healPoolWhite teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=5},r=20] regeneration 2 0 true
execute as @e[name=pinkTeamRespawn] at @s if score healPoolPink teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=6},r=20] regeneration 2 0 true
execute as @e[name=grayTeamRespawn] at @s if score healPoolGray teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=7},r=20] regeneration 2 0 true
execute as @e[name=cyanTeamRespawn] at @s if score healPoolCyan teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=8},r=20] regeneration 2 0 true

# --- 盔甲强化效果 ---
execute if score reinforcedArmorRed teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=1}] resistance 30 0 true
execute if score reinforcedArmorBlue teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=2}] resistance 30 0 true
execute if score reinforcedArmorGreen teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=3}] resistance 30 0 true
execute if score reinforcedArmorYellow teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=4}] resistance 30 0 true
execute if score reinforcedArmorWhite teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=5}] resistance 30 0 true
execute if score reinforcedArmorPink teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=6}] resistance 30 0 true
execute if score reinforcedArmorGray teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=7}] resistance 30 0 true
execute if score reinforcedArmorCyan teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=8}] resistance 30 0 true

execute if score reinforcedArmorRed teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=1}] resistance 30 1 true
execute if score reinforcedArmorBlue teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=2}] resistance 30 1 true
execute if score reinforcedArmorGreen teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=3}] resistance 30 1 true
execute if score reinforcedArmorYellow teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=4}] resistance 30 1 true
execute if score reinforcedArmorWhite teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=5}] resistance 30 1 true
execute if score reinforcedArmorPink teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=6}] resistance 30 1 true
execute if score reinforcedArmorGray teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=7}] resistance 30 1 true
execute if score reinforcedArmorCyan teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=8}] resistance 30 1 true

execute if score reinforcedArmorRed teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=1}] resistance 30 2 true
execute if score reinforcedArmorBlue teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=2}] resistance 30 2 true
execute if score reinforcedArmorGreen teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=3}] resistance 30 2 true
execute if score reinforcedArmorYellow teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=4}] resistance 30 2 true
execute if score reinforcedArmorWhite teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=5}] resistance 30 2 true
execute if score reinforcedArmorPink teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=6}] resistance 30 2 true
execute if score reinforcedArmorGray teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=7}] resistance 30 2 true
execute if score reinforcedArmorCyan teamUpgrade matches 3 if score tick time matches 1 run effect @a[scores={team=8}] resistance 30 2 true

execute if score reinforcedArmorRed teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=1}] resistance 30 3 true
execute if score reinforcedArmorBlue teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=2}] resistance 30 3 true
execute if score reinforcedArmorGreen teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=3}] resistance 30 3 true
execute if score reinforcedArmorYellow teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=4}] resistance 30 3 true
execute if score reinforcedArmorWhite teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=5}] resistance 30 3 true
execute if score reinforcedArmorPink teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=6}] resistance 30 3 true
execute if score reinforcedArmorGray teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=7}] resistance 30 3 true
execute if score reinforcedArmorCyan teamUpgrade matches 4 if score tick time matches 1 run effect @a[scores={team=8}] resistance 30 3 true

# --- 急迫效果 ---
execute if score maniacMinerRed teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=1}] haste 30 0 true
execute if score maniacMinerBlue teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=2}] haste 30 0 true
execute if score maniacMinerGreen teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=3}] haste 30 0 true
execute if score maniacMinerYellow teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=4}] haste 30 0 true
execute if score maniacMinerWhite teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=5}] haste 30 0 true
execute if score maniacMinerPink teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=6}] haste 30 0 true
execute if score maniacMinerGray teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=7}] haste 30 0 true
execute if score maniacMinerCyan teamUpgrade matches 1 if score tick time matches 1 run effect @a[scores={team=8}] haste 30 0 true

execute if score maniacMinerRed teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=1}] haste 30 1 true
execute if score maniacMinerBlue teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=2}] haste 30 1 true
execute if score maniacMinerGreen teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=3}] haste 30 1 true
execute if score maniacMinerYellow teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=4}] haste 30 1 true
execute if score maniacMinerWhite teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=5}] haste 30 1 true
execute if score maniacMinerPink teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=6}] haste 30 1 true
execute if score maniacMinerGray teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=7}] haste 30 1 true
execute if score maniacMinerCyan teamUpgrade matches 2 if score tick time matches 1 run effect @a[scores={team=8}] haste 30 1 true
