# ===== 锋利附魔 =====
# 8钻石 -> 锋利附魔

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = dragonBuffRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = dragonBuffBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = dragonBuffGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = dragonBuffYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = dragonBuffWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = dragonBuffPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = dragonBuffGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = dragonBuffCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=1..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..4}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..4}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=5..}] run function gaming/tradings/team_upgrade/dragon_buff_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_dragon_buff