# ===== 退出重进玩家检测 =====
# 用于检测退出重进的玩家。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# · 将before命令先执行，并在中间夹带要执行的命令后执行after命令。
# 输出结果：
# · 在线玩家输出为isOnline.@s=1，不在线玩家输出为isOnline.@s=0。（正确搭配使用时）

scoreboard players add @a isOnline 0