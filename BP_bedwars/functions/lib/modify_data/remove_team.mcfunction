# ===== 清除队伍 =====
# 清除旁观者的队伍设定

# 调用此方法时：
# · 执行者任意，但需设定
# · 执行位置任意
# 输出结果：
# · 按该玩家队伍穿上皮革头盔和皮革胸甲

clear @s
event entity @s remove_team
tag @s remove isAlive
scoreboard players set @s team 0