# ===== 治愈池 =====
# 3钻石 -> 治愈池

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = healPoolRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = healPoolBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = healPoolGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = healPoolYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = healPoolWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = healPoolPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = healPoolGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = healPoolCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=1..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..2}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..2}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=3..}] run function gaming/tradings/team_upgrade/heal_pool_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_heal_pool