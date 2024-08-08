# ===== 设置小岛队伍 =====

# --- 清除原有的岛上的床 ---
setblock 66 59 -2 air
setblock 0 59 66 air
setblock -69 59 0 air
setblock -2 59 -69 air

# --- 生成床 ---
structure load beds:red_bed 66 59 -2 0_degrees
structure load beds:blue_bed 0 59 66 90_degrees
structure load beds:green_bed -69 59 0 180_degrees
structure load beds:yellow_bed -2 59 -69 270_degrees

# --- 标记队伍旗子颜色 ---
fill 69 72 -11 74 75 7 bedwars:scene_block_red_wool [] replace bedwars:scene_block_white_wool []
fill 9 72 69 -9 75 74 bedwars:scene_block_blue_wool [] replace bedwars:scene_block_white_wool []
fill -71 72 9 -76 75 -9 bedwars:scene_block_lime_wool [] replace bedwars:scene_block_white_wool []
fill -11 72 -71 7 75 -76 bedwars:scene_block_yellow_wool [] replace bedwars:scene_block_white_wool []
