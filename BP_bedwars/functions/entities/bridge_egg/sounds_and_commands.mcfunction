# ===== 搭桥蛋机制 =====

# --- 在自己的下方填充方块 ---
execute if entity @s[family=team_red] run fill ~-1~-2~-1~1~-2~1 wool["color":"red"] keep
execute if entity @s[family=team_blue] run fill ~-1~-2~-1~1~-2~1 wool["color":"blue"] keep
execute if entity @s[family=team_green] run fill ~-1~-2~-1~1~-2~1 wool["color":"lime"] keep
execute if entity @s[family=team_yellow] run fill ~-1~-2~-1~1~-2~1 wool["color":"yellow"] keep
execute if entity @s[family=team_white] run fill ~-1~-2~-1~1~-2~1 wool["color":"white"] keep
execute if entity @s[family=team_pink] run fill ~-1~-2~-1~1~-2~1 wool["color":"pink"] keep
execute if entity @s[family=team_gray] run fill ~-1~-2~-1~1~-2~1 wool["color":"gray"] keep
execute if entity @s[family=team_cyan] run fill ~-1~-2~-1~1~-2~1 wool["color":"cyan"] keep

# --- 向所有玩家播放音效 ---
playsound random.pop @a ~~~ 1 1