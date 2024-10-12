# ===== 生成 Rooftop =====

# --- 队伍岛 ---

## 红（x翻转）
structure load rooftop:team_island -47 20 -100 0_degrees x layer_by_layer 15.00

## 蓝（xz翻转）
structure load rooftop:team_island 21 20 -100 0_degrees xz layer_by_layer 15.00

## 绿（90°，x翻转）
structure load rooftop:team_island 75 20 -47 90_degrees x layer_by_layer 15.00

## 黄（90°，xz翻转）
structure load rooftop:team_island 75 20 21 90_degrees xz layer_by_layer 15.00

## 青（z翻转）
structure load rooftop:team_island 21 20 75 0_degrees z layer_by_layer 15.00

## 白（默认）
structure load rooftop:team_island -47 20 75 0_degrees none layer_by_layer 15.00

## 粉（90°，z翻转）
structure load rooftop:team_island -100 20 21 90_degrees z layer_by_layer 15.00

## 灰（90°）
structure load rooftop:team_island -100 20 -47 90_degrees none layer_by_layer 15.00

# --- 钻石岛 --- 
structure load rooftop:diamond_island -49 20 -49 0_degrees none layer_by_layer 15.00
structure load rooftop:diamond_island 29 20 -49 90_degrees none layer_by_layer 15.00
structure load rooftop:diamond_island 29 20 29 180_degrees none layer_by_layer 15.00
structure load rooftop:diamond_island -49 20 29 270_degrees none layer_by_layer 15.00

# --- 中岛 ---
structure load rooftop:center_island_1 -22 20 24 0_degrees none layer_by_layer 15.00
structure load rooftop:center_island_1 -70 20 -18 90_degrees none layer_by_layer 15.00
structure load rooftop:center_island_1 -18 20 -70 180_degrees none layer_by_layer 15.00
structure load rooftop:center_island_1 24 20 -22 270_degrees none layer_by_layer 15.00
structure load rooftop:center_island_2 -22 20 -22 0_degrees none layer_by_layer 15.00

