# ===== 传送玩家到重生点 =====
# 用于将玩家传送到本队重生点，并面向自家的床。

# 调用此方法时：
# · 执行者需为玩家
# · 执行位置任意
# 输出结果：
# · 玩家传送到自身队伍重生点，并面向自家的床。

# 因event给予标签有延迟，因此这里必须使用瞬时的记分板
execute at @e[name=redTeamRespawn] run tp @s[scores={team=1}] ~~~ facing @e[c=1,family=bed,family=team_red]
execute at @e[name=blueTeamRespawn] run tp @s[scores={team=2}] ~~~ facing @e[c=1,family=bed,family=team_blue]
execute at @e[name=greenTeamRespawn] run tp @s[scores={team=3}] ~~~ facing @e[c=1,family=bed,family=team_green]
execute at @e[name=yellowTeamRespawn] run tp @s[scores={team=4}] ~~~ facing @e[c=1,family=bed,family=team_yellow]
execute at @e[name=whiteTeamRespawn] run tp @s[scores={team=5}] ~~~ facing @e[c=1,family=bed,family=team_white]
execute at @e[name=pinkTeamRespawn] run tp @s[scores={team=6}] ~~~ facing @e[c=1,family=bed,family=team_pink]
execute at @e[name=grayTeamRespawn] run tp @s[scores={team=7}] ~~~ facing @e[c=1,family=bed,family=team_gray]
execute at @e[name=cyanTeamRespawn] run tp @s[scores={team=8}] ~~~ facing @e[c=1,family=bed,family=team_cyan]
