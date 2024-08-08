# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 移除该玩家的木棍

give @s[hasitem={item=stick,quantity=256..}] planks 128
clear @s[hasitem={item=stick,quantity=256..}] stick -1 256

give @s[hasitem={item=stick,quantity=128..}] planks 64
clear @s[hasitem={item=stick,quantity=128..}] stick -1 128

give @s[hasitem={item=stick,quantity=64..}] planks 32
clear @s[hasitem={item=stick,quantity=64..}] stick -1 64

give @s[hasitem={item=stick,quantity=32..}] planks 16
clear @s[hasitem={item=stick,quantity=32..}] stick -1 32

give @s[hasitem={item=stick,quantity=16..}] planks 8
clear @s[hasitem={item=stick,quantity=16..}] stick -1 16

give @s[hasitem={item=stick,quantity=8..}] planks 4
clear @s[hasitem={item=stick,quantity=8..}] stick -1 8

give @s[hasitem={item=stick,quantity=4..}] planks 2
clear @s[hasitem={item=stick,quantity=4..}] stick -1 4
