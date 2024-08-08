# ===== 锋利附魔 =====
# 8钻石 -> 锋利附魔

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = firstTrapRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = firstTrapBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = firstTrapGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = firstTrapYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = firstTrapWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = firstTrapPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = firstTrapGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = firstTrapCyan teamUpgrade

scoreboard players operation @s[scores={team=1}] temp2 = secondTrapRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp2 = secondTrapBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp2 = secondTrapGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp2 = secondTrapYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp2 = secondTrapWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp2 = secondTrapPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp2 = secondTrapGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp2 = secondTrapCyan teamUpgrade

scoreboard players operation @s[scores={team=1}] temp3 = thirdTrapRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp3 = thirdTrapBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp3 = thirdTrapGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp3 = thirdTrapYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp3 = thirdTrapWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp3 = thirdTrapPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp3 = thirdTrapGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp3 = thirdTrapCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=1..,temp2=1..,temp3=1..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..,temp2=1..,temp3=1..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=0}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=0}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

execute if entity @s[scores={temp=1..,temp2=0},hasitem={item=bedwars:diamond,quantity=..1}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..,temp2=0},hasitem={item=bedwars:diamond,quantity=..1}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

execute if entity @s[scores={temp=1..,temp2=1..,temp3=0},hasitem={item=bedwars:diamond,quantity=..3}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..,temp2=1..,temp3=0},hasitem={item=bedwars:diamond,quantity=..3}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=1..}] run function gaming/tradings/team_upgrade/alarm_trap_2
execute if entity @s[scores={temp=1..,temp2=0},hasitem={item=bedwars:diamond,quantity=2..}] run function gaming/tradings/team_upgrade/alarm_trap_3
execute if entity @s[scores={temp=1..,temp2=1..,temp3=0},hasitem={item=bedwars:diamond,quantity=4..}] run function gaming/tradings/team_upgrade/alarm_trap_4

# --- 清除标记物品 ---
clear @s bedwars:upgrade_alarm_trap