# ===== 生成 Deadwood =====

# --- 队伍岛 ---

## 红（x翻转）
structure load deadwood:team_island -41 52 -105 0_degrees x layer_by_layer 5.00

## 蓝（xz翻转）
structure load deadwood:team_island 19 52 -105 0_degrees xz layer_by_layer 5.00

## 绿（90°，x翻转）
structure load deadwood:team_island 74 52 -41 90_degrees x layer_by_layer 5.00

## 黄（90°，xz翻转）
structure load deadwood:team_island 74 52 19 90_degrees xz layer_by_layer 5.00

## 青（z翻转）
structure load deadwood:team_island 19 52 74 0_degrees z layer_by_layer 5.00

## 白（默认）
structure load deadwood:team_island -41 52 74 0_degrees none layer_by_layer 5.00

## 粉（90°，z翻转）
structure load deadwood:team_island -105 52 19 90_degrees z layer_by_layer 5.00

## 灰（90°）
structure load deadwood:team_island -105 52 -41 90_degrees none layer_by_layer 5.00

# --- 侧岛 ---
structure load deadwood:side_island -15 50 50 0_degrees none layer_by_layer 5.00
structure load deadwood:side_island -90 50 -15 90_degrees none layer_by_layer 5.00
structure load deadwood:side_island -15 50 -90 180_degrees none layer_by_layer 5.00
structure load deadwood:side_island 50 50 -15 270_degrees none layer_by_layer 5.00

# --- 钻石岛 --- 
structure load deadwood:diamond_island -69 57 24 0_degrees none layer_by_layer 5.00
structure load deadwood:diamond_island -69 57 -69 0_degrees x layer_by_layer 5.00
structure load deadwood:diamond_island 24 57 -69 0_degrees xz layer_by_layer 5.00
structure load deadwood:diamond_island 24 57 24 0_degrees z layer_by_layer 5.00

# --- 中岛 ---
structure load deadwood:center_island_1 -32 50 -32 0_degrees none layer_by_layer 5.00
structure load deadwood:center_island_2 32 61 -5 0_degrees none layer_by_layer 5.00
structure load deadwood:center_island_3 -5 61 32 0_degrees none layer_by_layer 5.00
