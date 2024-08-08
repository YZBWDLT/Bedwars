# ===== 玩家死亡标题 - Hypixel样式 =====

titleraw @s times 0 60 60
titleraw @s[scores={time=1..}] title {"rawtext":[{"translate":"style.hypixel.player_died.title"}]}
titleraw @s[scores={time=1..}] subtitle {"rawtext":[{"translate":"style.hypixel.player_died.subtitle","with":{"rawtext":[{"score":{"objective":"time","name":"@s"}}]}}]}
tellraw @s[scores={time=1..}] {"rawtext":[{"translate":"style.hypixel.player_died.message","with":{"rawtext":[{"score":{"objective":"time","name":"@s"}}]}}]}

titleraw @s[scores={time=0}] title {"rawtext":[{"translate":"style.hypixel.player_respawned.title"}]}
titleraw @s[scores={time=0}] times 10 60 60
tellraw @s[scores={time=0}] {"rawtext":[{"translate":"style.hypixel.player_respawned.message"}]}
