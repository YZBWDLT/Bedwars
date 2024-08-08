# ===== 标题 =====

titleraw @a times 0 40 0
execute if score gameStartCountdown time matches 10 run titleraw @a title {"rawtext":[{"translate":"§610"}]}
execute if score gameStartCountdown time matches 1..5 run titleraw @a title {"rawtext":[{"translate":"style.hypixel.game_start_countdown.in_5_seconds.title","with":{"rawtext":[{"score":{"objective":"time","name":"gameStartCountdown"}}]}}]}