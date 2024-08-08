# ===== Hypixel样式 - 蓝队成员被杀死 =====

# --- 玩家有床时死亡 ---

# XXX死了。
execute if entity @s[scores={deathType=0,haveBed=1}] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.died","with":{"rawtext":[{"translate":"§9%%s","with":{"rawtext":[{"selector":"@s"}]}}]}}]}
# XXX失足跌入虚空。
execute if entity @s[scores={deathType=1,haveBed=1}] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.fall_into_void","with":{"rawtext":[{"translate":"§9%%s","with":{"rawtext":[{"selector":"@s"}]}}]}}]}
# XXX被XXX击杀。
execute if entity @s[scores={deathType=2,haveBed=1}] run function style/hypixel/teams/blue/normal_kill/be_killed
# XXX被XXX射杀。
execute if entity @s[scores={deathType=3,haveBed=1}] run function style/hypixel/teams/blue/normal_kill/be_shot
# XXX被XXX扔下了虚空。
execute if entity @s[scores={deathType=4,haveBed=1}] run function style/hypixel/teams/blue/normal_kill/be_killed_void
# XXX被XXX扔下了悬崖。
execute if entity @s[scores={deathType=5,haveBed=1}] run function style/hypixel/teams/blue/normal_kill/be_killed_fall

# --- 玩家无床时死亡 ---
# XXX死了。最终击杀！
execute if entity @s[scores={deathType=0,haveBed=0}] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.died","with":{"rawtext":[{"translate":"§9%%s","with":{"rawtext":[{"selector":"@s"}]}}]}}]}
# XXX失足跌入虚空。最终击杀！
execute if entity @s[scores={deathType=1,haveBed=0}] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.fall_into_void","with":{"rawtext":[{"translate":"§9%%s","with":{"rawtext":[{"selector":"@s"}]}}]}}]}
# XXX被XXX击杀。最终击杀！
execute if entity @s[scores={deathType=2,haveBed=0}] run function style/hypixel/teams/blue/final_kill/be_killed
# XXX被XXX射杀。最终击杀！
execute if entity @s[scores={deathType=3,haveBed=0}] run function style/hypixel/teams/blue/final_kill/be_shot
# XXX被XXX扔下了虚空。最终击杀！
execute if entity @s[scores={deathType=4,haveBed=0}] run function style/hypixel/teams/blue/final_kill/be_killed_void
# XXX被XXX扔下了悬崖。最终击杀！
execute if entity @s[scores={deathType=5,haveBed=0}] run function style/hypixel/teams/blue/final_kill/be_killed_fall
