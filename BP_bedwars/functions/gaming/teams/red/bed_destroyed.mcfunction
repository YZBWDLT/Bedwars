# ===== 红队失去床 =====

# --- 更改红队数据 ---
scoreboard players set @e[family=bed,family=team_red] haveBed -1
scoreboard players set @a[scores={team=1}] haveBed -1

# --- 为红队队员播放标题 ---
execute if score titleStyle settings matches 0 run function style/hypixel/bed_destroyed_title

# --- 播放音效 ---
execute if score soundStyle settings matches 0 run function style/hypixel/bed_destroyed_sound

# --- 播报消息 ---
execute if score soundStyle settings matches 0 at @e[family=bed,family=team_red] as @p[scores={team=!1}] run function style/hypixel/teams/red/bed_destroyed

# --- 令床破坏者床的破坏数+1 ---
execute at @e[family=bed,family=team_red] as @p[scores={team=!1}] run scoreboard players add @s bedDestroyedAmount 1

# --- 更改状态 ---
scoreboard players set @e[family=bed,family=team_red] haveBed 0
scoreboard players set @a[scores={team=1}] haveBed 0
