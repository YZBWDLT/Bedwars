# ===== 玩家存活检测 =====
# 用于检测玩家是否处于存活状态

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 若玩家存活，则有isAlive标签；若处于死亡状态，则移除isAlive标签

# --- 主体部分 ---
# 假定所有玩家均未存活（@a对全体玩家生效）
tag @a remove isAlive
# 为存活玩家添加存活标签（@e[type=player]仅对存活玩家生效）
tag @e[type=player] add isAlive
