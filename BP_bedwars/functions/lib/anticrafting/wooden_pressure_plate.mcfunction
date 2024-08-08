# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 移除该玩家的压力板

give @s[hasitem={item=wooden_pressure_plate,quantity=64..}] planks 128
clear @s[hasitem={item=wooden_pressure_plate,quantity=64..}] wooden_pressure_plate -1 64

give @s[hasitem={item=wooden_pressure_plate,quantity=32..}] planks 64
clear @s[hasitem={item=wooden_pressure_plate,quantity=32..}] wooden_pressure_plate -1 32

give @s[hasitem={item=wooden_pressure_plate,quantity=16..}] planks 32
clear @s[hasitem={item=wooden_pressure_plate,quantity=16..}] wooden_pressure_plate -1 16

give @s[hasitem={item=wooden_pressure_plate,quantity=8..}] planks 16
clear @s[hasitem={item=wooden_pressure_plate,quantity=8..}] wooden_pressure_plate -1 8

give @s[hasitem={item=wooden_pressure_plate,quantity=4..}] planks 8
clear @s[hasitem={item=wooden_pressure_plate,quantity=4..}] wooden_pressure_plate -1 4

give @s[hasitem={item=wooden_pressure_plate,quantity=2..}] planks 4
clear @s[hasitem={item=wooden_pressure_plate,quantity=2..}] wooden_pressure_plate -1 2

give @s[hasitem={item=wooden_pressure_plate,quantity=1..}] planks 2
clear @s[hasitem={item=wooden_pressure_plate,quantity=1..}] wooden_pressure_plate -1 1
