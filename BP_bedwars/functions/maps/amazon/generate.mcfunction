# ===== 生成 Amazon =====

# --- 队伍岛 ---

## 红（x翻转）
structure load amazon:team_island -54 53 -102 0_degrees x layer_by_layer 5.00

## 蓝（xz翻转）
structure load amazon:team_island 20 53 -102 0_degrees xz layer_by_layer 5.00

## 绿（90°，x翻转）
structure load amazon:team_island 75 53 -54 90_degrees x layer_by_layer 5.00

## 黄（90°，xz翻转）
structure load amazon:team_island 75 53 20 90_degrees xz layer_by_layer 5.00

## 青（z翻转）
structure load amazon:team_island 20 53 75 0_degrees z layer_by_layer 5.00

## 白（默认）
structure load amazon:team_island -54 53 75 0_degrees none layer_by_layer 5.00

## 粉（90°，z翻转）
structure load amazon:team_island -102 53 20 90_degrees z layer_by_layer 5.00

## 灰（90°）
structure load amazon:team_island -102 53 -54 90_degrees none layer_by_layer 5.00

# --- 钻石岛 --- 
structure load amazon:diamond_island -83 56 69 0_degrees none layer_by_layer 5.00
structure load amazon:diamond_island -84 56 -83 90_degrees none layer_by_layer 5.00
structure load amazon:diamond_island 68 56 -84 180_degrees none layer_by_layer 5.00
structure load amazon:diamond_island 69 56 68 270_degrees none layer_by_layer 5.00

# --- 中岛 ---
structure load amazon:center_island_1 -62 45 -62 0_degrees none layer_by_layer 5.00
structure load amazon:center_island_2 2 45 -62 0_degrees none layer_by_layer 5.00
structure load amazon:center_island_3 -62 45 0 0_degrees none layer_by_layer 5.00
structure load amazon:center_island_4 2 45 0 0_degrees none layer_by_layer 5.00
