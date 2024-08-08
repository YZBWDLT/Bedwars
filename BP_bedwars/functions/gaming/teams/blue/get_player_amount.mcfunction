# ===== 获取队伍人数 =====

scoreboard players set teamBluePlayers data 0
# 当玩家有床，或无床存活时，或无床等待重生时，记作1名玩家
execute as @a[family=team_blue] unless entity @s[tag=!isAlive,scores={haveBed=0,time=-1}] run scoreboard players add teamBluePlayers data 1