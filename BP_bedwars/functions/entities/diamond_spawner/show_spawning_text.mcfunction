# ===== 显示悬浮文本 - 正常状态时 =====

# --- 先清除 ---
kill @e[type=bedwars:text_display,x=~,y=~,z=~,dx=0,dy=5,dz=0]

# --- 显示等级 ---
execute if entity @s[family=tier_1] run summon bedwars:text_display "§e等级§cI" ~~4.5~
execute if entity @s[family=tier_2] run summon bedwars:text_display "§e等级§cII" ~~4.5~
execute if entity @s[family=tier_3] run summon bedwars:text_display "§e等级§cIII" ~~4.5~

# --- 显示类别 ---
summon bedwars:text_display "§l§b钻石" ~~4~

# --- 显示下一次生成的时间 ---
## 显示展示文本
execute if score @s time matches 1..8 run function entities/diamond_spawner/text/group_1
execute if score @s time matches 9..16 run function entities/diamond_spawner/text/group_2
execute if score @s time matches 17..24 run function entities/diamond_spawner/text/group_3
execute if score @s time matches 25..32 run function entities/diamond_spawner/text/group_4
execute if score @s time matches 33..40 run function entities/diamond_spawner/text/group_5