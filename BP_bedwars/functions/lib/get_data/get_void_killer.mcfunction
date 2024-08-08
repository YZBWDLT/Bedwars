# ===== 推入虚空击杀者检测 =====
# 当玩家被击落虚空后，用于检测击杀该玩家的击杀者。

# 调用此方法时：
# · 执行者为被击杀的玩家
# · 执行位置为被击杀的玩家在掉进虚空后的位置
# 输出结果：
# · 输出非同队且20秒内有伤害的最近玩家为killer。

execute if entity @s[family=team_red] as @a[c=1,scores={damageType=!0},family=!team_red] run tag @s add killer
execute if entity @s[family=team_blue] as @a[c=1,scores={damageType=!0},family=!team_blue] run tag @s add killer
execute if entity @s[family=team_green] as @a[c=1,scores={damageType=!0},family=!team_green] run tag @s add killer
execute if entity @s[family=team_yellow] as @a[c=1,scores={damageType=!0},family=!team_yellow] run tag @s add killer
execute if entity @s[family=team_white] as @a[c=1,scores={damageType=!0},family=!team_white] run tag @s add killer
execute if entity @s[family=team_pink] as @a[c=1,scores={damageType=!0},family=!team_pink] run tag @s add killer
execute if entity @s[family=team_gray] as @a[c=1,scores={damageType=!0},family=!team_gray] run tag @s add killer
execute if entity @s[family=team_cyan] as @a[c=1,scores={damageType=!0},family=!team_cyan] run tag @s add killer
