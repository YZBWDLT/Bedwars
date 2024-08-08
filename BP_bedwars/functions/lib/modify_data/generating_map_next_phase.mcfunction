# ===== 下一阶段 =====
# 用于重新开始生成地图的下一步骤初始化。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · active.randomMap += 1
# · time.randomMap = 0

scoreboard players add randomMap active 1
scoreboard players set randomMap time 0