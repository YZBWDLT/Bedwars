# ===== 钻石生成器计时器 =====

# 倒计时
scoreboard players add @s time -1

# 生成
execute if score @s time matches 0 run event entity @s spawned_resource
execute if score @s time matches 0 run structure load resources:diamond ~~1~

# 复原倒计时
scoreboard players set @s[scores={time=!1..40},family=tier_1] time 40
scoreboard players set @s[scores={time=!1..30},family=tier_2] time 30
scoreboard players set @s[scores={time=!1..20},family=tier_3] time 20
