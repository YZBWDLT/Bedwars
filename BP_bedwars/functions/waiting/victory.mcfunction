# ===== 某队胜利后执行的函数 =====

# --- 清理资源生成点 ---
# 方便后续清理展示文本
kill @e[family=resource_spawner]

# --- 停止显示血量 ---
scoreboard objectives setdisplay belowname

# --- 计时10s之后重新开始 ---
execute if score tick time matches 0 run scoreboard players add resetGameCountdown time -1

execute if score resetGameCountdown time matches !1..10 run function lib/reset_game