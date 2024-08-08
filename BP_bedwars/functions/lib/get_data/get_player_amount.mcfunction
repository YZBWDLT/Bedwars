# ===== 获取玩家人数 =====
# 用于检测各队玩家人数和当前房间内玩家总人数。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 输出当前所有玩家人数（data.playerAmount）
# · 输出各队伍人数（data.team(Team)Amount）

scoreboard players set playerAmount data 0
scoreboard players set teamRedPlayers data 0
scoreboard players set teamBluePlayers data 0
scoreboard players set teamGreenPlayers data 0
scoreboard players set teamYellowPlayers data 0
scoreboard players set teamWhitePlayers data 0
scoreboard players set teamPinkPlayers data 0
scoreboard players set teamGrayPlayers data 0
scoreboard players set teamCyanPlayers data 0

execute as @a run scoreboard players add playerAmount data 1
execute as @a[family=team_red] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamRedPlayers data 1
execute as @a[family=team_blue] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamBluePlayers data 1
execute as @a[family=team_green] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamGreenPlayers data 1
execute as @a[family=team_yellow] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamYellowPlayers data 1
execute as @a[family=team_pink] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamPinkPlayers data 1
execute as @a[family=team_gray] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamGrayPlayers data 1
execute as @a[family=team_cyan] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamCyanPlayers data 1
execute as @a[family=team_white] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamWhitePlayers data 1
