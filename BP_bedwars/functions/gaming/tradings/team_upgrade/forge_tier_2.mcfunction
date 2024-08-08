# ===== 锻炉 =====
# 8钻石 -> 金锻炉

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = forgeRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = forgeBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = forgeGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = forgeYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = forgeWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = forgePink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = forgeGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = forgeCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=2..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=2..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---
execute if entity @s[scores={temp=..0}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=..0}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"team_upgrade.forge_tier_1"}]}}]}

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=..7}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=..7}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=8..}] run function gaming/tradings/team_upgrade/forge_tier_2_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_forge_tier_2