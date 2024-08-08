# ===== 获取锻炉等级 =====
# 用于检测本队锻炉等级。

# 调用此方法时：
# · 执行者任意
# · 执行位置任意
# 输出结果：
# · @e[family=team_respawn] = teamUpgrade.forge(team)

scoreboard players operation @e[name=redTeamRespawn] temp = forgeRed teamUpgrade
scoreboard players operation @e[name=blueTeamRespawn] temp = forgeBlue teamUpgrade
scoreboard players operation @e[name=yellowTeamRespawn] temp = forgeYellow teamUpgrade
scoreboard players operation @e[name=greenTeamRespawn] temp = forgeGreen teamUpgrade
scoreboard players operation @e[name=whiteTeamRespawn] temp = forgeWhite teamUpgrade
scoreboard players operation @e[name=pinkTeamRespawn] temp = forgePink teamUpgrade
scoreboard players operation @e[name=grayTeamRespawn] temp = forgeGray teamUpgrade
scoreboard players operation @e[name=cyanTeamRespawn] temp = forgeCyan teamUpgrade
