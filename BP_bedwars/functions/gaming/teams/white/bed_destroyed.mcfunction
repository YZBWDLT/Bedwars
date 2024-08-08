# ===== 白队失去床 =====

# --- 更改白队数据 ---
scoreboard players set @e[family=bed,family=team_white] haveBed -1
scoreboard players set @a[scores={team=5}] haveBed -1

# --- 为白队队员播放标题 ---
execute if score titleStyle settings matches 0 run function style/hypixel/bed_destroyed_title

# --- 播放音效 ---
execute if score soundStyle settings matches 0 run function style/hypixel/bed_destroyed_sound

# --- 播报消息 ---
execute if score soundStyle settings matches 0 at @e[family=bed,family=team_white] as @p[scores={team=!5}] run function style/hypixel/teams/white/bed_destroyed

# --- 令床破坏者床的破坏数+1 ---
execute at @e[family=bed,family=team_white] as @p[scores={team=!5}] run scoreboard players add @s bedDestroyedAmount 1

# --- 更改状态 ---
scoreboard players set @e[family=bed,family=team_white] haveBed 0
scoreboard players set @a[scores={team=5}] haveBed 0
