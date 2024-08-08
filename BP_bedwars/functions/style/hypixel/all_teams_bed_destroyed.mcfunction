# ===== 所有队伍的床强制摧毁 =====

scoreboard players set @e[family=bed] haveBed 0
scoreboard players set @a haveBed 0
execute as @e[family=bed] at @s run setblock ~~~ air

execute as @a at @s run playsound mob.wither.death @s ~~~
titleraw @a times 10 60 60
titleraw @a title {"rawtext":[{"translate":"style.hypixel.bed_destroyed.title"}]}
titleraw @a subtitle {"rawtext":[{"translate":"style.hypixel.bed_destroyed.forced.subtitle"}]}
tellraw @a {"rawtext":[{"translate":"system.emerald_spawner.bed_self_destroyed"}]}