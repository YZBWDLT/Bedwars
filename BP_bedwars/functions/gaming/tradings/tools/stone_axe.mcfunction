# ===== 石斧交易 =====
# 10铁锭 -> 1石斧

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=..9}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家没有低一级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={axeLevel=..0}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={axeLevel=..0}] {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"item.wooden_axe"}]}}]}

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={axeLevel=2..}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={axeLevel=2..}] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予石斧，再清除物资
execute as @s[hasitem={item=bedwars:iron_ingot,quantity=10..},scores={axeLevel=1}] at @s run function gaming/tradings/tools/stone_axe_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_stone_axe