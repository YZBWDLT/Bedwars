# ===== 启用/禁用开发模式 =====

# --- 在0和1之间切换settings.developerMode ---
scoreboard players add developerMode settings 1
execute if score developerMode settings matches !0..1 run scoreboard players set developerMode settings 0

# --- 消息提醒 ---

## 关闭后的提醒
execute if score developerMode settings matches 0 run tellraw @a {"rawtext":[{"translate":"developer.developer_mode.off"}]}
execute if score developerMode settings matches 0 run clear @a ender_pearl
execute if score developerMode settings matches 0 run clear @a netherbrick

## 开启后的提醒
execute if score developerMode settings matches 1 run tellraw @a {"rawtext":[{"translate":"developer.developer_mode.on"}]}
execute if score developerMode settings matches 1 run gamemode creative @a
