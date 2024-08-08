# ===== 记分板显示 =====
# 用于为8队模式下的玩家显示当前游戏情况。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · 输出右侧的快捷栏标题

execute as @a[scores={team=0}] run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e      起床战争§r\n§88队经典模式 %%s§r\n\n%%s - §a%%s:%%s\n\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n\n§f您现在是旁观者\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "gameId", "name": "thisGame" } }, { "selector": "@e[family=next_event_name]" }, { "score": { "objective": "time", "name": "eventMinute" } }, { "score": { "objective": "time", "name": "eventSecond" } }, { "selector": "@e[family=team_red_scoreboard]" }, { "selector": "@e[family=team_blue_scoreboard]" }, { "selector": "@e[family=team_green_scoreboard]" }, { "selector": "@e[family=team_yellow_scoreboard]" }, { "selector": "@e[family=team_cyan_scoreboard]" }, { "selector": "@e[family=team_white_scoreboard]" }, { "selector": "@e[family=team_pink_scoreboard]" }, { "selector": "@e[family=team_yellow_scoreboard]" }, { "selector": "@e[family=team_gray_scoreboard]" } ] } } ] }
execute as @a[family=team_red] run titleraw @s actionbar { "rawtext": [ { "translate": "§l§e      起床战争§r\n§88队经典模式 %%s§r\n\n%%s - §a%%s:%%s\n\n%%s§7（你）\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n\n§e极筑工坊", "with": { "rawtext": [ { "score": { "objective": "gameId", "name": "thisGame" } }, { "selector": "@e[family=next_event_name]" }, { "score": { "objective": "time", "name": "eventMinute" } }, { "score": { "objective": "time", "name": "eventSecond" } }, { "selector": "@e[family=team_red_scoreboard]" }, { "selector": "@e[family=team_blue_scoreboard]" }, { "selector": "@e[family=team_green_scoreboard]" }, { "selector": "@e[family=team_yellow_scoreboard]" }, { "selector": "@e[family=team_cyan_scoreboard]" }, { "selector": "@e[family=team_white_scoreboard]" }, { "selector": "@e[family=team_pink_scoreboard]" }, { "selector": "@e[family=team_yellow_scoreboard]" }, { "selector": "@e[family=team_gray_scoreboard]" }, { "score": { "objective": "killAmount", "name": "@s" } }, { "score": { "objective": "finalKillAmount", "name": "@s" } }, { "score": { "objective": "bedDestroyedAmount", "name": "@s" } } ] } } ] }
