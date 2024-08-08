# ===== 锁链盔甲交易 =====
# 24铁锭 -> 1锁链盔甲

# --- 当玩家拥有此装备时 ---
execute if entity @s[scores={armorLevel=2..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=2..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# --- 当玩家未拥有此装备时 ---

## 当玩家物资不充足时
execute if entity @s[scores={armorLevel=..1},hasitem={item=bedwars:iron_ingot,quantity=..23}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=..1},hasitem={item=bedwars:iron_ingot,quantity=..23}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当玩家物资充足时
execute if entity @s[scores={armorLevel=..1},hasitem={item=bedwars:iron_ingot,quantity=24..}] run function gaming/tradings/armors/chain_armor_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_chain_armor