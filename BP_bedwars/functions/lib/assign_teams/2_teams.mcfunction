# ===== 分配队伍 =====
# 将所有玩家分配为2个队伍

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 将所有玩家平均分类为2个队伍，并添加对应记分板和family。


# --- 设置所有玩家为无队状态 ---
scoreboard players set @a team 0

# --- 设置随机玩家为随机队伍 ---
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2

# --- 设置玩家的family ---
event entity @a[scores={team=1}] team_red
event entity @a[scores={team=2}] team_blue
