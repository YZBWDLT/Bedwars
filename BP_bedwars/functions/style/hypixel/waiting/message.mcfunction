# ===== 消息 =====
execute if score gameStartCountdown time matches 20 run tellraw @a {"rawtext":[{"translate":"style.hypixel.game_start_countdown.20_seconds.message"}]}
execute if score gameStartCountdown time matches 10 run tellraw @a {"rawtext":[{"translate":"style.hypixel.game_start_countdown.10_seconds.message"}]}
execute if score gameStartCountdown time matches 1..5 run tellraw @a {"rawtext":[{"translate":"style.hypixel.game_start_countdown.in_5_seconds.message","with":{"rawtext":[{"score":{"objective":"time","name":"gameStartCountdown"}}]}}]}