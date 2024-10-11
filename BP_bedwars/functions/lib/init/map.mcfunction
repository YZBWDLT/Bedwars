# ===== 地图初始化时执行的命令 =====

# --- 进行记分板、常加载区域等的初始化 ---
function lib/init/tickingarea
function lib/init/gamerule
function lib/init/scoreboard

# --- 清除玩家物品 ---
clear @a
execute as @a run function lib/modify_data/reset_ender_chest

# --- 生成等待大厅 ---
structure load hypixel:waiting_hall -12 117 -12

# --- 设置玩家出生点 ---
setworldspawn 0 121 0
