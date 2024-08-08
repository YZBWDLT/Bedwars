# ===== 分配队伍 =====
# 将所有玩家分配为4个队伍

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 将所有玩家平均分类为4个队伍，并添加对应记分板和family。
# · 若有队伍没有分配到队员，则该队的床标记将被打上淘汰标签。

# --- 设置所有玩家为无队状态 ---
scoreboard players set @a team 0

# --- 设置随机玩家为随机队伍 ---
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 3
scoreboard players set @r[scores={team=0}] team 4
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 3
scoreboard players set @r[scores={team=0}] team 4
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 3
scoreboard players set @r[scores={team=0}] team 4
scoreboard players set @r[scores={team=0}] team 1
scoreboard players set @r[scores={team=0}] team 2
scoreboard players set @r[scores={team=0}] team 3
scoreboard players set @r[scores={team=0}] team 4

# --- 设置玩家的family ---
event entity @a[scores={team=1}] team_red
event entity @a[scores={team=2}] team_blue
event entity @a[scores={team=3}] team_green
event entity @a[scores={team=4}] team_yellow

# --- 如果特定队伍没有队员，为该队打上淘汰标签 ---
execute unless entity @a[scores={team=3}] run tag @e[family=bed,family=team_green] add eliminated
execute unless entity @a[scores={team=4}] run tag @e[family=bed,family=team_yellow] add eliminated