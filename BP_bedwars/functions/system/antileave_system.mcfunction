# ===== 防退出重进系统 =====

# 1. 当玩家以进入游戏的状态进入时，此时若未开始游戏，直接传送到大厅；
# （举例，红队A退出，回来时要准备开下一局了，那么清除所有装备回到大厅）
execute if score gameProgress data matches 0 as @a[scores={team=!0}] at @s run function lib/modify_data/remove_team

# 2. 当玩家未游戏的状态进入时，此时若已开始游戏，直接调成旁观；
# （举例，正在打着呢，新玩家B进来了，那么直接调旁观等下一把）
scoreboard players add @a team 0
execute if score gameProgress data matches 1..2 as @a if score @s team matches 0 run gamemode spectator @s

# 3. 当玩家游戏状态进入时，但是局数错位，直接调成旁观；
# （举例，正在打着呢，上一把的红队C进来了，那么清除他的队伍数据，直接调旁观等下一把）
scoreboard players add @a gameId 0
execute if score gameProgress data matches 1..2 as @a if score @s team matches !0 unless score @s gameId = thisGame gameId run function lib/modify_data/remove_team

# 4. 当玩家游戏状态进入时，并且是本局玩家，那么改成10秒的死亡状态；
# （举例，本局蓝队D进来了，那么把他物品悉数清除，改为死亡状态）
function lib/get_data/online_tester_before
execute if score gameProgress data matches 1..2 as @a[scores={isOnline=0}] if score @s team matches !0 if score @s gameId = thisGame gameId run scoreboard players set @s[tag=isAlive] time 10
execute if score gameProgress data matches 1..2 as @a[scores={isOnline=0}] if score @s team matches !0 if score @s gameId = thisGame gameId run kill @s[tag=isAlive]
execute if score gameProgress data matches 1..2 as @a[scores={isOnline=0}] if score @s team matches !0 if score @s gameId = thisGame gameId run function lib/get_data/bed_data
execute if score gameProgress data matches 1..2 as @a[scores={isOnline=0}] if score @s team matches !0 if score @s gameId = thisGame gameId if entity @s[tag=isAlive,scores={haveBed=1}] run tellraw @s {"rawtext":[{"translate":"style.hypixel.back_to_game.have_bed"}]}
execute if score gameProgress data matches 1..2 as @a[scores={isOnline=0}] if score @s team matches !0 if score @s gameId = thisGame gameId if entity @s[tag=isAlive,scores={haveBed=0}] run tellraw @s {"rawtext":[{"translate":"style.hypixel.back_to_game.have_no_bed"}]}
function lib/get_data/online_tester_after