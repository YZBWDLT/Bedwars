# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# 输出结果：
# · 移除该玩家的工作台

give @s[hasitem={item=crafting_table,quantity=64..}] planks 256
clear @s[hasitem={item=crafting_table,quantity=64..}] crafting_table -1 64

give @s[hasitem={item=crafting_table,quantity=32..}] planks 128
clear @s[hasitem={item=crafting_table,quantity=32..}] crafting_table -1 32

give @s[hasitem={item=crafting_table,quantity=16..}] planks 64
clear @s[hasitem={item=crafting_table,quantity=16..}] crafting_table -1 16

give @s[hasitem={item=crafting_table,quantity=8..}] planks 32
clear @s[hasitem={item=crafting_table,quantity=8..}] crafting_table -1 8

give @s[hasitem={item=crafting_table,quantity=4..}] planks 16
clear @s[hasitem={item=crafting_table,quantity=4..}] crafting_table -1 4

give @s[hasitem={item=crafting_table,quantity=2..}] planks 8
clear @s[hasitem={item=crafting_table,quantity=2..}] crafting_table -1 2

give @s[hasitem={item=crafting_table,quantity=1..}] planks 4
clear @s[hasitem={item=crafting_table,quantity=1..}] crafting_table -1 1
