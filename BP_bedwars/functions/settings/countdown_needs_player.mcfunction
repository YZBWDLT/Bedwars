# ===== 调整玩家阈值 =====

scoreboard players add startCountdownNeedsPlayer settings 1
execute if score startCountdownNeedsPlayer settings matches !2..16 run scoreboard players set startCountdownNeedsPlayer settings 2

tellraw @s {"rawtext":[{"translate":"settings.start_countdown_needs_player","with":{"rawtext":[{"score":{"objective":"settings","name":"startCountdownNeedsPlayer"}}]}}]}