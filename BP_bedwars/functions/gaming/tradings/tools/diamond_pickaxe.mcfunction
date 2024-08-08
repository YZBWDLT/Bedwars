# ===== 钻石镐交易 =====
# 6金锭 -> 1钻石镐

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..5}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..5}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家没有低一级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=6..},scores={pickaxeLevel=..2}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=6..},scores={pickaxeLevel=..2}] {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"item.golden_pickaxe"}]}}]}

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=6..},scores={pickaxeLevel=4..}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=6..},scores={pickaxeLevel=4..}] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予钻石镐，再清除物资
execute as @s[hasitem={item=bedwars:gold_ingot,quantity=6..},scores={pickaxeLevel=3}] at @s run function gaming/tradings/tools/diamond_pickaxe_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_diamond_pickaxe