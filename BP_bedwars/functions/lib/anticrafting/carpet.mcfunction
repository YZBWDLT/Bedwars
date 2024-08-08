# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 按队伍分别调用清除函数

execute as @s[family=team_red] run function lib/anticrafting/carpet/red
execute as @s[family=team_blue] run function lib/anticrafting/carpet/blue
execute as @s[family=team_green] run function lib/anticrafting/carpet/green
execute as @s[family=team_yellow] run function lib/anticrafting/carpet/yellow
execute as @s[family=team_white] run function lib/anticrafting/carpet/white
execute as @s[family=team_pink] run function lib/anticrafting/carpet/pink
execute as @s[family=team_gray] run function lib/anticrafting/carpet/gray
execute as @s[family=team_cyan] run function lib/anticrafting/carpet/cyan