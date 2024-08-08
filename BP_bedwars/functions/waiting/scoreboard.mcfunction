# ===== 等待期间的记分板 =====

# --- 显示记分板 ---

## 生成中记分板
execute as @a at @s if score randomMap active matches 1 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e  起床战争§r\n\n§f选定地图中...\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }
execute as @a at @s if score randomMap active matches 2 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e  起床战争§r\n\n§f生成常加载区域\n与边界中...\n预计需要2秒钟\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }
execute as @a at @s if score randomMap active matches 3 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e  起床战争§r\n\n§f清理原地图中...\n预计需要1分钟\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }
execute as @a at @s if score randomMap active matches 4 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e  起床战争§r\n\n§f生成地图中...\n预计需要5秒钟\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }
execute as @a at @s if score randomMap active matches 5 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e  起床战争§r\n\n§f确定队伍中...\n预计需要2秒钟\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }

## 生成后记分板
execute as @a at @s if score randomMap active matches 0 if score randomMap data matches 1 run function maps/boletum/waiting_scoreboard
execute as @a at @s if score randomMap active matches 0 if score randomMap data matches 2 run function maps/carapace/waiting_scoreboard
execute as @a at @s if score randomMap active matches 0 if score randomMap data matches 3 run function maps/picnic/waiting_scoreboard
