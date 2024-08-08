# ===== 显示悬浮文本 - 正常状态时 =====

# --- 先清除 ---
kill @e[type=bedwars:text_display,x=~,y=~,z=~,dx=0,dy=5,dz=0]

# --- 显示等级 ---
execute if entity @s[family=tier_1,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cI" ~~4.5~
execute if entity @s[family=tier_2,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cII" ~~4.5~
execute if entity @s[family=tier_3,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cIII" ~~4.5~

# --- 显示类别 ---
execute if entity @s[family=!should_not_show_text] run summon bedwars:text_display "§l§2绿宝石" ~~4~

# --- 显示下一次生成的时间 ---
## 显示展示文本
execute if entity @s[family=!should_not_show_text] if score @s time matches 1..10 run function entities/emerald_spawner/text/group_1
execute if entity @s[family=!should_not_show_text] if score @s time matches 11..20 run function entities/emerald_spawner/text/group_2
execute if entity @s[family=!should_not_show_text] if score @s time matches 21..30 run function entities/emerald_spawner/text/group_3
execute if entity @s[family=!should_not_show_text] if score @s time matches 31..40 run function entities/emerald_spawner/text/group_4
execute if entity @s[family=!should_not_show_text] if score @s time matches 41..50 run function entities/emerald_spawner/text/group_5