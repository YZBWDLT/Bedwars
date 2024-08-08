# ===== 测试专用函数 =====

kill @e[family=!player]
scoreboard players set randomMap data 0
scoreboard players set gameStartCountdown time -1
scoreboard players set gameProgress data 0
execute unless entity @e[name=waitingHall] run summon bedwars:marker "waitingHall" 0 120 0
clear @a
