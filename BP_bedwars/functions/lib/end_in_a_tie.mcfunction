# ===== 游戏以平局结束 =====
# 当游戏以平局结束后执行的命令

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 按照设置的样式展示标题和消息，并更改游戏进程为2（结束状态）。

execute if score titleStyle settings matches 0 run function style/hypixel/end_in_a_tie_title
execute if score messageStyle settings matches 0 run function style/hypixel/end_in_a_tie_message

scoreboard players set gameProgress data 2
