# ===== 同步床数据 =====
# 用于更新退出重进的玩家的床数据。

# 调用此方法时：
# · 执行者需为玩家
# · 执行位置任意
# 输出结果：
# · haveBed.@s = haveBed.@e[family=bed]

execute if entity @s[family=team_red] run scoreboard players operation @s haveBed = @e[family=bed,family=team_red] haveBed
execute if entity @s[family=team_blue] run scoreboard players operation @s haveBed = @e[family=bed,family=team_blue] haveBed
execute if entity @s[family=team_green] run scoreboard players operation @s haveBed = @e[family=bed,family=team_green] haveBed
execute if entity @s[family=team_yellow] run scoreboard players operation @s haveBed = @e[family=bed,family=team_yellow] haveBed
execute if entity @s[family=team_white] run scoreboard players operation @s haveBed = @e[family=bed,family=team_white] haveBed
execute if entity @s[family=team_pink] run scoreboard players operation @s haveBed = @e[family=bed,family=team_pink] haveBed
execute if entity @s[family=team_gray] run scoreboard players operation @s haveBed = @e[family=bed,family=team_gray] haveBed
execute if entity @s[family=team_cyan] run scoreboard players operation @s haveBed = @e[family=bed,family=team_cyan] haveBed
