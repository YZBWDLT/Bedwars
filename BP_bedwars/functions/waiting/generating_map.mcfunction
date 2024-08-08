# ===== 生成随机地图 =====

# --- 阶段计时 ---
execute if score tick time matches 0 run scoreboard players add randomMap time 1

# --- 确定生成何种地图 | 2s ---
execute if score randomMap active matches 1 run scoreboard players random randomMap data 1 2
execute if score randomMap active matches 1 if score randomMap time matches 2.. run function lib/modify_data/generating_map_next_phase

# --- 确定常加载区域 | 3s ---
execute if score randomMap active matches 2 if score tick time matches 0 run function init/tickingarea_and_border
execute if score randomMap active matches 2 if score randomMap time matches 3.. run function lib/modify_data/generating_map_next_phase

# --- 清除原地图 | ~60s ---
execute if score randomMap active matches 3 unless entity @e[name=sceneReseter] run summon bedwars:marker "sceneReseter" 0 116 0
## 每隔0.5s清除一层
execute if score randomMap active matches 3 if score tick time matches 8 as @e[name=sceneReseter] at @s run function lib/scene_reseter
execute if score randomMap active matches 3 if score tick time matches 18 as @e[name=sceneReseter] at @s run function lib/scene_reseter

# --- 生成新地图 | 7s ---
execute if score randomMap active matches 4 if score tick time matches 0 if score randomMap time matches 1 if score randomMap data matches 1 run function maps/boletum/generate_map
execute if score randomMap active matches 4 if score tick time matches 0 if score randomMap time matches 1 if score randomMap data matches 2 run function maps/carapace/generate_map
execute if score randomMap active matches 4 if score tick time matches 0 if score randomMap time matches 1 if score randomMap data matches 3 run function maps/picnic/generate_map
execute if score randomMap active matches 4 if score randomMap time matches 7.. run function lib/modify_data/generating_map_next_phase

# --- 确定队伍 | 2s ---
execute if score randomMap active matches 5 if score randomMap data matches 1 run function maps/boletum/set_team_island
execute if score randomMap active matches 5 if score randomMap data matches 2 run function maps/carapace/set_team_island
execute if score randomMap active matches 5 if score randomMap data matches 3 run function maps/picnic/set_team_island
execute if score randomMap active matches 5 if score randomMap time matches 2.. run scoreboard players set randomMap active 0

