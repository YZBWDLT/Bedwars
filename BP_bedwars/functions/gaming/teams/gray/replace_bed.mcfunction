# ===== 本队破坏自家的床 =====

# --- 进行提醒 ---
execute if score messageStyle settings matches 0 as @a[family=team_gray,r=6] at @s run function style/hypixel/replace_bed

# --- 重新放置床 ---
execute at @e[family=bed,family=team_gray] if score grayBedDirection data matches 0 run structure load beds:gray_bed ~~~ 0_degrees
execute at @e[family=bed,family=team_gray] if score grayBedDirection data matches 1 run structure load beds:gray_bed ~~~ 90_degrees
execute at @e[family=bed,family=team_gray] if score grayBedDirection data matches 2 run structure load beds:gray_bed ~-1~~ 180_degrees
execute at @e[family=bed,family=team_gray] if score grayBedDirection data matches 3 run structure load beds:gray_bed ~~~-1 270_degrees