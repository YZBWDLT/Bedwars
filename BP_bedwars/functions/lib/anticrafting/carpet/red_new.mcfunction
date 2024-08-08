# ===== 防合成机制 =====
# 清除不被允许合成的物品

# 调用此方法时：
# · 执行者为玩家
# · 执行位置任意
# · 上级函数：lib/anticrafting/carpet_new
# 输出结果：
# · 移除该玩家的地毯

give @s[hasitem={item=red_carpet,quantity=192..}] wool 128 14
clear @s[hasitem={item=red_carpet,quantity=192..}] red_carpet -1 192

give @s[hasitem={item=red_carpet,quantity=96..}] wool 64 14
clear @s[hasitem={item=red_carpet,quantity=96..}] red_carpet -1 96

give @s[hasitem={item=red_carpet,quantity=48..}] wool 32 14
clear @s[hasitem={item=red_carpet,quantity=48..}] red_carpet -1 48

give @s[hasitem={item=red_carpet,quantity=24..}] wool 16 14
clear @s[hasitem={item=red_carpet,quantity=24..}] red_carpet -1 24

give @s[hasitem={item=red_carpet,quantity=12..}] wool 8 14
clear @s[hasitem={item=red_carpet,quantity=12..}] red_carpet -1 12

give @s[hasitem={item=red_carpet,quantity=6..}] wool 4 14
clear @s[hasitem={item=red_carpet,quantity=6..}] red_carpet -1 6

give @s[hasitem={item=red_carpet,quantity=3..}] wool 2 14
clear @s[hasitem={item=red_carpet,quantity=3..}] red_carpet -1 3
