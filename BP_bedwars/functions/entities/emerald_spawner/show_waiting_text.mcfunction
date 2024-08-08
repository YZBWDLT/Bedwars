# ===== 显示悬浮文本 - 等待状态时 =====

# --- 先清除 ---
kill @e[type=bedwars:text_display,x=~,y=~,z=~,dx=0,dy=5,dz=0]

# --- 显示等级 ---
execute if entity @s[family=tier_1,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cI" ~~4.5~
execute if entity @s[family=tier_2,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cII" ~~4.5~
execute if entity @s[family=tier_3,family=!should_not_show_text] run summon bedwars:text_display "§e等级§cIII" ~~4.5~

# --- 显示类别 ---
execute if entity @s[family=!should_not_show_text] run summon bedwars:text_display "§l§2绿宝石" ~~4~

# --- 显示下一次生成的时间 ---
execute if entity @s[family=!should_not_show_text] run summon bedwars:text_display "§c生成已满" ~~3.5~
