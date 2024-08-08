# ===== 锋利附魔 =====
# 8钻石 -> 锋利附魔

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = sharpenedSwordsRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = sharpenedSwordsBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = sharpenedSwordsGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = sharpenedSwordsYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = sharpenedSwordsWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = sharpenedSwordsPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = sharpenedSwordsGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = sharpenedSwordsCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=1..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..7}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..7}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=8..}] run function gaming/tradings/team_upgrade/sharpened_swords_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_sharpened_swords