# ===== 生成 Glacier =====

# --- 队伍岛 ---

## 红（x翻转）
structure load glacier:team_island -44 66 -89 0_degrees x layer_by_layer 5.00

## 蓝（xz翻转）
structure load glacier:team_island 19 66 -89 0_degrees xz layer_by_layer 5.00

## 绿（90°，x翻转）
structure load glacier:team_island 62 66 -44 90_degrees x layer_by_layer 5.00

## 黄（90°，xz翻转）
structure load glacier:team_island 62 66 19 90_degrees xz layer_by_layer 5.00

## 青（z翻转）
structure load glacier:team_island 19 66 62 0_degrees z layer_by_layer 5.00

## 白（默认）
structure load glacier:team_island -44 66 62 0_degrees none layer_by_layer 5.00

## 粉（90°，z翻转）
structure load glacier:team_island -89 66 19 90_degrees z layer_by_layer 5.00

## 灰（90°）
structure load glacier:team_island -89 66 -44 90_degrees none layer_by_layer 5.00

# --- 钻石岛 --- 
structure load glacier:diamond_island -9 75 43 0_degrees none layer_by_layer 5.00
structure load glacier:diamond_island -56 75 -9 90_degrees none layer_by_layer 5.00
structure load glacier:diamond_island -9 75 -56 180_degrees none layer_by_layer 5.00
structure load glacier:diamond_island 43 75 -9 270_degrees none layer_by_layer 5.00

# --- 中岛 ---
structure load glacier:center_island -27 55 -27 0_degrees none layer_by_layer 5.00

