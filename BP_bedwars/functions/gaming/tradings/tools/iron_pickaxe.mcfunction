# ===== 铁镐交易 =====
# 10铁锭 -> 1铁镐

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家没有低一级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=..0}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=..0}] {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"item.wooden_pickaxe"}]}}]}

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=2..}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=2..}] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予铁镐，再清除物资
execute as @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={pickaxeLevel=1}] at @s run function gaming/tradings/tools/iron_pickaxe_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_iron_pickaxe