# ===== 喝完牛奶后 =====

tellraw @s {"rawtext":[{"translate":"system.magic_milk.drunk"}]}
scoreboard players set @s teamUpgrade 601
playsound random.drink @a ~~~ 0.6
replaceitem entity @s[hasitem={item=bedwars:magic_milk,location=slot.weapon.mainhand}] slot.weapon.mainhand 0 air