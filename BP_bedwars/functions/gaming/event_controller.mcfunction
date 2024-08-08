# ===== 事件控制器 =====

# --- 倒计时 ---
execute if score tick time matches 0 run scoreboard players remove eventSecond time 1
execute if score eventSecond time matches ..-1 run scoreboard players remove eventMinute time 1
execute if score eventSecond time matches ..-1 run scoreboard players set eventSecond time 59
execute if score eventMinute time matches 0 if score eventSecond time matches 0 run scoreboard players add eventId data 1

# --- 钻石生成点II级 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 1 run event entity @e[family=diamond_spawner] spawn_as_tier_2
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 1 run tellraw @a {"rawtext":[{"translate":"system.diamond_spawner.upgraded_to_tier_2"}]}

# --- 绿宝石生成点II级 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 2 run event entity @e[family=emerald_spawner] spawn_as_tier_2
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 2 run tellraw @a {"rawtext":[{"translate":"system.emerald_spawner.upgraded_to_tier_2"}]}

# --- 钻石生成点III级 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 3 run event entity @e[family=diamond_spawner] spawn_as_tier_3
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 3 run tellraw @a {"rawtext":[{"translate":"system.diamond_spawner.upgraded_to_tier_3"}]}

# --- 绿宝石生成点III级 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 4 run event entity @e[family=emerald_spawner] spawn_as_tier_2
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 4 run tellraw @a {"rawtext":[{"translate":"system.emerald_spawner.upgraded_to_tier_3"}]}

# --- 床自毁 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 5 run function style/hypixel/all_teams_bed_destroyed

# --- 绝杀模式 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 6 run function style/hypixel/death_match

# --- 游戏结束 - 6：00 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 if score eventId data matches 7 run function lib/end_in_a_tie

# --- 重置倒计时 ---
execute if score eventMinute time matches 0 if score eventSecond time matches 0 run scoreboard players set eventMinute time 6
