# ===== 设置小岛队伍 =====

# --- 清除原有的岛上的床 ---
setblock 48 66 0 air
setblock 0 66 48 air
setblock -49 66 0 air
setblock 0 66 -49 air

# --- 生成床 ---
structure load beds:red_bed 48 66 0 0_degrees
structure load beds:blue_bed 0 66 48 90_degrees
structure load beds:green_bed -49 66 0 180_degrees
structure load beds:yellow_bed 0 66 -49 270_degrees

# --- 标记队伍旗子颜色 ---
fill 67 59 -6 45 74 7 bedwars:scene_block_red_wool [] replace bedwars:scene_block_white_wool []
fill 6 59 67 -7 74 45 bedwars:scene_block_blue_wool [] replace bedwars:scene_block_white_wool []
fill -67 59 6 -45 74 -7 bedwars:scene_block_lime_wool [] replace bedwars:scene_block_white_wool []
fill -6 59 -67 7 74 -45 bedwars:scene_block_yellow_wool [] replace bedwars:scene_block_white_wool []
