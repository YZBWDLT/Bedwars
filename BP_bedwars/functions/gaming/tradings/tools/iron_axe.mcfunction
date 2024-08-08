# ===== 铁斧交易 =====
# 3金锭 -> 1铁斧

# --- 当玩家物资不充足时 ---

playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=..2}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=..2}] {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

# --- 当玩家物资充足时 ---

# 玩家没有低一级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=3..},scores={axeLevel=..1}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=3..},scores={axeLevel=..1}] {"rawtext":[{"translate":"system.tradings.need_equipment","with":{"rawtext":[{"translate":"item.stone_axe"}]}}]}

# 玩家有更高级装备时，阻止购买
playsound mob.shulker.teleport @s[hasitem={item=bedwars:gold_ingot,quantity=3..},scores={axeLevel=3..}] ~~~ 1 0.5
tellraw @s[hasitem={item=bedwars:gold_ingot,quantity=3..},scores={axeLevel=3..}] {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# 先给予铁斧，再清除物资
execute as @s[hasitem={item=bedwars:gold_ingot,quantity=3..},scores={axeLevel=2}] at @s run function gaming/tradings/tools/iron_axe_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_iron_axe