# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 移除该玩家的末地石砖

give @s[hasitem={item=end_bricks,quantity=256..}] end_stone 256
clear @s[hasitem={item=end_bricks,quantity=256..}] end_bricks -1 256

give @s[hasitem={item=end_bricks,quantity=128..}] end_stone 128
clear @s[hasitem={item=end_bricks,quantity=128..}] end_bricks -1 128

give @s[hasitem={item=end_bricks,quantity=64..}] end_stone 64
clear @s[hasitem={item=end_bricks,quantity=64..}] end_bricks -1 64

give @s[hasitem={item=end_bricks,quantity=32..}] end_stone 32
clear @s[hasitem={item=end_bricks,quantity=32..}] end_bricks -1 32

give @s[hasitem={item=end_bricks,quantity=16..}] end_stone 16
clear @s[hasitem={item=end_bricks,quantity=16..}] end_bricks -1 16

give @s[hasitem={item=end_bricks,quantity=8..}] end_stone 8
clear @s[hasitem={item=end_bricks,quantity=8..}] end_bricks -1 8

give @s[hasitem={item=end_bricks,quantity=4..}] end_stone 4
clear @s[hasitem={item=end_bricks,quantity=4..}] end_bricks -1 4


