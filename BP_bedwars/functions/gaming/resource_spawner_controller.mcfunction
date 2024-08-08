# ===== 资源生成控制器 =====

# --- 获取最近的重生点的队伍归属，并将资源点等级设定为对应队伍的锻炉等级 ---
# 每1秒1次，设置为time.tick=2获取是为了和其它进程错开，提升性能
execute if score tick time matches 2 run function lib/get_data/forge_level

# --- 按队伍升级 ---
execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=1}] at @s run event entity @e[family=iron_spawner,c=1] spawn_as_tier_2
execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=1}] at @s run event entity @e[family=gold_spawner,c=1] spawn_as_tier_2

execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=2}] at @s run event entity @e[family=iron_spawner,c=1] spawn_as_tier_3
execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=2}] at @s run event entity @e[family=gold_spawner,c=1] spawn_as_tier_3

execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=3..}] at @s as @e[family=iron_spawner,c=1] at @s unless entity @e[family=emerald_spawner,r=1] run summon bedwars:emerald_spawner ~~1~
execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=3..}] at @s run event entity @e[family=emerald_spawner,r=15] spawn_as_tier_3_should_not_show_text

execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=4}] at @s run event entity @e[family=iron_spawner,c=1] spawn_as_tier_4
execute if score tick time matches 2 as @e[family=team_respawn,scores={temp=4}] at @s run event entity @e[family=gold_spawner,c=1] spawn_as_tier_4


# --- 对重生点周围的15格范围内的生成器加上隐身效果 ---
execute if score tick time matches 2 as @e[family=team_respawn] at @s as @e[family=resource_spawner,r=15] run event entity @s hide

# --- 资源生成 ---
# 完全由行为文件控制