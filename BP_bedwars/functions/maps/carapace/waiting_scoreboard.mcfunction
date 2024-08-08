# ===== 在大厅中等待时的记分板 ===

## 等待中标题
execute if score gameStartCountdown time matches -1 run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e    起床战争§r\n\n地图： §aCarapace\n§f玩家： §a%%s/16\n\n§f等待中...\n\n§f队伍数： §a4\n§f模式： §a经典\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } } ] } } ] }
## 倒计时中标题
execute if score gameStartCountdown time matches 0.. run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e    起床战争§r\n\n地图： §aCarapace\n§f玩家： §a%%s/16\n\n§f即将开始： §a%%s秒\n\n§f队伍数： §a4\n§f模式： §a经典\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "data", "name": "playerAmount" } }, { "score": { "objective": "time", "name": "gameStartCountdown" } } ] } } ] }
