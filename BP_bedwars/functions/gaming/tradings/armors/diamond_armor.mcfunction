# ===== 钻石盔甲交易 =====
# 6绿宝石 -> 1钻石盔甲

# --- 当玩家拥有此装备时 ---
execute if entity @s[scores={armorLevel=4..}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=4..}] run tellraw @s {"rawtext":[{"translate":"system.tradings.already_have_equipment"}]}

# --- 当玩家未拥有此装备时 ---

## 当玩家物资不充足时
execute if entity @s[scores={armorLevel=..3},hasitem={item=bedwars:emerald,quantity=..5}] run playsound mob.shulker.teleport @s ~~~ 1 0.5
execute if entity @s[scores={armorLevel=..3},hasitem={item=bedwars:emerald,quantity=..5}] run tellraw @s {"rawtext":[{"translate":"system.tradings.need_more_resources"}]}

## 当玩家物资充足时
execute if entity @s[scores={armorLevel=..3},hasitem={item=bedwars:emerald,quantity=6..}] run function gaming/tradings/armors/diamond_armor_2

# --- 清除标记物品 ---
clear @s bedwars:shopitem_diamond_armor