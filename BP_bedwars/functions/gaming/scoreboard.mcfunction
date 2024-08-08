# ===== 快捷栏标题 =====
# 快捷栏标题已被挪到右侧成为”伪记分板“

# --- 获取下一个事件名称 ---
execute at @e[family=respawner] run kill @e[family=show_for_scoreboard,r=2]
execute at @e[family=respawner] if score eventId data matches 0 run summon bedwars:marker ~~1~ next_event_name "钻石生成点II级"
execute at @e[family=respawner] if score eventId data matches 1 run summon bedwars:marker ~~1~ next_event_name "绿宝石生成点II级"
execute at @e[family=respawner] if score eventId data matches 2 run summon bedwars:marker ~~1~ next_event_name "钻石生成点III级"
execute at @e[family=respawner] if score eventId data matches 3 run summon bedwars:marker ~~1~ next_event_name "绿宝石生成点III级"
execute at @e[family=respawner] if score eventId data matches 4 run summon bedwars:marker ~~1~ next_event_name "床自毁"
execute at @e[family=respawner] if score eventId data matches 5 run summon bedwars:marker ~~1~ next_event_name "绝杀模式"
execute at @e[family=respawner] if score eventId data matches 6.. run summon bedwars:marker ~~1~ next_event_name "游戏结束"

# --- 获取队伍的床情况
execute if entity @e[family=bed,family=team_red,tag=!eliminated,scores={haveBed=1}] run function style/hypixel/teams/red/scoreboard/have_bed
execute if entity @e[family=bed,family=team_red,tag=!eliminated,scores={haveBed=0}] run function style/hypixel/teams/red/scoreboard/have_no_bed
execute if entity @e[family=bed,family=team_red,tag=eliminated] run function style/hypixel/teams/red/scoreboard/eliminated

execute if entity @e[family=bed,family=team_blue,tag=!eliminated,scores={haveBed=1}] run function style/hypixel/teams/blue/scoreboard/have_bed
execute if entity @e[family=bed,family=team_blue,tag=!eliminated,scores={haveBed=0}] run function style/hypixel/teams/blue/scoreboard/have_no_bed
execute if entity @e[family=bed,family=team_blue,tag=eliminated] run function style/hypixel/teams/blue/scoreboard/eliminated

execute if entity @e[family=bed,family=team_green,tag=!eliminated,scores={haveBed=1}] run function style/hypixel/teams/green/scoreboard/have_bed
execute if entity @e[family=bed,family=team_green,tag=!eliminated,scores={haveBed=0}] run function style/hypixel/teams/green/scoreboard/have_no_bed
execute if entity @e[family=bed,family=team_green,tag=eliminated] run function style/hypixel/teams/green/scoreboard/eliminated

execute if entity @e[family=bed,family=team_yellow,tag=!eliminated,scores={haveBed=1}] run function style/hypixel/teams/yellow/scoreboard/have_bed
execute if entity @e[family=bed,family=team_yellow,tag=!eliminated,scores={haveBed=0}] run function style/hypixel/teams/yellow/scoreboard/have_no_bed
execute if entity @e[family=bed,family=team_yellow,tag=eliminated] run function style/hypixel/teams/yellow/scoreboard/eliminated

execute if score maxTeamAmount data matches 2 run function lib/gaming_scoreboards/2_teams
execute if score maxTeamAmount data matches 4 run function lib/gaming_scoreboards/4_teams
execute if score maxTeamAmount data matches 8 run function lib/gaming_scoreboards/8_teams