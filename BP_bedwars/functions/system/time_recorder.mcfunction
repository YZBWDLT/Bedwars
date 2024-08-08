# ===== 时间记录器 =====

# --- 刻记录器 ---
scoreboard players add tick time 1
execute if score tick time matches !0..20 run scoreboard players set tick time 0

