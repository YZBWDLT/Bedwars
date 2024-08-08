# ===== 场景重置器 =====
# 用于重置场景。

# 调用此方法时：
# · 执行者需为名为sceneReseter的标记实体
# · 执行位置需在名为sceneReseter的标记实体的位置上
# 输出结果：
# · 在sceneReseter的高度上的(-99,~,-99)至(99,~,99)的方块都将被清空，并将sceneReseter高度降低一格；
# · 当sceneReseter降低到y=-1的位置上时，输出active.randomMap += 1，time.randomMap = 0，并清除自身


fill 0 ~ 0 99 ~ 99 air
fill 0 ~ 0 99 ~ -99 air
fill 0 ~ 0 -99 ~ 99 air
fill 0 ~ 0 -99 ~ -99 air
tp @s ~~-1~
execute if entity @s[x=~,y=-1,z=~,dx=0,dy=-10,dz=0] run function lib/modify_data/generating_map_next_phase
execute if entity @s[x=~,y=-1,z=~,dx=0,dy=-10,dz=0] run kill @s
