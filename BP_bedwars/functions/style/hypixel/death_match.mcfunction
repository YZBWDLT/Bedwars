# ===== 绝杀模式 =====

# --- 显示标题 ---
titleraw @a title {"rawtext":[{"translate":"style.hypixel.death_match.title"}]}

# --- 先按照存活的队伍数目决定生成1条末影龙 ---
execute as @e[family=bed,tag=!eliminated] at @e[family=respawner] positioned ~~-5~ run summon ender_dragon

# --- 选择了末影龙增益的队伍，再生成一条末影龙 ---
#       ↓ 启用了末影龙增益                            ↓ 该队未被淘汰                                            ↓ 在respanwer下方5格生成末影龙
execute if score dragonBuffRed teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_red] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffBlue teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_blue] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffGreen teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_green] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffYellow teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_yellow] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffWhite teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_white] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffPink teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_pink] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffGray teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_gray] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
execute if score dragonBuffCyan teamUpgrade matches 1 if entity @e[family=bed,tag=!eliminated,family=team_cyan] at @e[family=respawner] positioned ~~-5~  run summon ender_dragon
