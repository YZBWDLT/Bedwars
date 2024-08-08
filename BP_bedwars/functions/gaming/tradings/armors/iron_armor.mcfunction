# ===== 铁盔甲交易 =====
# 12金锭 -> 1铁盔甲

# --- 当玩家拥有此装备时 ---
execute if entity @s[scores={armorLevel=3..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=3..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# --- 当玩家未拥有此装备时 ---

## 当玩家物资不充足时
execute if entity @s[scores={armorLevel=..2},hasitem={item=bedwars:gold_ingot,quantity=..11}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=..2},hasitem={item=bedwars:gold_ingot,quantity=..11}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当玩家物资充足时
execute if entity @s[scores={armorLevel=..2},hasitem={item=bedwars:gold_ingot,quantity=12..}] run function gaming/tradings/armors/iron_armor_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_iron_armor