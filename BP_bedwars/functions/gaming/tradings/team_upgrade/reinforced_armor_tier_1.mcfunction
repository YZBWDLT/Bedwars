# ===== 盔甲强化I =====
# 5钻石 -> 抗性提升 I

# --- 获取该玩家当前队伍的状态 ---
scoreboard players operation @s[scores={team=1}] temp = reinforcedArmorRed teamUpgrade
scoreboard players operation @s[scores={team=2}] temp = reinforcedArmorBlue teamUpgrade
scoreboard players operation @s[scores={team=3}] temp = reinforcedArmorGreen teamUpgrade
scoreboard players operation @s[scores={team=4}] temp = reinforcedArmorYellow teamUpgrade
scoreboard players operation @s[scores={team=5}] temp = reinforcedArmorWhite teamUpgrade
scoreboard players operation @s[scores={team=6}] temp = reinforcedArmorPink teamUpgrade
scoreboard players operation @s[scores={team=7}] temp = reinforcedArmorGray teamUpgrade
scoreboard players operation @s[scores={team=8}] temp = reinforcedArmorCyan teamUpgrade

# --- 当该队伍有该升级时 ---

execute if entity @s[scores={temp=1..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=1..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_team_upgrade"}]}

# --- 当该队伍无所需升级时 ---

# --- 当该队伍无该升级时 ---

## 当该玩家物资不足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..4}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=..4}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当该玩家物资充足时
execute if entity @s[scores={temp=0},hasitem={item=bedwars:diamond,quantity=5..}] run function gaming/tradings/team_upgrade/reinforced_armor_tier_1_2

# --- 清除标记物品 ---
clear @s bedwars:upgrade_reinforced_armor_tier_1