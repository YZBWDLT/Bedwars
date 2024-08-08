# ===== 疯狂矿工II =====
# 6钻石 -> 抗性提升 II

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = maniacMinerRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = maniacMinerBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = maniacMinerGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = maniacMinerYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = maniacMinerWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = maniacMinerPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = maniacMinerGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = maniacMinerCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=2..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=2..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---
execute if entity @s[scores={temp=..0}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=..0}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"team_upgrade.maniac_miner_tier_1"}]}}]}

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=..5}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=..5}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=1},hasitem={item=bedwars:diamond,quantity=6..}] run function gaming/tradings/team_upgrade/maniac_miner_tier_2_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_maniac_miner_tier_2