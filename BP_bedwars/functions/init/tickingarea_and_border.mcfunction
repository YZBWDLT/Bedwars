# ===== 添加常加载区域和边界 =====

execute if score randomMap time matches 1 run tickingarea add 0 0 0 100 0 100 "gamingArea1"
execute if score randomMap time matches 1 run tickingarea add 0 0 0 100 0 -100 "gamingArea2"
execute if score randomMap time matches 1 run tickingarea add 0 0 0 -100 0 100 "gamingArea3"
execute if score randomMap time matches 1 run tickingarea add 0 0 0 -100 0 -100 "gamingArea4"
execute if score randomMap time matches 2 run fill 100 0 100 100 0 -100 border_block
execute if score randomMap time matches 2 run fill 100 0 100 -100 0 100 border_block
execute if score randomMap time matches 2 run fill -100 0 -100 100 0 -100 border_block
execute if score randomMap time matches 2 run fill -100 0 -100 -100 0 100 border_block