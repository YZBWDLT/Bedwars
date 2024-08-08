# ===== 玩家重生 =====
# 用于执行玩家重生的程序。

# 调用此方法时：
# · 执行者需为玩家
# · 执行位置需为玩家所在位置
# 输出结果：
# · 执行以下程序。


# --- 将玩家传送到重生点处，并面向床 ---
function lib/programs/tp_players_to_respawner

# --- 重置玩家的游戏模式 ---
gamemode survival @s

# --- 提供初始木剑并为死亡玩家的工具降级 ---
give @s wooden_sword 1 0 {"item_lock": { "mode": "lock_in_inventory" }}
scoreboard players remove @s[scores={axeLevel=2..}] axeLevel 1
scoreboard players remove @s[scores={pickaxeLevel=2..}] pickaxeLevel 1

# --- 重新设置玩家的存活状态 ---
tag @s add isAlive
