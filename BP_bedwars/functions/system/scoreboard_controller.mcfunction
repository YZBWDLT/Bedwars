# ===== 快捷栏标题控制器 =====

# 开始游戏前（游戏进程 0）
execute if score gameProgress data matches 0 if score tick time matches 0 run function waiting/scoreboard

# 游戏中（游戏进程 1）
execute if score gameProgress data matches 1..2 if score tick time matches 6 run function gaming/scoreboard
