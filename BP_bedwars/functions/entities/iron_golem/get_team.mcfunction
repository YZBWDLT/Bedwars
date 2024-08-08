# ===== 获取铁傀儡队伍 =====
# 玩家手持铁傀儡刷怪蛋会获得标签isHoldingDreamDefender标签，持续0.5s
# 利用此特性可以判断铁傀儡附近所有玩家中真正的主人

# --- 获取最近的铁傀儡持有者，并将自己的队伍设置为其队伍 ---
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_red] run event entity @s team_red
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_blue] run event entity @s team_blue
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_green] run event entity @s team_green
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_yellow] run event entity @s team_yellow
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_white] run event entity @s team_white
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_pink] run event entity @s team_pink
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_gray] run event entity @s team_gray
execute if entity @s[family=!have_team] if entity @a[tag=isHoldingDreamDefender,c=1,family=team_cyan] run event entity @s team_cyan