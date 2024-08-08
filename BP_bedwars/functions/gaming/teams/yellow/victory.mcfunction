# ===== 蓝队胜利 =====

# --- 显示标题 ---
execute if score titleStyle settings matches 0 run function style/hypixel/teams/yellow/victory_title
# --- 显示音效 ---

# --- 显示消息 ---
execute if score messageStyle settings matches 0 run function style/hypixel/teams/yellow/victory_message

# --- 增加胜利次数 ---
scoreboard players add @a[family=team_yellow] winTimes 1

# --- 更改游戏进程 ---
scoreboard players set gameProgress data 2
