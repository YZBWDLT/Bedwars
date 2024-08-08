# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 移除该玩家的木制按钮

give @s[hasitem={item=wooden_button,quantity=64..}] planks 64
clear @s[hasitem={item=wooden_button,quantity=64..}] wooden_button -1 64

give @s[hasitem={item=wooden_button,quantity=32..}] planks 32
clear @s[hasitem={item=wooden_button,quantity=32..}] wooden_button -1 32

give @s[hasitem={item=wooden_button,quantity=16..}] planks 16
clear @s[hasitem={item=wooden_button,quantity=16..}] wooden_button -1 16

give @s[hasitem={item=wooden_button,quantity=8..}] planks 8
clear @s[hasitem={item=wooden_button,quantity=8..}] wooden_button -1 8

give @s[hasitem={item=wooden_button,quantity=4..}] planks 4
clear @s[hasitem={item=wooden_button,quantity=4..}] wooden_button -1 4

give @s[hasitem={item=wooden_button,quantity=2..}] planks 2
clear @s[hasitem={item=wooden_button,quantity=2..}] wooden_button -1 2

give @s[hasitem={item=wooden_button,quantity=1..}] planks 1
clear @s[hasitem={item=wooden_button,quantity=1..}] wooden_button -1 1
