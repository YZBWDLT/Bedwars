# ===== 木镐交易 =====
# 10铁锭 -> 1木镐

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=1..}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=1..}] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予木镐，再清除物资
execute as @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=..0}] at @s run function gaming/tradings/tools/wooden_pickaxe_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_wooden_pickaxe