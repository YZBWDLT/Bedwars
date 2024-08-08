# ===== 设置小岛队伍 =====

# --- 清除原有的岛上的床 ---
setblock 0 65 61 air
setblock 0 65 -63 air

# --- 生成床 ---
structure load beds:red_bed 0 65 61 90_degrees
structure load beds:blue_bed 0 65 -63 270_degrees

# --- 标记队伍旗子颜色 ---
fill -13 81 68 5 75 71 bedwars:scene_block_red_wool [] replace bedwars:scene_block_white_wool []
fill 13 81 -69 -5 75 -72 bedwars:scene_block_blue_wool [] replace bedwars:scene_block_white_wool []
