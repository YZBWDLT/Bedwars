# ===== 剪刀交易 =====
# 20铁锭 -> 1剪刀

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..19}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..19}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=20..},tag=shearsUnlocked] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=20..},tag=shearsUnlocked] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予剪刀，再清除物资
execute as @s[hasitem={item=bedwars:iron_ingot,quantity=20..},tag=!shearsUnlocked] at @s run function gaming/tradings/tools/shears_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_shears