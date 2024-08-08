# ===== 重置游戏 =====
# 用于在游戏结束后重新布置等待大厅和游戏场景。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 清除除玩家外的所有实体，并立即在(0,120,0)生成waitingHall标记；
# · 玩家的末影箱和物品栏被立即清空；
# · 随机地图数据变为0、游戏进程变为0、游戏开始倒计时变为-1秒、游戏重置时间变为10秒。

kill @e[family=!player]
execute unless entity @e[name=waitingHall] run summon bedwars:marker "waitingHall" 0 120 0

clear @a
effect @a clear
execute as @a run function lib/reset_ender_chest

event entity @a remove_team
scoreboard players set @a team 0

effect @a instant_health 1 20 true

scoreboard players set randomMap data 0
scoreboard players set gameProgress data 0
scoreboard players set gameStartCountdown time -1
scoreboard players set resetGameCountdown time 10