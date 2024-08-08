# ===== 本队破坏自家的床 =====

# --- 进行提醒 ---
execute if score messageStyle settings matches 0 as @a[family=team_green,r=6] at @s run function style/hypixel/replace_bed

# --- 重新放置床 ---
execute at @e[family=bed,family=team_green] if score greenBedDirection data matches 0 run structure load beds:green_bed ~~~ 0_degrees
execute at @e[family=bed,family=team_green] if score greenBedDirection data matches 1 run structure load beds:green_bed ~~~ 90_degrees
execute at @e[family=bed,family=team_green] if score greenBedDirection data matches 2 run structure load beds:green_bed ~-1~~ 180_degrees
execute at @e[family=bed,family=team_green] if score greenBedDirection data matches 3 run structure load beds:green_bed ~~~-1 270_degrees