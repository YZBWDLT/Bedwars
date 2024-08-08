# ===== 队伍相关判定 =====

# --- 判断队伍玩家数目 ---
execute if entity @e[type=player] run function lib/get_data/get_player_amount

# --- 一个队伍无玩家时则认定为团灭 ---
execute if score teamRedPlayers data matches 0 if entity @e[family=bed,family=team_red,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/red/team_eliminated
execute if score teamBluePlayers data matches 0 if entity @e[family=bed,family=team_blue,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/blue/team_eliminated
execute if score teamGreenPlayers data matches 0 if entity @e[family=bed,family=team_green,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/green/team_eliminated
execute if score teamYellowPlayers data matches 0 if entity @e[family=bed,family=team_yellow,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/yellow/team_eliminated
execute if score teamWhitePlayers data matches 0 if entity @e[family=bed,family=team_white,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/white/team_eliminated
execute if score teamPinkPlayers data matches 0 if entity @e[family=bed,family=team_pink,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/pink/team_eliminated
execute if score teamGrayPlayers data matches 0 if entity @e[family=bed,family=team_gray,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/gray/team_eliminated
execute if score teamCyanPlayers data matches 0 if entity @e[family=bed,family=team_cyan,scores={haveBed=0},tag=!eliminated] run function style/hypixel/teams/cyan/team_eliminated

# --- 当只剩下1队存活的时候，游戏结束，判定该队胜利 ---

# 判断被淘汰的队伍数目
scoreboard players set eliminatedTeams data 0
execute as @e[family=bed,tag=eliminated] run scoreboard players add eliminatedTeams data 1

# 红队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamRedPlayers data matches 1.. run function gaming/teams/red/victory
# 蓝队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamBluePlayers data matches 1.. run function gaming/teams/blue/victory
# 绿队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamGreenPlayers data matches 1.. run function gaming/teams/green/victory
# 黄队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamYellowPlayers data matches 1.. run function gaming/teams/yellow/victory
# 白队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamWhitePlayers data matches 1.. run function gaming/teams/white/victory
# 粉队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamPinkPlayers data matches 1.. run function gaming/teams/pink/victory
# 灰队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamGrayPlayers data matches 1.. run function gaming/teams/gray/victory
# 青队胜利
execute if score eliminatedTeams data = gameOverCondition data if score teamCyanPlayers data matches 1.. run function gaming/teams/cyan/victory

