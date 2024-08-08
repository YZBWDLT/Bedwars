# ===== 所有队伍的床强制摧毁 =====

scoreboard players set @s haveBed 0
execute as @s at @s run setblock ~~~ air
tag @e[family=bed,family=team_red] add eliminated